import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [consumers, setConsumers] = useState([]);
  const [consumerNumber, setConsumerNumber] = useState('');
  const [consumerData, setConsumerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchConsumers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/consumers');
        if (Array.isArray(response.data)) {
          setConsumers(response.data);
        } else {
          console.error('Expected an array, but got:', response.data);
        }
      } catch (error) {
        console.error('Error fetching consumers:', error);
        setErrorMessage('Failed to fetch consumers. Please try again later.');
      }
    };
    fetchConsumers();
  }, []);

  const handleSearchConsumer = async () => {
    if (!consumerNumber) {
      alert('Please enter a valid consumer number');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await axios.get(`http://localhost:5000/api/consumers/${consumerNumber}`);
      if (res.data) {
        setConsumerData(res.data);
      } else {
        alert('Consumer not found!');
        setConsumerData(null);
      }
    } catch (err) {
      console.error('Error fetching consumer data:', err);
      alert('Consumer not found!');
      setConsumerData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConsumer = async (consumerNumber) => {
    if (!consumerNumber) {
      alert('Please enter a valid consumer number to delete');
      return;
    }
    setErrorMessage('');
    try {
      const response = await axios.delete(`http://localhost:5000/api/consumers/${consumerNumber}`);
      if (response.status === 200) {
        setMessage('Consumer deleted successfully');
        const res = await axios.get('http://localhost:5000/api/consumers');
        setConsumers(res.data);
      } else {
        console.error('Failed to delete consumer:', response.statusText);
        setErrorMessage('Failed to delete consumer. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting consumer:', error.response ? error.response.data : error.message);
      setErrorMessage('Error deleting consumer. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-400 to-slate-600 p-4">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 shadow-lg p-3 md:p-4 rounded-xl mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <h2 className="text-white font-bold text-xl md:text-2xl">🛠️ Admin Dashboard</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => onLogout()} className="bg-red-600 hover:bg-red-700 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-white text-sm md:text-base">Logout →</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-2xl border-2 border-teal-400 p-4 lg:col-span-2">
          <div className="flex flex-wrap gap-2 mb-4">
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg" onClick={() => navigate('/add-consumer')}>Add Consumer</button>
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg" onClick={() => navigate('/add-reading')}>Add Reading</button>
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg" onClick={() => navigate('/update-consumer')}>Update Consumer</button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter Consumer Number"
                value={consumerNumber}
                onChange={(e) => setConsumerNumber(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-white border-2 border-transparent focus:border-teal-400 outline-none"
              />
              <div className="flex gap-2">
                <button onClick={handleSearchConsumer} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Search</button>
                <button onClick={() => handleDeleteConsumer(consumerNumber)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Delete</button>
              </div>
            </div>
            {loading && <p className="text-slate-600 mt-2">Loading...</p>}
            {message && <p className="mt-2 px-3 py-2 bg-green-100 text-green-700 rounded">{message}</p>}
            {errorMessage && <p className="mt-2 px-3 py-2 bg-red-100 text-red-700 rounded">{errorMessage}</p>}
          </div>

          {consumerData && (
            <div className="bg-white border-2 border-slate-200 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold text-slate-800 mb-3">Consumer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                <p><span className="font-semibold">Name:</span> {consumerData.name}</p>
                <p><span className="font-semibold">Address:</span> {consumerData.address}</p>
                <p><span className="font-semibold">Phone:</span> {consumerData.phoneNumber}</p>
                <p><span className="font-semibold">Tariff Plan:</span> {consumerData.tariffPlan}</p>
                <p><span className="font-semibold">Meter Serial:</span> {consumerData.meterSerialNumber}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-2xl border-2 border-teal-400 p-4">
          <h3 className="text-lg font-bold text-slate-800 mb-3">All Consumers</h3>
          <div className="max-h-[400px] overflow-auto border border-slate-200 rounded-lg">
            {Array.isArray(consumers) && consumers.length > 0 ? (
              <ul className="divide-y">
                {consumers.map((consumer) => (
                  <li key={consumer.consumerNumber} className="px-3 py-2 hover:bg-slate-50">
                    {consumer.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-3 text-slate-600">No consumers available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;