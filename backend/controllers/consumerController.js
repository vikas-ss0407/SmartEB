const Consumer = require('../models/consumer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Process meter image via AI service
exports.validateMeterImage = async (req, res) => {
  try {
    const { consumerNumber, userReading, aiExtractedReading, manualReading } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    if (!consumerNumber) {
      return res.status(400).json({ message: 'Consumer number is required' });
    }

    if (!userReading) {
      return res.status(400).json({ message: 'User reading is required' });
    }

    // Create form data for AI service
    const formData = new FormData();
    formData.append('image', fs.createReadStream(req.file.path));
    formData.append('user_reading', userReading);

    try {
      // Call AI service
      const aiResponse = await axios.post(
        'http://localhost:8000/validate-meter',
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 30000
        }
      );

      // Delete the uploaded file
      fs.unlinkSync(req.file.path);

      if (aiResponse.data.status === 'VALID') {
        // Check if OCR extraction was successful
        const ocrReading = aiResponse.data.meter_reading;
        
        if (!ocrReading || ocrReading.trim() === '') {
          // OCR failed - user must enter manually
          return res.status(400).json({ 
            status: 'OCR_FAILED',
            message: 'Could not extract reading from image. Please enter manually.',
            image_valid: aiResponse.data.image_valid,
            reason: 'No valid meter reading could be extracted. Image is valid but OCR failed to detect digits.'
          });
        }

        // Update consumer record with the reading
        const consumer = await Consumer.findOne({ consumerNumber });
        if (!consumer) {
          return res.status(404).json({ message: 'Consumer not found' });
        }

        const previousReading = consumer.currentReading || 0;
        const currentReading = parseFloat(userReading);
        const unitsConsumed = currentReading - previousReading;

        // Check if current reading is strictly greater than previous reading
        if (currentReading <= previousReading) {
          return res.status(400).json({ 
            status: 'INVALID',
            reason: `Current reading (${currentReading}) must be greater than previous reading (${previousReading})`,
            ocr_value: ocrReading
          });
        }

        // Validate readings match (AI extracted vs Manual vs Submitted)
        const aiValue = parseFloat(ocrReading);
        const manualValue = parseFloat(manualReading) || currentReading;
        
        const readingsDifference = Math.abs(aiValue - manualValue);
        if (readingsDifference > 1) {
          return res.status(400).json({ 
            status: 'INVALID',
            reason: `Readings do not match. AI extracted: ${aiValue}, Your entry: ${manualValue}. Difference: ${readingsDifference.toFixed(2)} units`,
            ocr_value: ocrReading
          });
        }

        const tariffRates = {
          domestic: 5,
          commercial: 10,
          industrial: 15,
        };

        const rate = tariffRates[consumer.tariffPlan.toLowerCase()] || 5;
        const amount = unitsConsumed * rate;

        consumer.currentReading = currentReading;
        consumer.amount = amount;
        
        if (!consumer.readings) consumer.readings = [];
        consumer.readings.push({
          date: new Date(),
          units: unitsConsumed,
          aiExtractedReading: aiValue,
          manualReading: manualValue
        });

        await consumer.save();

        return res.json({
          status: 'VALID',
          meter_reading: ocrReading,
          manual_reading: manualReading,
          units_consumed: unitsConsumed,
          amount: amount,
          consumer: consumer
        });
      } else {
        return res.status(400).json(aiResponse.data);
      }
    } catch (aiError) {
      // Delete the uploaded file if exists
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      console.error('AI Service error:', aiError.message);
      return res.status(500).json({ 
        message: 'Error communicating with AI service',
        details: aiError.message 
      });
    }
  } catch (err) {
    // Clean up uploaded file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error('Error deleting file:', e);
      }
    }
    res.status(500).json({ message: err.message });
  }
};
      

// Add new consumer
exports.addConsumer = async (req, res) => {
  try {
    const existing = await Consumer.findOne({ consumerNumber: req.body.consumerNumber });
    if (existing) return res.status(400).json({ message: 'Consumer already exists' });

    const consumer = new Consumer(req.body);
    await consumer.save();
    res.status(201).json(consumer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all consumers
exports.getConsumers = async (req, res) => {
  try {
    const consumers = await Consumer.find();
    res.json(consumers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete consumer by consumerNumber
exports.deleteConsumer = async (req, res) => {
  try {
    const result = await Consumer.findOneAndDelete({ consumerNumber: req.params.consumerNumber });
    if (!result) return res.status(404).json({ message: 'Consumer not found' });
    res.json({ message: 'Consumer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get consumer by number
exports.getConsumer = async (req, res) => {
  try {
    const consumer = await Consumer.findOne({ consumerNumber: req.params.consumerNumber });
    if (!consumer) return res.status(404).json({ message: 'Consumer not found' });
    res.json(consumer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update reading & calculate amount
exports.addReading = async (req, res) => {
  const { consumerNumber } = req.params;
  const { unitsConsumed, readingDate } = req.body;

  if (typeof unitsConsumed !== 'number') {
    return res.status(400).json({ message: 'Invalid unitsConsumed' });
  }

  const parsedDate = new Date(readingDate);
  if (isNaN(parsedDate)) {
    return res.status(400).json({ message: 'Invalid reading date' });
  }

  try {
    const consumer = await Consumer.findOne({ consumerNumber });
    if (!consumer) return res.status(404).json({ message: 'Consumer not found' });

    consumer.currentReading += unitsConsumed;

    const tariffRates = {
      domestic: 5,
      commercial: 10,
      industrial: 15,
    };

    const rate = tariffRates[consumer.tariffPlan.toLowerCase()];
    if (!rate) return res.status(400).json({ message: 'Invalid tariff plan' });

    consumer.amount = consumer.currentReading * rate;

    // Add reading entry to history
    if (!consumer.readings) consumer.readings = [];

    consumer.readings.push({
      date: parsedDate,
      units: unitsConsumed
    });

    await consumer.save();

    res.json(consumer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateConsumer = async (req, res) => {
  try {
    const { consumerNumber } = req.params;
    const updatedData = req.body;

    const consumer = await Consumer.findOneAndUpdate(
      { consumerNumber },
      updatedData,
      { new: true, runValidators: true } // Return the updated document and validate the data
    );

    if (!consumer) return res.status(404).json({ message: 'Consumer not found' });

    res.json(consumer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getConsumerByNumber = async (req, res) => {
  try {
    const consumer = await Consumer.findOne({ consumerNumber: req.params.consumerNumber });
    if (!consumer) return res.status(404).json({ message: 'Consumer not found' });

    // Get the last reading from the readings array
    const lastReading = consumer.readings.length > 0 ? consumer.readings[consumer.readings.length - 1] : null;

    res.json({
      name: consumer.name,
      meterSerialNumber: consumer.meterSerialNumber,
      previousReading: lastReading ? lastReading.units : 0, // Use the last reading's units or 0 if no readings exist
      tariffPlan: consumer.tariffPlan,
    });
  } catch (error) {
    console.error('Error fetching consumer details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addCitizenReading = async (req, res) => {
  const { consumerNumber } = req.params;
  const { unitsConsumed, readingDate } = req.body;

  if (typeof unitsConsumed !== 'number') {
    return res.status(400).json({ message: 'Invalid unitsConsumed' });
  }

  const parsedDate = new Date(readingDate);
  if (isNaN(parsedDate)) {
    return res.status(400).json({ message: 'Invalid reading date' });
  }

  try {
    // Find the consumer by consumerNumber
    const consumer = await Consumer.findOne({ consumerNumber });
    if (!consumer) return res.status(404).json({ message: 'Consumer not found' });

    // Ensure the consumer is a citizen (not admin)
    if (consumer.role !== 'citizen') {
      return res.status(403).json({ message: 'You are not authorized to update this reading' });
    }

    // Update the current reading
    consumer.currentReading += unitsConsumed;

    const tariffRates = {
      domestic: 5,
      commercial: 10,
      industrial: 15,
    };

    const rate = tariffRates[consumer.tariffPlan.toLowerCase()];
    if (!rate) return res.status(400).json({ message: 'Invalid tariff plan' });

    consumer.amount = consumer.currentReading * rate;

    // Add reading entry to history
    if (!consumer.readings) consumer.readings = [];

    consumer.readings.push({
      date: parsedDate,
      units: unitsConsumed,
    });

    await consumer.save();

    res.json({ message: 'Reading updated successfully', consumer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getConsumerDetailsByNumber = async (req, res) => {
  try {
    const consumer = await Consumer.findOne({ consumerNumber: req.params.consumerNumber });
    if (!consumer) return res.status(404).json({ message: 'Consumer not found' });

    const lastReading = consumer.readings.length > 0 ? consumer.readings[consumer.readings.length - 1] : null;

    res.json({
      name: consumer.name,
      meterSerialNumber: consumer.meterSerialNumber,
      amount: consumer.amount,
      lastReadingDate: lastReading ? lastReading.date : null,
      tariffPlan: consumer.tariffPlan,
    });
  } catch (error) {
    console.error('Error fetching consumer details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Calculate fine amount with GST/CGST
const calculateFine = (billAmount) => {
  const FINE_PERCENTAGE = 0.10; // 10% fine on bill amount
  const CGST = 0.09; // 9% CGST
  const SGST = 0.09; // 9% SGST
  
  const fineAmount = billAmount * FINE_PERCENTAGE;
  const cgstOnFine = fineAmount * CGST;
  const sgstOnFine = fineAmount * SGST;
  const totalFineWithTax = fineAmount + cgstOnFine + sgstOnFine;
  
  return {
    fineAmount: parseFloat(fineAmount.toFixed(2)),
    cgstOnFine: parseFloat(cgstOnFine.toFixed(2)),
    sgstOnFine: parseFloat(sgstOnFine.toFixed(2)),
    totalFineWithTax: parseFloat(totalFineWithTax.toFixed(2))
  };
};

// Get bill summary with deadline and reminder
exports.getBillSummary = async (req, res) => {
  try {
    const consumer = await Consumer.findOne({ consumerNumber: req.params.consumerNumber });
    if (!consumer) return res.status(404).json({ message: 'Consumer not found' });

    const now = new Date();
    const billDeadline = consumer.nextPaymentDeadline ? new Date(consumer.nextPaymentDeadline) : null;
    
    // If no deadline, set one based on bill cycle
    if (!billDeadline) {
      const newDeadline = new Date();
      newDeadline.setDate(newDeadline.getDate() + (consumer.billCycleDays || 30));
      consumer.nextPaymentDeadline = newDeadline;
      await consumer.save();
    }

    const daysUntilDeadline = billDeadline ? Math.ceil((billDeadline - now) / (1000 * 60 * 60 * 24)) : 0;
    const isOverdue = billDeadline && now > billDeadline;
    
    // Apply fine if overdue and not already applied
    let totalBillAmount = consumer.amount;
    let fineDetails = {
      fineAmount: 0,
      cgstOnFine: 0,
      sgstOnFine: 0,
      totalFineWithTax: 0
    };

    if (isOverdue && !consumer.isFineApplied) {
      fineDetails = calculateFine(consumer.amount);
      consumer.fineAmount = fineDetails.fineAmount;
      consumer.cgstOnFine = fineDetails.cgstOnFine;
      consumer.sgstOnFine = fineDetails.sgstOnFine;
      consumer.totalFineWithTax = fineDetails.totalFineWithTax;
      consumer.isFineApplied = true;
      consumer.fineAppliedDate = new Date();
      consumer.paymentStatus = 'Overdue';
      await consumer.save();
    } else if (consumer.isFineApplied) {
      fineDetails = {
        fineAmount: consumer.fineAmount,
        cgstOnFine: consumer.cgstOnFine,
        sgstOnFine: consumer.sgstOnFine,
        totalFineWithTax: consumer.totalFineWithTax
      };
    }

    if (isOverdue && consumer.isFineApplied) {
      totalBillAmount = consumer.amount + consumer.totalFineWithTax;
    }

    // Determine reminder message
    let reminderMessage = '';
    let reminderType = 'none';
    
    if (isOverdue) {
      reminderType = 'overdue';
      reminderMessage = `⚠️ OVERDUE: Your bill payment was due on ${billDeadline.toDateString()}. Please pay immediately to avoid further penalties.`;
    } else if (daysUntilDeadline <= 3 && daysUntilDeadline > 0) {
      reminderType = 'urgent';
      reminderMessage = `🔴 URGENT: Only ${daysUntilDeadline} day(s) left to pay your bill! Deadline: ${billDeadline.toDateString()}`;
    } else if (daysUntilDeadline <= 7 && daysUntilDeadline > 3) {
      reminderType = 'warning';
      reminderMessage = `🟡 REMINDER: Your bill is due in ${daysUntilDeadline} days. Deadline: ${billDeadline.toDateString()}`;
    } else if (daysUntilDeadline > 7) {
      reminderType = 'notice';
      reminderMessage = `ℹ️ Upcoming Bill: Your next payment is due on ${billDeadline.toDateString()} (${daysUntilDeadline} days remaining)`;
    }

    res.json({
      consumerNumber: consumer.consumerNumber,
      name: consumer.name,
      address: consumer.address,
      phoneNumber: consumer.phoneNumber,
      meterSerialNumber: consumer.meterSerialNumber,
      tariffPlan: consumer.tariffPlan,
      
      // Bill Details
      billAmount: consumer.amount,
      currentReading: consumer.currentReading,
      paymentStatus: consumer.paymentStatus,
      lastPaymentDate: consumer.lastPaymentDate,
      
      // Deadline & Reminder
      billCycleDays: consumer.billCycleDays,
      nextPaymentDeadline: billDeadline,
      daysUntilDeadline: daysUntilDeadline,
      isOverdue: isOverdue,
      
      // Fine Details
      isFineApplied: consumer.isFineApplied,
      fineDetails: fineDetails,
      
      // Total Amount (Bill + Fine if applicable)
      totalAmountDue: parseFloat(totalBillAmount.toFixed(2)),
      
      // Reminder
      reminderMessage: reminderMessage,
      reminderType: reminderType
    });
  } catch (error) {
    console.error('Error fetching bill summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark payment as paid
exports.markPaymentAsPaid = async (req, res) => {
  try {
    const consumer = await Consumer.findOne({ consumerNumber: req.params.consumerNumber });
    if (!consumer) return res.status(404).json({ message: 'Consumer not found' });

    consumer.paymentStatus = 'Paid';
    consumer.lastPaymentDate = new Date();
    // Clear current bill amount once payment is completed
    consumer.amount = 0;
    
    // Reset fine and reminder flags for next cycle
    consumer.isFineApplied = false;
    consumer.fineAmount = 0;
    consumer.cgstOnFine = 0;
    consumer.sgstOnFine = 0;
    consumer.totalFineWithTax = 0;
    consumer.reminderSent7Days = false;
    consumer.reminderSent3Days = false;
    consumer.overdueReminderSent = false;
    
    // Set next deadline for next bill cycle
    const nextDeadline = new Date();
    nextDeadline.setDate(nextDeadline.getDate() + (consumer.billCycleDays || 30));
    consumer.nextPaymentDeadline = nextDeadline;
    
    await consumer.save();

    res.json({ 
      message: 'Payment marked as successful',
      consumer: consumer
    });
  } catch (error) {
    console.error('Error marking payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all consumers with fines (for admin)
exports.getConsumersWithFines = async (req, res) => {
  try {
    const consumersWithFines = await Consumer.find({ 
      isFineApplied: true,
      isOverdue: true 
    }).select(
      'consumerNumber name address phoneNumber meterSerialNumber tariffPlan amount fineAmount cgstOnFine sgstOnFine totalFineWithTax fineAppliedDate paymentStatus'
    );

    res.json(consumersWithFines);
  } catch (error) {
    console.error('Error fetching consumers with fines:', error);
    res.status(500).json({ message: 'Server error' });
  }
};