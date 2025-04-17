import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/About.css';
import '../styles/navbar.css';

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <div className="top-nav">
        <div className="home-button">
          <span role="img" aria-label="home">🏠</span> Home
        </div>
        <div className="user-info">
          <span role="img" aria-label="user">👤</span> Welcome
          <button className="logout-button" onClick={() => navigate('/login')}>Logout →</button>
        </div>
      </div>

      <div className="content-area">
        <div className="about-content">
          <h2>SMART EB METER READER</h2>
          <p>
            The <strong>Smart EB Meter Reader</strong> is an advanced technology-driven solution designed to modernize electricity 
            meter reading, making it more efficient, transparent, and user-friendly. Traditional electricity bill calculations 
            and manual meter readings often lead to inaccuracies, delays, and human errors. Our system overcomes these challenges 
            by automating the entire process, ensuring accurate readings and real-time monitoring.
          </p>
        
          <h3>Key Features</h3>
          <ul>
            <li><strong>Real-Time Monitoring:</strong> Users can check their electricity consumption instantly through a digital interface.</li>
            <li><strong>Automated Meter Readings:</strong> Eliminates manual efforts by providing automatic readings using IoT-based technology.</li>
            <li><strong>Accurate Billing System:</strong> Ensures precise calculations based on real-time usage, reducing billing discrepancies.</li>
            <li><strong>Seamless Digital Payments:</strong> Integrated with multiple payment gateways for instant and hassle-free transactions.</li>
            <li><strong>Usage History & Insights:</strong> Provides detailed analytics on energy consumption patterns, helping users optimize their usage.</li>
            <li><strong>Secure & Transparent:</strong> Ensures data security and transparency in billing and transactions.</li>
          </ul>

          <h3>How It Works</h3>
          <p>
            The system is designed to automatically capture meter readings through smart sensors embedded in electricity meters. 
            These readings are transmitted securely to a centralized database, where they are processed to generate accurate bills. 
            Users can access their electricity usage and billing details via a web portal or mobile app. Additionally, they can 
            make payments instantly and track their previous transactions.
          </p>

          <h3>Benefits</h3>
          <ul>
            <li><strong>Enhanced Convenience:</strong> No more waiting for manual readings; users get updates anytime, anywhere.</li>
            <li><strong>Cost Efficiency:</strong> Reduces operational costs for electricity providers by eliminating manual processes.</li>
            <li><strong>Eco-Friendly:</strong> Paperless billing contributes to environmental conservation.</li>
            <li><strong>Improved User Experience:</strong> A user-friendly interface ensures smooth navigation and interaction.</li>
            <li><strong>Scalability:</strong> Suitable for residential, commercial, and industrial applications.</li>
          </ul>

          <h3>Future Scope</h3>
          <p>
            The Smart EB Meter Reader is designed for continuous innovation. Future enhancements may include AI-powered consumption 
            predictions, automated energy-saving suggestions, and integration with renewable energy sources such as solar panels. 
            With smart grid technology advancing, this system has the potential to revolutionize energy management at a global level.
          </p>
        </div>
      </div>

      <div className="footer">
        <p>&copy; 2025 ScanReadings Inc. All rights reserved.</p>
        <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a>
      </div>
    </div>
  );
}

export default About;
