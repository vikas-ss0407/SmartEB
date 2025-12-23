import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profile({ onLogout }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    userName: '',
    address: '',
    email: '',
    phoneNo: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.warn("No userId found");
      navigate('/login');
      return;
    }

    setLoading(true);
    axios.get(`http://localhost:5000/api/auth/${userId}`) // Correct API endpoint
      .then(res => {
        const { name, address, email, phoneNo } = res.data; // Match backend response
        setUserData({
          userName: name, // Map name to userName
          address,
          email,
          phoneNo
        });
      })
      .catch(err => {
        console.error("Failed to fetch user data", err);
        alert("Session expired or user not found.");
        localStorage.removeItem('userId');
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-400 to-slate-600 flex flex-col">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 shadow-lg p-3 md:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <div className="text-white font-bold text-base md:text-lg flex items-center gap-2">
            <span className="text-xl md:text-2xl">👤</span> Profile
          </div>
          <div className="text-white flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            
            <button
              className="bg-red-600 hover:bg-red-700 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-sm md:text-base transition-all duration-300 w-full sm:w-auto"
              onClick={handleLogout}
            >
              Logout →
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center p-6 text-white">
          <p className="text-sm md:text-base">Loading your profile…</p>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-3 sm:p-4 md:p-6">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl border-2 border-teal-400 p-4 sm:p-6 md:p-8 w-full max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-6 md:mb-8">📋 Your Profile</h2>

            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-teal-600 text-white flex items-center justify-center text-lg md:text-xl font-bold">
                {(userData.userName || 'U')?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-semibold text-sm md:text-base">{userData.userName || 'User'}</p>
                <p className="text-slate-600 text-xs md:text-sm">{userData.email || 'user@example.com'}</p>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col">
                <label className="text-slate-700 font-semibold mb-2 text-sm md:text-base">👤 User Name:</label>
                <input
                  className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 border-2 border-transparent text-slate-700 font-semibold cursor-not-allowed text-sm md:text-base"
                  type="text"
                  value={userData.userName}
                  readOnly
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-700 font-semibold mb-2 text-sm md:text-base">📧 E-mail ID:</label>
                <input
                  className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 border-2 border-transparent text-slate-700 font-semibold cursor-not-allowed text-sm md:text-base"
                  type="email"
                  value={userData.email}
                  readOnly
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-700 font-semibold mb-2 text-sm md:text-base">🏠 Address:</label>
                <input
                  className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 border-2 border-transparent text-slate-700 font-semibold cursor-not-allowed text-sm md:text-base"
                  type="text"
                  value={userData.address}
                  readOnly
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-700 font-semibold mb-2 text-sm md:text-base">📞 Phone No:</label>
                <input
                  className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 border-2 border-transparent text-slate-700 font-semibold cursor-not-allowed text-sm md:text-base"
                  type="tel"
                  value={userData.phoneNo}
                  readOnly
                />
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-300 rounded-lg p-3 md:p-4 mt-4 md:mt-6">
                <p className="text-slate-600 text-xs md:text-sm text-center">
                  ℹ️ This is your read-only profile. To update your information, please contact our support team.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;