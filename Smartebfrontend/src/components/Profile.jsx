import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';
import '../styles/navbar.css';

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
    <div className="profile-container">
      <div className="top-nav">
        <div className="profile-title">👤 Profile</div>
        <div className="consumer-no">Consumer No: 00000000</div>
        <button className="logout-button" onClick={handleLogout}>Logout →</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="form-area">
          <div className="input-row">
            <label>User Name:</label>
            <input type="text" value={userData.userName} readOnly />
          </div>
          <div className="input-row">
            <label>Address:</label>
            <input type="text" value={userData.address} readOnly />
          </div>
          <div className="input-row">
            <label>E-mail ID:</label>
            <input type="email" value={userData.email} readOnly />
          </div>
          <div className="input-row">
            <label>Phone No:</label>
            <input type="tel" value={userData.phoneNo} readOnly />
          </div>
          {/* Password update section can be implemented later */}
        </div>
      )}
    </div>
  );
}

export default Profile;