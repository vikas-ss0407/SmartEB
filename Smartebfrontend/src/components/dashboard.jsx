import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import manImage from '../assets/man.png';
import quickPayImage from '../assets/Cash-Drawing.png';
import eReceiptImage from '../assets/MONEY.png';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Guest User';
    setUserName(name);
  }, []);

  const handleLogout = () => {
    onLogout?.();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-300 to-slate-500 flex flex-col">
      {/* Top Navigation */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 shadow-lg p-3 md:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <div className="text-white font-bold text-base md:text-lg flex items-center gap-2">
            <span className="text-xl md:text-2xl">🏠</span> Home
          </div>
          <div className="text-white flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="font-semibold text-sm md:text-base text-center">Hi {userName}, Welcome!</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-sm md:text-base transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              Logout →
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl">
          {/* Scan Readings Card */}
          <div
            onClick={() => navigate('/scanread')}
            className="bg-white rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer p-4 md:p-6 text-center border-2 border-teal-400"
          >
            <img src={manImage} alt="Scan Readings" className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-3 md:mb-4 object-contain" />
            <h3 className="text-lg md:text-xl font-bold text-slate-700">SCAN READINGS</h3>
            <p className="text-slate-500 mt-2 text-xs md:text-sm">📷 Capture meter readings</p>
          </div>

          {/* Quick Pay Card */}
          <div
            onClick={() => navigate('/quickpage')}
            className="bg-white rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer p-4 md:p-6 text-center border-2 border-green-400"
          >
            <img src={quickPayImage} alt="Quick Pay" className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-3 md:mb-4 object-contain" />
            <h3 className="text-lg md:text-xl font-bold text-slate-700">QUICK PAY</h3>
            <p className="text-slate-500 mt-2 text-xs md:text-sm">⚡ Fast payment solution</p>
          </div>

          {/* E-Receipt Card */}
          <div
            onClick={() => navigate('/ereciept')}
            className="bg-white rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer p-4 md:p-6 text-center border-2 border-amber-400"
          >
            <img src={eReceiptImage} alt="E-Receipt" className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-3 md:mb-4 object-contain" />
            <h3 className="text-lg md:text-xl font-bold text-slate-700">E-RECEIPT</h3>
            <p className="text-slate-500 mt-2 text-xs md:text-sm">🧾 View and download receipts</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 shadow-xl">
        <nav className="flex flex-wrap justify-center gap-2 sm:gap-4 p-3 md:p-4 max-w-5xl mx-auto">
          <Link to="/dashboard" className="text-white font-semibold text-xs sm:text-sm md:text-base hover:text-teal-400 transition-colors px-2 py-1">Home</Link>
          <Link to="/about" className="text-white font-semibold text-xs sm:text-sm md:text-base hover:text-teal-400 transition-colors px-2 py-1">About</Link>
          <Link to="/scanread" className="text-white font-semibold text-xs sm:text-sm md:text-base hover:text-teal-400 transition-colors px-2 py-1">Scan Reading</Link>
          <Link to="/quickpage" className="text-white font-semibold text-xs sm:text-sm md:text-base hover:text-teal-400 transition-colors px-2 py-1">Quick Pay</Link>
          <Link to="/ereciept" className="text-white font-semibold text-xs sm:text-sm md:text-base hover:text-teal-400 transition-colors px-2 py-1">E-Receipt</Link>
          <Link to="/profile" className="text-white font-semibold text-xs sm:text-sm md:text-base hover:text-teal-400 transition-colors px-2 py-1">Profile</Link>
        </nav>
      </div>
    </div>
  );
}

export default Dashboard;
