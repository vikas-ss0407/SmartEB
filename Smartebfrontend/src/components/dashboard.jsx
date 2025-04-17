import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/dashboard.css';
import '../styles/navbar.css';
import manImage from '../assets/man.png';
import quickPayImage from '../assets/Cash-Drawing.png';
import eReceiptImage from '../assets/MONEY.png';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (!name) {
      navigate('/login');
    } else {
      setUserName(name);
    }
  }, [navigate]);

  const handleLogout = () => {
    onLogout();         // Clear user state in App.jsx
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <div className="dashboard-container">
      {/* Top Navigation */}
      <div className="top-nav">
        <div className="home-button">
          <span role="img" aria-label="home">🏠</span> Home
        </div>
        <div className="user-info">
          <span className="welcome-text">Hi {userName}, Welcome!</span>
          <button className="logout-button" onClick={handleLogout}>Logout →</button>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-area">
        <div className="feature-card" onClick={() => navigate('/scanread')}>
          <img src={manImage} alt="Scan Readings" className="feature-image" />
          <div className="feature-title">SCAN READINGS</div>
        </div>
        <div className="feature-card" onClick={() => navigate('/quickpage')}>
          <img src={quickPayImage} alt="Quick Pay" className="feature-image" />
          <div className="feature-title">QUICK PAY</div>
        </div>
        <div className="feature-card" onClick={() => navigate('/ereciept')}>
          <img src={eReceiptImage} alt="E-Receipt" className="feature-image" />
          <div className="feature-title">E-RECEIPT</div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <Link to="/dashboard">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/scanread">Scan Reading</Link>
        <Link to="/quickpage">Quick Pay</Link>
        <Link to="/ereciept">E-Receipt</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </div>
  );
}

export default Dashboard;
