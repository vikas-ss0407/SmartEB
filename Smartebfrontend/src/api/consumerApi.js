import axios from 'axios';

// Set up the base URL for the API
const API_URL = 'http://localhost:5000/api/consumers';

// Add a new consumer
export const addConsumer = async (consumerData) => {
  try {
    const response = await axios.post(API_URL, consumerData);
    return response.data;
  } catch (error) {
    console.error('Error adding consumer:', error);
    throw error;
  }
};

// Update an existing consumer
export const updateConsumer = async (consumerNumber, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${consumerNumber}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating consumer:', error);
    throw error;
  }
};

// Delete a consumer
export const deleteConsumer = async (consumerNumber) => {
  try {
    const response = await axios.delete(`${API_URL}/${consumerNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting consumer:', error);
    throw error;
  }
};

// Add a reading for a consumer
export const addReading = async (consumerNumber, unitsConsumed) => {
  try {
    const response = await axios.post(`${API_URL}/add-reading/${consumerNumber}`, { unitsConsumed });
    return response.data;
  } catch (error) {
    console.error('Error adding reading:', error);
    throw error;
  }
};
