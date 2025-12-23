import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function QuickPay({ onLogout }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [consumerNo, setConsumerNo] = useState('');
  const [consumerName, setConsumerName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.clear();
      navigate('/login');
    }
  };

  const fetchConsumerDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/consumers/details/${consumerNo}`);
      if (!response.ok) {
        throw new Error('Consumer not found');
      }
      const data = await response.json();

      setConsumerName(data.name);
      setAmount(data.amount);

      // Calculate due date (15 days from the last reading date)
      if (data.lastReadingDate) {
        const readingDate = new Date(data.lastReadingDate);
        const dueDate = new Date(readingDate);
        dueDate.setDate(readingDate.getDate() + 15); // Add 15 days
        setDueDate(dueDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
      } else {
        setDueDate('N/A'); // If no reading date is available
      }
    } catch (error) {
      console.error('Error fetching consumer details:', error);
      alert('Consumer not found.');
    }
  };

  const handlePayNow = () => {
    // Navigate to the payment portal with consumer details
    navigate('/payment', {
      state: {
        consumerNo,
        consumerName,
        amount,
        dueDate,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-400 to-slate-600 flex flex-col">
      {/* Top Navigation */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 shadow-lg p-3 md:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <div className="text-white font-bold text-base md:text-lg flex items-center gap-2">
            <span className="text-xl md:text-2xl">⚡</span> Quick Pay
          </div>
          <div className="text-white flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="font-semibold text-sm md:text-base text-center">Hi {userName}, Welcome!</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-sm md:text-base transition-all duration-300 w-full sm:w-auto"
            >
              Logout →
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl border-2 border-green-400 p-4 sm:p-6 md:p-8 w-full max-w-2xl">
          <h2 className="text-xl md:text-2xl font-bold text-slate-700 mb-4 md:mb-6 text-center">💳 Quick Payment</h2>

          <div className="space-y-4 md:space-y-5">
            {/* Consumer No */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex flex-col">
                <label htmlFor="consumerNo" className="text-slate-700 font-semibold mb-2 text-sm md:text-base">Consumer No:</label>
                <input
                  type="text"
                  id="consumerNo"
                  placeholder="Enter your consumer no"
                  value={consumerNo}
                  onChange={(e) => setConsumerNo(e.target.value)}
                  className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-green-400 focus:bg-white outline-none transition-all text-sm md:text-base"
                />
              </div>
              <div className="flex items-end">
                <button
                  className="bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg hover:shadow-lg transition-all duration-300 w-full sm:w-auto text-sm md:text-base"
                  onClick={fetchConsumerDetails}
                >
                  Enter
                </button>
              </div>
            </div>

            {/* Consumer Name */}
            <div className="flex flex-col">
              <label htmlFor="consumerName" className="text-slate-700 font-semibold mb-2 text-sm md:text-base">Consumer Name:</label>
              <input
                type="text"
                id="consumerName"
                value={consumerName}
                readOnly
                className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-200 text-slate-600 cursor-not-allowed text-sm md:text-base"
              />
            </div>

            {/* Amount */}
            <div className="flex flex-col">
              <label htmlFor="amount" className="text-slate-700 font-semibold mb-2 text-sm md:text-base">Amount (₹):</label>
              <input
                type="text"
                id="amount"
                value={amount}
                readOnly
                className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-green-400 focus:bg-white outline-none transition-all text-base md:text-lg font-semibold"
                placeholder="0.00"
              />
            </div>

            {/* Due Date */}
            <div className="flex flex-col">
              <label htmlFor="dueDate" className="text-slate-700 font-semibold mb-2 text-sm md:text-base">Due Date:</label>
              <input
                type="text"
                id="dueDate"
                value={dueDate}
                readOnly
                placeholder="DD/MM/YYYY"
                className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-green-400 focus:bg-white outline-none transition-all text-sm md:text-base"
              />
            </div>

            {/* Pay Button */}
            <button
              className="w-full bg-gradient-to-r from-green-500 to-emerald-700 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-base md:text-lg"
              onClick={handlePayNow}
            >
              💰 Pay Now
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white text-center py-3 md:py-4 border-t-2 border-slate-700">
        <p className="text-xs md:text-sm px-2">&copy; 2025 QuickPay Inc. All rights reserved.</p>
        <div className="text-xs mt-1 md:mt-2 px-2">
          <a href="/privacy-policy" className="hover:text-green-400">Privacy Policy</a> | <a href="/terms-of-service" className="hover:text-green-400">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}

export default QuickPay;