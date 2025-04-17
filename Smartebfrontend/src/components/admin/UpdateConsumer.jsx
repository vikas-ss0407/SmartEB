import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UpdateConsumer() {
  const navigate = useNavigate();
  const [consumerNumber, setConsumerNumber] = useState('');
  const [consumerData, setConsumerData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    tariffPlan: '',
    meterSerialNumber: '',
  });
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch consumer details by consumerNumber
  const handleFetchConsumer = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/consumers/${consumerNumber}`);
      setConsumerData(response.data);
      setMessage('');
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching consumer:', error);
      setErrorMessage('Consumer not found!');
      setConsumerData({
        name: '',
        address: '',
        phoneNumber: '',
        tariffPlan: '',
        meterSerialNumber: '',
      });
    }
  };

  // Handle form submission to update consumer
  const handleUpdateConsumer = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/consumers/${consumerNumber}`, consumerData);
      setMessage('Consumer updated successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating consumer:', error);
      setErrorMessage('Failed to update consumer. Please try again.');
    }
  };

  return (
    <div className="update-consumer">
      <h2>Update Consumer</h2>
      <div className="search-consumer">
        <input
          type="text"
          placeholder="Enter Consumer Number"
          value={consumerNumber}
          onChange={(e) => setConsumerNumber(e.target.value)}
        />
        <button onClick={handleFetchConsumer}>Fetch Consumer</button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {message && <p className="success-message">{message}</p>}

      {consumerData.name && (
        <form onSubmit={handleUpdateConsumer}>
          <input
            type="text"
            placeholder="Name"
            value={consumerData.name}
            onChange={(e) => setConsumerData({ ...consumerData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={consumerData.address}
            onChange={(e) => setConsumerData({ ...consumerData, address: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={consumerData.phoneNumber}
            onChange={(e) => setConsumerData({ ...consumerData, phoneNumber: e.target.value })}
            required
          />
          <select
            value={consumerData.tariffPlan}
            onChange={(e) => setConsumerData({ ...consumerData, tariffPlan: e.target.value })}
            required
          >
            <option value="">Select Tariff Plan</option>
            <option value="Domestic">Domestic</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
          </select>
          <input
            type="text"
            placeholder="Meter Serial Number"
            value={consumerData.meterSerialNumber}
            onChange={(e) => setConsumerData({ ...consumerData, meterSerialNumber: e.target.value })}
            required
          />
          <button type="submit">Update Consumer</button>
        </form>
      )}
    </div>
  );
}

export default UpdateConsumer;