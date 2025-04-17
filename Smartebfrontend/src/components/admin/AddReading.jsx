import React, { useState } from 'react';
import axios from 'axios';

function AddReading() {
  const [reading, setReading] = useState({
    consumerNumber: '',
    meterReading: '',
    readingDate: '',
  });

  const handleChange = (e) => {
    setReading({ ...reading, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if meterReading is a valid number before sending
    if (isNaN(reading.meterReading) || reading.meterReading <= 0) {
      alert('Please enter a valid meter reading!');
      return;
    }
  
    try {
      const response = await axios.put(`http://localhost:5000/api/consumers/add-reading/${reading.consumerNumber}`, {
        unitsConsumed: Number(reading.meterReading),  // Ensure this is a number
        readingDate: reading.readingDate,  // Include reading date as well
      });
      alert('Reading added successfully!');
    } catch (err) {
      console.error(err);  // Log the error to see the details
      alert('Error adding reading!');
    }
  };
  
  return (
    <div className="add-reading">
      <h2>Add Reading</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="consumerNumber"
          placeholder="Consumer Number"
          value={reading.consumerNumber}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="meterReading"
          placeholder="Meter Reading"
          value={reading.meterReading}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="readingDate"
          value={reading.readingDate}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Reading</button>
      </form>
    </div>
  );
}

export default AddReading;
