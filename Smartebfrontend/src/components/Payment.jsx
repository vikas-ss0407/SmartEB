import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { consumerNo, consumerName, amount, dueDate } = location.state || {};

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      alert('Failed to load Razorpay SDK. Please try again.');
      return;
    }

    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay Key ID
      amount: amount * 100, // Amount in paise (multiply by 100 for INR)
      currency: 'INR',
      name: 'SmartEB Payment',
      description: `Payment for Consumer No: ${consumerNo}`,
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        navigate('/'); // Redirect to the home page or another page after payment
      },
      prefill: {
        name: consumerName,
        email: 'example@example.com', // Replace with the user's email
        contact: '9999999999', // Replace with the user's contact number
      },
      notes: {
        consumerNo: consumerNo,
        dueDate: dueDate,
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="payment-container">
      <h1>Payment Portal</h1>
      <div className="payment-details">
        <p><strong>Consumer No:</strong> {consumerNo}</p>
        <p><strong>Consumer Name:</strong> {consumerName}</p>
        <p><strong>Amount:</strong> ₹{amount}</p>
        <p><strong>Due Date:</strong> {dueDate}</p>
      </div>
      <button className="pay-button" onClick={handlePayment}>Pay Now</button>
    </div>
  );
}

export default Payment;