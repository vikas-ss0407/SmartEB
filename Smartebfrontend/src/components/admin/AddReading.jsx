import React, { useState } from 'react';
import axios from 'axios';

function AddReading() {
  const [reading, setReading] = useState({
    consumerNumber: '',
    meterReading: '',
    readingDate: '',
  });

  const handleChange = (e) => {
    setReading({ ...reading, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(reading.meterReading) || reading.meterReading <= 0) {
      alert('Please enter a valid meter reading!');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/consumers/add-reading/${reading.consumerNumber}`, {
        unitsConsumed: Number(reading.meterReading),
        readingDate: reading.readingDate,
      });
      alert('Reading added successfully!');
    } catch (err) {
      console.error(err);
      alert('Error adding reading!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-400 to-slate-600 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border-2 border-teal-400 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">🧮 Add Meter Reading</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-slate-700 font-semibold mb-1">Consumer Number</label>
            <input
              type="text"
              name="consumerNumber"
              placeholder="Enter consumer number"
              value={reading.consumerNumber}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-teal-400 focus:bg-white outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-slate-700 font-semibold mb-1">Meter Reading (kWh)</label>
              <input
                type="number"
                name="meterReading"
                placeholder="Enter reading"
                value={reading.meterReading}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-teal-400 focus:bg-white outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-slate-700 font-semibold mb-1">Reading Date</label>
              <input
                type="date"
                name="readingDate"
                value={reading.readingDate}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-teal-400 focus:bg-white outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all"
          >
            Add Reading
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddReading;
