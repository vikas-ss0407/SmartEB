const Consumer = require('../models/consumer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Utility to derive payment deadline: reading window ends on 15th, then 15 days to pay
const computePaymentDeadline = (readingDate) => {
  const d = new Date(readingDate);
  const readingWindowEnd = new Date(d.getFullYear(), d.getMonth(), 15, 23, 59, 59);
  const baseDate = d <= readingWindowEnd ? readingWindowEnd : d;
  const deadline = new Date(baseDate);
  deadline.setDate(deadline.getDate() + 15);
  return deadline;
};

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

        // New billing window: reading captured now, payment due 15 days after reading window end (15th)
        consumer.lastBillDate = new Date();
        consumer.nextPaymentDeadline = computePaymentDeadline(consumer.lastBillDate);
        consumer.paymentStatus = 'Pending';

        // Reset any previous penalties when a fresh bill is generated
        consumer.isFineApplied = false;
        consumer.fineAmount = 0;
        consumer.cgstOnFine = 0;
        consumer.sgstOnFine = 0;
        consumer.totalFineWithTax = 0;
        
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
    
    // Auto-correct status if amount is 0 and status is Pending
    if (consumer.amount === 0 && consumer.paymentStatus === 'Pending') {
      consumer.paymentStatus = 'Paid';
      consumer.nextPaymentDeadline = null;
      await consumer.save();
    }
    
    res.json(consumer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update reading & calculate amount
exports.addReading = async (req, res) => {
  const { consumerNumber } = req.params;
  const { unitsConsumed, readingDate, currentReading } = req.body;

  const parsedUnits = Number(unitsConsumed);
  if (!Number.isFinite(parsedUnits)) {
    return res.status(400).json({ message: 'Invalid unitsConsumed' });
  }

  const parsedDate = new Date(readingDate);
  if (isNaN(parsedDate)) {
    return res.status(400).json({ message: 'Invalid reading date' });
  }

  try {
    const consumer = await Consumer.findOne({ consumerNumber });
    if (!consumer) return res.status(404).json({ message: 'Consumer not found' });

    const previous = consumer.currentReading || 0;
    const newReading = Number.isFinite(currentReading) ? Number(currentReading) : previous + parsedUnits;
    const computedUnits = newReading - previous;

    if (newReading <= previous) {
      return res.status(400).json({ message: `Current reading must be greater than previous reading (${previous}).` });
    }

    const tariffRates = {
      domestic: 5,
      commercial: 10,
      industrial: 15,
    };

    const rate = tariffRates[consumer.tariffPlan.toLowerCase()];
    if (!rate) return res.status(400).json({ message: 'Invalid tariff plan' });

    consumer.currentReading = newReading;
    consumer.amount = computedUnits * rate;

    // Set bill window: reading window ends 15th, +15 days to pay
    consumer.lastBillDate = parsedDate;
    consumer.nextPaymentDeadline = computePaymentDeadline(parsedDate);
    consumer.paymentStatus = 'Pending';

    // Reset fines on new bill
    consumer.isFineApplied = false;
    consumer.fineAmount = 0;
    consumer.cgstOnFine = 0;
    consumer.sgstOnFine = 0;
    consumer.totalFineWithTax = 0;

    // Add reading entry to history
    if (!consumer.readings) consumer.readings = [];

    consumer.readings.push({
      date: parsedDate,
      units: computedUnits,
      manualReading: newReading
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
    // Show the actual meter reading (manualReading) instead of last cycle's units
    const previousMeterReading = lastReading?.manualReading ?? consumer.currentReading ?? 0;

    res.json({
      name: consumer.name,
      meterSerialNumber: consumer.meterSerialNumber,
      previousReading: previousMeterReading,
      lastUnitsConsumed: lastReading ? lastReading.units : 0,
      tariffPlan: consumer.tariffPlan,
    });
  } catch (error) {
    console.error('Error fetching consumer details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addCitizenReading = async (req, res) => {
  const { consumerNumber } = req.params;
  const { unitsConsumed, readingDate, currentReading } = req.body;

  const parsedUnits = Number(unitsConsumed);
  if (!Number.isFinite(parsedUnits)) {
    return res.status(400).json({ message: 'Invalid unitsConsumed' });
  }

  const parsedDate = new Date(readingDate);
  if (isNaN(parsedDate)) {
    return res.status(400).json({ message: 'Invalid reading date' });
  }

  try {
    const consumer = await Consumer.findOne({ consumerNumber });
    if (!consumer) return res.status(404).json({ message: 'Consumer not found' });

    if (consumer.role !== 'citizen') {
      return res.status(403).json({ message: 'You are not authorized to update this reading' });
    }

    const previous = consumer.currentReading || 0;
    const newReading = Number.isFinite(currentReading) ? Number(currentReading) : previous + parsedUnits;
    const computedUnits = newReading - previous;

    if (newReading <= previous) {
      return res.status(400).json({ message: `Current reading must be greater than previous reading (${previous}).` });
    }

    const tariffRates = {
      domestic: 5,
      commercial: 10,
      industrial: 15,
    };

    const rate = tariffRates[consumer.tariffPlan.toLowerCase()];
    if (!rate) return res.status(400).json({ message: 'Invalid tariff plan' });

    consumer.currentReading = newReading;
    consumer.amount = computedUnits * rate;

    consumer.lastBillDate = parsedDate;
    consumer.nextPaymentDeadline = computePaymentDeadline(parsedDate);
    consumer.paymentStatus = 'Pending';

    consumer.isFineApplied = false;
    consumer.fineAmount = 0;
    consumer.cgstOnFine = 0;
    consumer.sgstOnFine = 0;
    consumer.totalFineWithTax = 0;

    if (!consumer.readings) consumer.readings = [];
    consumer.readings.push({
      date: parsedDate,
      units: computedUnits,
      manualReading: newReading
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

// Calculate fixed fine amount with GST/CGST
const calculateFine = () => {
  const FIXED_FINE = 100; // Flat ₹100 fine
  const CGST = 0.09; // 9% CGST
  const SGST = 0.09; // 9% SGST

  const fineAmount = FIXED_FINE;
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
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const readingWindowEnd = new Date(now.getFullYear(), now.getMonth(), 15, 23, 59, 59);

    // Derive tariff rate and last units consumed for display
    const tariffRates = {
      domestic: 5,
      commercial: 10,
      industrial: 15,
    };
    const tariffRate = tariffRates[(consumer.tariffPlan || '').toLowerCase()] || 0;
    const lastUnitsConsumed = Array.isArray(consumer.readings) && consumer.readings.length > 0
      ? consumer.readings[consumer.readings.length - 1].units
      : null;

    let billDeadline = consumer.nextPaymentDeadline ? new Date(consumer.nextPaymentDeadline) : null;

    // Reading pending if current month window (1-15) hasn't been submitted after payment cleared
    const readingPending = (!consumer.lastBillDate || consumer.lastBillDate < monthStart) && now <= readingWindowEnd && consumer.paymentStatus === 'Paid';

    // If no deadline exists and the bill is still pending, align to reading window rule
    if (!billDeadline && consumer.paymentStatus !== 'Paid') {
      const baseDate = consumer.lastBillDate ? new Date(consumer.lastBillDate) : now;
      billDeadline = computePaymentDeadline(baseDate);
      consumer.nextPaymentDeadline = billDeadline;
      await consumer.save();
    }

    const daysUntilDeadline = billDeadline ? Math.ceil((billDeadline - now) / (1000 * 60 * 60 * 24)) : 0;
    const isOverdue = billDeadline && now > billDeadline && consumer.paymentStatus !== 'Paid';
    
    // If amount is 0 and status is not explicitly 'Paid', treat as paid (no pending bill)
    if (consumer.amount === 0 && consumer.paymentStatus === 'Pending') {
      consumer.paymentStatus = 'Paid';
      consumer.nextPaymentDeadline = null;
      await consumer.save();
    }
    
    // Apply fine if overdue and not already applied
    let totalBillAmount = consumer.amount;
    let fineDetails = {
      fineAmount: 0,
      cgstOnFine: 0,
      sgstOnFine: 0,
      totalFineWithTax: 0
    };

    if (isOverdue && !consumer.isFineApplied) {
      fineDetails = calculateFine();
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

    if (readingPending) {
      const daysLeftForReading = Math.max(0, Math.ceil((readingWindowEnd - now) / (1000 * 60 * 60 * 24)));
      reminderType = 'reading';
      reminderMessage = `Reading required: submit meter reading by ${readingWindowEnd.toDateString()} (${daysLeftForReading} day(s) left).`;
    } else if (isOverdue) {
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
      lastUnitsConsumed: lastUnitsConsumed,
      tariffRate: tariffRate,
      paymentStatus: consumer.paymentStatus,
      lastPaymentDate: consumer.lastPaymentDate,
      lastPaidAmount: consumer.lastPaidAmount,
      
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
      reminderType: reminderType,

      // Reading window info
      readingPending,
      readingWindowStart: monthStart,
      readingWindowEnd
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
    const paidAmount = consumer.amount + (consumer.isFineApplied ? consumer.totalFineWithTax : 0);
    consumer.lastPaidAmount = parseFloat(paidAmount.toFixed(2));
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
    
    // Await next reading before setting a fresh due date
    consumer.nextPaymentDeadline = null;
    
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
      paymentStatus: { $ne: 'Paid' }
    }).select(
      'consumerNumber name address phoneNumber meterSerialNumber tariffPlan amount fineAmount cgstOnFine sgstOnFine totalFineWithTax fineAppliedDate paymentStatus'
    );

    res.json(consumersWithFines);
  } catch (error) {
    console.error('Error fetching consumers with fines:', error);
    res.status(500).json({ message: 'Server error' });
  }
};