import React from 'react';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow">
        <div className="flex items-center gap-2 font-medium">
          <span role="img" aria-label="home">🏠</span> Home
        </div>
        <div className="flex items-center gap-3">
          <span role="img" aria-label="user">👤</span> Welcome
          <button className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => navigate('/login')}>Logout →</button>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-2xl font-bold">SMART EB METER READER</h2>
          <p className="text-gray-700">
            The <strong>Smart EB Meter Reader</strong> is an advanced technology-driven solution designed to modernize electricity
            meter reading, making it more efficient, transparent, and user-friendly. Traditional electricity bill calculations
            and manual meter readings often lead to inaccuracies, delays, and human errors. Our system overcomes these challenges
            by automating the entire process, ensuring accurate readings and real-time monitoring.
          </p>

          <h3 className="text-xl font-semibold">Key Features</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li><strong>Real-Time Monitoring:</strong> Users can check their electricity consumption instantly through a digital interface.</li>
            <li><strong>Automated Meter Readings:</strong> Eliminates manual efforts by providing automatic readings using IoT-based technology.</li>
            <li><strong>Accurate Billing System:</strong> Ensures precise calculations based on real-time usage, reducing billing discrepancies.</li>
            <li><strong>Seamless Digital Payments:</strong> Integrated with multiple payment gateways for instant and hassle-free transactions.</li>
            <li><strong>Usage History & Insights:</strong> Provides detailed analytics on energy consumption patterns, helping users optimize their usage.</li>
            <li><strong>Secure & Transparent:</strong> Ensures data security and transparency in billing and transactions.</li>
          </ul>

          <h3 className="text-xl font-semibold">How It Works</h3>
          <p className="text-gray-700">
            The system is designed to automatically capture meter readings through smart sensors embedded in electricity meters.
            These readings are transmitted securely to a centralized database, where they are processed to generate accurate bills.
            Users can access their electricity usage and billing details via a web portal or mobile app. Additionally, they can
            make payments instantly and track their previous transactions.
          </p>

          <h3 className="text-xl font-semibold">Benefits</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li><strong>Enhanced Convenience:</strong> No more waiting for manual readings; users get updates anytime, anywhere.</li>
            <li><strong>Cost Efficiency:</strong> Reduces operational costs for electricity providers by eliminating manual processes.</li>
            <li><strong>Eco-Friendly:</strong> Paperless billing contributes to environmental conservation.</li>
            <li><strong>Improved User Experience:</strong> A user-friendly interface ensures smooth navigation and interaction.</li>
            <li><strong>Scalability:</strong> Suitable for residential, commercial, and industrial applications.</li>
          </ul>

          <h3 className="text-xl font-semibold">Future Scope</h3>
          <p className="text-gray-700">
            The Smart EB Meter Reader is designed for continuous innovation. Future enhancements may include AI-powered consumption
            predictions, automated energy-saving suggestions, and integration with renewable energy sources such as solar panels.
            With smart grid technology advancing, this system has the potential to revolutionize energy management at a global level.
          </p>
        </div>
      </div>

      <div className="mt-auto bg-white border-t p-4 text-center text-sm text-gray-600">
        <p>&copy; 2025 ScanReadings Inc. All rights reserved.</p>
        <a className="text-blue-600 hover:underline" href="/privacy-policy">Privacy Policy</a> | <a className="text-blue-600 hover:underline" href="/terms-of-service">Terms of Service</a>
      </div>
    </div>
  );
}

export default About;
