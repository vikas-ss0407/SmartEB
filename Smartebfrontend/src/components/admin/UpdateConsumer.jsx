import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UpdateConsumer() {
  const navigate = useNavigate();
  const [consumerNumber, setConsumerNumber] = useState('');
  const [consumerData, setConsumerData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    tariffPlan: '',
    meterSerialNumber: '',
  });
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFetchConsumer = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/consumers/${consumerNumber}`);
      setConsumerData(response.data);
      setMessage('');
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching consumer:', error);
      setErrorMessage('Consumer not found!');
      setConsumerData({
        name: '',
        address: '',
        phoneNumber: '',
        tariffPlan: '',
        meterSerialNumber: '',
      });
    }
  };

  const handleUpdateConsumer = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/consumers/${consumerNumber}`, consumerData);
      setMessage('Consumer updated successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating consumer:', error);
      setErrorMessage('Failed to update consumer. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-400 to-slate-600 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border-2 border-teal-400 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">✏️ Update Consumer</h2>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter Consumer Number"
              value={consumerNumber}
              onChange={(e) => setConsumerNumber(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-white border-2 border-transparent focus:border-teal-400 outline-none"
            />
            <button onClick={handleFetchConsumer} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Fetch Consumer</button>
          </div>
          {errorMessage && <p className="mt-2 px-3 py-2 bg-red-100 text-red-700 rounded">{errorMessage}</p>}
          {message && <p className="mt-2 px-3 py-2 bg-green-100 text-green-700 rounded">{message}</p>}
        </div>

        {consumerData.name && (
          <form onSubmit={handleUpdateConsumer} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-slate-700 font-semibold mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={consumerData.name}
                  onChange={(e) => setConsumerData({ ...consumerData, name: e.target.value })}
                  required
                  className="px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-teal-400 focus:bg-white outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-slate-700 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={consumerData.phoneNumber}
                  onChange={(e) => setConsumerData({ ...consumerData, phoneNumber: e.target.value })}
                  required
                  className="px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-teal-400 focus:bg-white outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-slate-700 font-semibold mb-1">Address</label>
              <input
                type="text"
                placeholder="Address"
                value={consumerData.address}
                onChange={(e) => setConsumerData({ ...consumerData, address: e.target.value })}
                required
                className="px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-teal-400 focus:bg-white outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-slate-700 font-semibold mb-1">Tariff Plan</label>
                <select
                  value={consumerData.tariffPlan}
                  onChange={(e) => setConsumerData({ ...consumerData, tariffPlan: e.target.value })}
                  required
                  className="px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-teal-400 focus:bg-white outline-none"
                >
                  <option value="">Select Tariff Plan</option>
                  <option value="Domestic">Domestic</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-slate-700 font-semibold mb-1">Meter Serial Number</label>
                <input
                  type="text"
                  placeholder="Meter Serial Number"
                  value={consumerData.meterSerialNumber}
                  onChange={(e) => setConsumerData({ ...consumerData, meterSerialNumber: e.target.value })}
                  required
                  className="px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-teal-400 focus:bg-white outline-none"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all">Update Consumer</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default UpdateConsumer;