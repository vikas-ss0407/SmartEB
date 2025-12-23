import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function QuickPay() {
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
    localStorage.clear(); // Clear all user-related data
    navigate('/login'); // Redirect to login page
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow">
        <div className="flex items-center gap-2 font-medium">
          <span role="img" aria-label="quick">⚡</span> Quick Pay
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-700">Hi {userName}, Welcome!</span>
          <button className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleLogout}>Logout →</button>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="max-w-2xl mx-auto p-6">
        <div className="space-y-4 bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="sm:col-span-2">
              <label htmlFor="consumerNo" className="block text-sm font-medium text-gray-700">Consumer No :</label>
              <input
                type="text"
                id="consumerNo"
                placeholder="Enter your consumer no"
                value={consumerNo}
                onChange={(e) => setConsumerNo(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={fetchConsumerDetails}>Enter</button>
          </div>

          <div>
            <label htmlFor="consumerName" className="block text-sm font-medium text-gray-700">Consumer Name :</label>
            <input type="text" id="consumerName" value={consumerName} readOnly className="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-gray-100" />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount :</label>
            <input type="text" id="amount" value={amount} readOnly className="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-gray-100" />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date :</label>
            <input type="text" id="dueDate" value={dueDate} readOnly className="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-gray-100" />
          </div>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={handlePayNow}>Pay Now</button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t p-4 text-center text-sm text-gray-600">
        <p>&copy; 2025 QuickPay Inc. All rights reserved.</p>
        <a className="text-blue-600 hover:underline" href="/privacy-policy">Privacy Policy</a> | <a className="text-blue-600 hover:underline" href="/terms-of-service">Terms of Service</a>
      </div>
    </div>
  );
}

export default QuickPay;