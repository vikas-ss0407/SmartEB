import React, { useState } from 'react';
import axios from 'axios';

function AddConsumer() {
  const [consumer, setConsumer] = useState({
    consumerNumber: '',
    meterSerialNumber: '',
    name: '',
    address: '',
    phoneNumber: '',
    tariffPlan: 'Domestic',
  });

  const handleChange = (e) => {
    setConsumer({ ...consumer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/consumers', consumer);
      alert('Consumer added successfully!');
    } catch (err) {
      console.error('Error adding consumer:', err);
      alert('Error adding consumer!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-400 to-slate-600 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border-2 border-teal-400 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">➕ Add Consumer</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-slate-700 font-semibold mb-1">Consumer Number</label>
              <input
                type="text"
                name="consumerNumber"
                placeholder="Enter consumer number"
                value={consumer.consumerNumber}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-teal-400 focus:bg-white outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-slate-700 font-semibold mb-1">Meter Serial Number</label>
              <input
                type="text"
                name="meterSerialNumber"
                placeholder="Enter meter serial"
                value={consumer.meterSerialNumber}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-teal-400 focus:bg-white outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-slate-700 font-semibold mb-1">Customer Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter customer name"
              value={consumer.name}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-teal-400 focus:bg-white outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-slate-700 font-semibold mb-1">Customer Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter address"
              value={consumer.address}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-teal-400 focus:bg-white outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-slate-700 font-semibold mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Enter phone number"
              value={consumer.phoneNumber}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-teal-400 focus:bg-white outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-slate-700 font-semibold mb-1">Tariff Plan</label>
            <select
              name="tariffPlan"
              value={consumer.tariffPlan}
              onChange={handleChange}
              className="px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-teal-400 focus:bg-white outline-none"
            >
              <option value="Domestic">Domestic</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all"
          >
            Add Consumer
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddConsumer;
