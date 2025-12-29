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

// Get bill summary with deadline and reminders
export const getBillSummary = async (consumerNumber) => {
  try {
    // Try new bill-summary endpoint first
    const response = await axios.get(`${API_URL}/bill-summary/${consumerNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching from bill-summary, trying fallback endpoint:', error);
    try {
      // Fallback to old details endpoint and transform the response
      const response = await axios.get(`${API_URL}/details/${consumerNumber}`);
      const data = response.data;
      
      // Transform old endpoint response to new format
      const now = new Date();
      const defaultDeadline = new Date();
      defaultDeadline.setDate(defaultDeadline.getDate() + 30);
      
      return {
        consumerNumber: consumerNumber,
        name: data.name,
        address: data.address || 'N/A',
        phoneNumber: data.phoneNumber || 'N/A',
        meterSerialNumber: data.meterSerialNumber,
        tariffPlan: data.tariffPlan,
        billAmount: data.amount || 0,
        currentReading: data.currentReading || 0,
        paymentStatus: 'Pending',
        lastPaymentDate: null,
        billCycleDays: 30,
        nextPaymentDeadline: defaultDeadline,
        daysUntilDeadline: 30,
        isOverdue: false,
        isFineApplied: false,
        fineDetails: {
          fineAmount: 0,
          cgstOnFine: 0,
          sgstOnFine: 0,
          totalFineWithTax: 0
        },
        totalAmountDue: data.amount || 0,
        reminderMessage: `ℹ️ Upcoming Bill: Your next payment is due on ${defaultDeadline.toDateString()} (30 days remaining)`,
        reminderType: 'notice'
      };
    } catch (fallbackError) {
      console.error('Both bill-summary and fallback endpoints failed:', fallbackError);
      throw new Error('Bill details not found for this consumer number. Please check the consumer number and try again.');
    }
  }
};

// Mark payment as paid
export const markPaymentAsPaid = async (consumerNumber) => {
  try {
    const response = await axios.post(`${API_URL}/mark-paid/${consumerNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error marking payment as paid:', error);
    throw error;
  }
};

// Get all consumers with fines (for admin)
export const getConsumersWithFines = async () => {
  try {
    const response = await axios.get(`${API_URL}/fines/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching consumers with fines:', error);
    throw error;
  }
};
