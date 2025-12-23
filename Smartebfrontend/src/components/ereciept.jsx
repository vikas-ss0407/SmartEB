import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow">
        <div className="flex items-center gap-2 font-medium">
          <span role="img" aria-label="receipt">🧾</span> E-Receipt
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-700">Hi {userName}, Welcome!</span>
          <button className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleLogout}>Logout →</button>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="max-w-3xl mx-auto p-6">
        <div className="space-y-4 bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="sm:col-span-2">
              <label htmlFor="consumerNo" className="block text-sm font-medium text-gray-700">Consumer No :</label>
              <input
                type="text"
                id="consumerNo"
                value={consumerNo}
                onChange={(e) => setConsumerNo(e.target.value)}
                placeholder="Enter your consumer no"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={fetchReceipt}>Enter</button>
          </div>

          {/* Show receipt if data is available */}
          {receiptData && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumer No</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumer Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Paid Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">⬇️</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2">{receiptData.consumerNo}</td>
                    <td className="px-4 py-2">{receiptData.consumerName}</td>
                    <td className="px-4 py-2">{receiptData.billAmount}</td>
                    <td className="px-4 py-2">{receiptData.billPaidDate}</td>
                    <td className="px-4 py-2">
                      <button className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => handleDownload(receiptData)}>
                        Download
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t p-4 text-center text-sm text-gray-600">
        <p>&copy; 2025 E-Receipt Inc. All rights reserved.</p>
        <a className="text-blue-600 hover:underline" href="/privacy-policy">Privacy Policy</a> | <a className="text-blue-600 hover:underline" href="/terms-of-service">Terms of Service</a>
      </div>
    </div>
  );
}

export default EReceipt;
