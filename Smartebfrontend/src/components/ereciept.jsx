import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import '../styles/ereciept.css';
import '../styles/navbar.css';

function EReceipt() {
  const navigate = useNavigate();
  const [consumerNo, setConsumerNo] = useState('');
  const [receiptData, setReceiptData] = useState(null);
  const [userName, setUserName] = useState('');

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

  const handleDownload = (data) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('E-Receipt', 20, 20);
    doc.text(`Consumer No: ${data.consumerNo}`, 20, 30);
    doc.text(`Consumer Name: ${data.consumerName}`, 20, 40);
    doc.text(`Bill Amount: ${data.billAmount}`, 20, 50);
    doc.text(`Bill Paid Date: ${data.billPaidDate}`, 20, 60);
    doc.save(`e-receipt-${data.consumerNo}.pdf`);
  };

  const fetchReceipt = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/receipts/${consumerNo}`);
      if (!response.ok) {
        throw new Error("Receipt not found");
      }
      const data = await response.json();
      setReceiptData(data);
    } catch (err) {
      alert("Receipt not found for this consumer number.");
      setReceiptData(null);
    }
  };

  return (
    <div className="ereceipt-container">
      {/* Top Navigation */}
      <div className="top-nav">
        <div className="home-button">
          <span role="img" aria-label="receipt">🧾</span> E-Receipt
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
            value={consumerNo}
            onChange={(e) => setConsumerNo(e.target.value)}
            placeholder="Enter your consumer no"
          />
          <button className="enter-button" onClick={fetchReceipt}>Enter</button>
        </div>

        {/* Show receipt if data is available */}
        {receiptData && (
          <div className="table-container">
            <table className="ereceipt-table">
              <thead>
                <tr>
                  <th>Consumer No</th>
                  <th>Consumer Name</th>
                  <th>Bill Amount</th>
                  <th>Bill Paid Date</th>
                  <th><span role="img" aria-label="download">⬇️</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{receiptData.consumerNo}</td>
                  <td>{receiptData.consumerName}</td>
                  <td>{receiptData.billAmount}</td>
                  <td>{receiptData.billPaidDate}</td>
                  <td>
                    <button className="download-btn" onClick={() => handleDownload(receiptData)}>
                      Download
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="footer">
        <p>&copy; 2025 E-Receipt Inc. All rights reserved.</p>
        <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a>
      </div>
    </div>
  );
}

export default EReceipt;
