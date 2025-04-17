const mongoose = require('mongoose');

const consumerSchema = new mongoose.Schema({
  consumerNumber: { type: String, required: true, unique: true },
  meterSerialNumber: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  tariffPlan: { type: String, enum: ['Domestic', 'Commercial', 'Industrial'], required: true },
  currentReading: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },

  readings: [
    {
      date: { type: Date, required: true },
      units: { type: Number, required: true }
    }
  ]
});

const Consumer = mongoose.model('Consumer', consumerSchema);

module.exports = Consumer;
