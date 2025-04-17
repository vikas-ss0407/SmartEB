const Consumer = require('../models/consumer');

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