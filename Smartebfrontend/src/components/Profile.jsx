import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profile() {
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
    localStorage.clear(); // Clear all user-related data
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow">
        <div className="font-medium">👤 Profile</div>
        <div className="text-gray-700">Consumer No: 00000000</div>
        <button className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleLogout}>Logout →</button>
      </div>
      {loading ? (
        <p className="p-6">Loading...</p>
      ) : (
        <div className="max-w-3xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">User Name:</label>
              <input className="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-gray-100" type="text" value={userData.userName} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address:</label>
              <input className="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-gray-100" type="text" value={userData.address} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail ID:</label>
              <input className="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-gray-100" type="email" value={userData.email} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone No:</label>
              <input className="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-gray-100" type="tel" value={userData.phoneNo} readOnly />
            </div>
            {/* Password update section can be implemented later */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;