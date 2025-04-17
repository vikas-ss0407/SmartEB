import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [consumers, setConsumers] = useState([]);
  const [consumerNumber, setConsumerNumber] = useState('');
  const [consumerData, setConsumerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // For error messages

  // Fetch all consumers on component mount
  useEffect(() => {
    const fetchConsumers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/consumers');
        if (Array.isArray(response.data)) {
          setConsumers(response.data); // Ensure that response.data is an array
        } else {
          console.error('Expected an array, but got:', response.data);
        }
      } catch (error) {
        console.error('Error fetching consumers:', error);
        setErrorMessage('Failed to fetch consumers. Please try again later.');
      }
    };
    fetchConsumers();
  }, []);

  // Search consumer by consumerNumber
  const handleSearchConsumer = async () => {
    if (!consumerNumber) {
      alert('Please enter a valid consumer number');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await axios.get(`http://localhost:5000/api/consumers/${consumerNumber}`);
      if (res.data) {
        setConsumerData(res.data);
      } else {
        alert('Consumer not found!');
        setConsumerData(null);
      }
    } catch (err) {
      console.error('Error fetching consumer data:', err);
      alert('Consumer not found!');
      setConsumerData(null);
    } finally {
      setLoading(false);
    }
  };

  // Delete consumer by consumerNumber
  const handleDeleteConsumer = async (consumerNumber) => {
    if (!consumerNumber) {
      alert('Please enter a valid consumer number to delete');
      return;
    }
    setErrorMessage('');
    try {
      const response = await axios.delete(`http://localhost:5000/api/consumers/${consumerNumber}`);
      if (response.status === 200) {
        console.log('Consumer deleted successfully');
        setMessage('Consumer deleted successfully'); // Set the success message

        // Refresh the list of consumers
        const fetchConsumers = async () => {
          const res = await axios.get('http://localhost:5000/api/consumers');
          setConsumers(res.data);
        };
        fetchConsumers();
      } else {
        console.error('Failed to delete consumer:', response.statusText);
        setErrorMessage('Failed to delete consumer. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting consumer:', error.response ? error.response.data : error.message);
      setErrorMessage('Error deleting consumer. Please try again.');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <button onClick={() => onLogout()} className="logout-btn">Logout</button>

      <div className="navigation-buttons">
  <button onClick={() => navigate('/add-consumer')}>Add Consumer</button>
  <button onClick={() => navigate('/add-reading')}>Add Reading</button>
  <button onClick={() => navigate('/update-consumer')}>Update Consumer</button>
</div>

      <div className="search-consumer">
        <input
          type="text"
          placeholder="Enter Consumer Number"
          value={consumerNumber}
          onChange={(e) => setConsumerNumber(e.target.value)}
        />
        <button onClick={handleSearchConsumer}>Search</button>
        <button onClick={() => handleDeleteConsumer(consumerNumber)}>Delete Consumer</button>
      </div>

      {message && <p className="success-message">{message}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {loading && <p>Loading...</p>}

      {consumerData && (
        <div className="consumer-details">
          <h3>Consumer Details</h3>
          <p>Name: {consumerData.name}</p>
          <p>Address: {consumerData.address}</p>
          <p>Phone: {consumerData.phoneNumber}</p>
          <p>Tariff Plan: {consumerData.tariffPlan}</p>
          <p>Meter Serial Number: {consumerData.meterSerialNumber}</p>
        </div>
      )}

      <div className="consumer-list">
        <h3>All Consumers</h3>
        <ul>
          {Array.isArray(consumers) && consumers.length > 0 ? (
            consumers.map((consumer) => (
              <li key={consumer.consumerNumber}>{consumer.name}</li>
            ))
          ) : (
            <p>No consumers available</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;