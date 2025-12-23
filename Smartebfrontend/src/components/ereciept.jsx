import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

function EReceipt({ onLogout }) {
  const navigate = useNavigate();
  const [consumerNo, setConsumerNo] = useState('');
  const [receiptData, setReceiptData] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'Guest User';
    setUserName(storedName);
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.clear();
      navigate('/login');
    }
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
    <div className="min-h-screen bg-gradient-to-b from-slate-400 to-slate-600 flex flex-col">
      {/* Top Navigation */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 shadow-lg p-3 md:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <div className="text-white font-bold text-base md:text-lg flex items-center gap-2">
            <span className="text-xl md:text-2xl">🧾</span> E-Receipt
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
        <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl border-2 border-amber-400 p-4 sm:p-6 md:p-8 w-full max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-slate-700 mb-4 md:mb-6 text-center">📄 Retrieve Your E-Receipt</h2>

          <div className="space-y-4 md:space-y-6">
            {/* Search Section */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex flex-col">
                <label htmlFor="consumerNo" className="text-slate-700 font-semibold mb-2 text-sm md:text-base">Consumer No:</label>
                <input
                  type="text"
                  id="consumerNo"
                  value={consumerNo}
                  onChange={(e) => setConsumerNo(e.target.value)}
                  placeholder="Enter your consumer number"
                  className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-amber-400 focus:bg-white outline-none transition-all text-sm md:text-base"
                />
              </div>
              <div className="flex items-end">
                <button
                  className="bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg hover:shadow-lg transition-all duration-300 w-full sm:w-auto text-sm md:text-base"
                  onClick={fetchReceipt}
                >
                  Search
                </button>
              </div>
            </div>

            {/* Receipt Table */}
            {receiptData && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-amber-400 to-amber-600">
                      <th className="px-2 md:px-4 py-2 md:py-3 text-white font-bold text-left border border-amber-700 text-xs md:text-sm">Consumer No</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-white font-bold text-left border border-amber-700 text-xs md:text-sm">Consumer Name</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-white font-bold text-left border border-amber-700 text-xs md:text-sm">Bill Amount (₹)</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-white font-bold text-left border border-amber-700 text-xs md:text-sm">Bill Paid Date</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-white font-bold text-center border border-amber-700 text-xs md:text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-amber-50 transition-colors">
                      <td className="px-2 md:px-4 py-2 md:py-3 border border-gray-300 font-semibold text-slate-700 text-xs md:text-sm">{receiptData.consumerNo}</td>
                      <td className="px-2 md:px-4 py-2 md:py-3 border border-gray-300 text-slate-700 text-xs md:text-sm">{receiptData.consumerName}</td>
                      <td className="px-2 md:px-4 py-2 md:py-3 border border-gray-300 font-bold text-amber-600 text-xs md:text-sm">{receiptData.billAmount}</td>
                      <td className="px-2 md:px-4 py-2 md:py-3 border border-gray-300 text-slate-700 text-xs md:text-sm">{receiptData.billPaidDate}</td>
                      <td className="px-2 md:px-4 py-2 md:py-3 border border-gray-300 text-center">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-1.5 md:py-2 px-2 md:px-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-xs md:text-sm"
                          onClick={() => handleDownload(receiptData)}
                        >
                          ⬇️ Download PDF
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* No Data Message */}
            {!receiptData && consumerNo && (
              <div className="text-center p-4 md:p-6 bg-red-50 border-2 border-red-300 rounded-lg">
                <p className="text-red-600 font-semibold text-sm md:text-base">No receipt found. Try another consumer number.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white text-center py-3 md:py-4 border-t-2 border-slate-700">
        <p className="text-xs md:text-sm px-2">&copy; 2025 E-Receipt Inc. All rights reserved.</p>
        <div className="text-xs mt-1 md:mt-2 px-2">
          <a href="/privacy-policy" className="hover:text-amber-400">Privacy Policy</a> | <a href="/terms-of-service" className="hover:text-amber-400">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}

export default EReceipt;
