import React, { useState } from 'react';
import axios from 'axios';

function AddConsumer() {
  const [consumer, setConsumer] = useState({
    consumerNumber: '',
    meterSerialNumber: '',
    name: '',
    address: '',
    phoneNumber: '',
    tariffPlan: 'Domestic',
  });

  const handleChange = (e) => {
    setConsumer({ ...consumer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/consumers', consumer);
      alert('Consumer added successfully!');
    } catch (err) {
      console.error('Error adding consumer:', err);
      alert('Error adding consumer!');
    }
  };
  

  return (
    <div className="add-consumer">
      <h2>Add Consumer</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="consumerNumber"
          placeholder="Consumer Number"
          value={consumer.consumerNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="meterSerialNumber"
          placeholder="Meter Serial Number"
          value={consumer.meterSerialNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={consumer.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Customer Address"
          value={consumer.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={consumer.phoneNumber}
          onChange={handleChange}
          required
        />
        <select name="tariffPlan" value={consumer.tariffPlan} onChange={handleChange}>
          <option value="Domestic">Domestic</option>
          <option value="Commercial">Commercial</option>
        </select>
        <button type="submit">Add Consumer</button>
      </form>
    </div>
  );
}

export default AddConsumer;
