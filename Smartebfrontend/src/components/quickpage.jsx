import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/quickpage.css';
import '../styles/navbar.css';

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
    <div className="quickpay-container">
      {/* Top Navigation */}
      <div className="top-nav">
        <div className="home-button">
          <span role="img" aria-label="quick">⚡</span> Quick Pay
        </div>
        <div className="user-info">
          Hi {userName}, Welcome!
          <button className="logout-button" onClick={handleLogout}>Logout →</button>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="form-area">
        <div className="input-row">
          <label htmlFor="consumerNo">Consumer No :</label>
          <input
            type="text"
            id="consumerNo"
            placeholder="Enter your consumer no"
            value={consumerNo}
            onChange={(e) => setConsumerNo(e.target.value)}
          />
          <button className="enter-button" onClick={fetchConsumerDetails}>Enter</button>
        </div>
        <div className="input-row">
          <label htmlFor="consumerName">Consumer Name :</label>
          <input type="text" id="consumerName" value={consumerName} readOnly />
        </div>
        <div className="input-row">
          <label htmlFor="amount">Amount :</label>
          <input type="text" id="amount" value={amount} readOnly />
        </div>
        <div className="input-row">
          <label htmlFor="dueDate">Due Date :</label>
          <input type="text" id="dueDate" value={dueDate} readOnly />
        </div>
        <button className="pay-button" onClick={handlePayNow}>Pay Now..</button>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>&copy; 2025 QuickPay Inc. All rights reserved.</p>
        <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a>
      </div>
    </div>
  );
}

export default QuickPay;