import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { markPaymentAsPaid } from '../api/consumerApi';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State management for the simulation flow
  const [paymentStep, setPaymentStep] = useState('idle'); // idle, processing, showingQR, success
  const [dummyPaymentId] = useState(`PAYID-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);

  const { 
    consumerNo = "N/A", 
    consumerName = "Guest User", 
    amount = 0, 
    dueDate = "N/A" 
  } = location.state || {};

  // Simulate the payment process after QR is "scanned"
  useEffect(() => {
    if (paymentStep === 'showingQR') {
      const timer = setTimeout(() => {
        setPaymentStep('success');
      }, 5000); // 5 seconds wait time
      return () => clearTimeout(timer);
    }

    if (paymentStep === 'success') {
      const timer = setTimeout(async () => {
        try {
          if (consumerNo && consumerNo !== 'N/A') {
            await markPaymentAsPaid(consumerNo);
          }
        } catch (err) {
          console.error('Error marking payment as paid from Payment page:', err);
        }

        alert(`Payment Successful! Transaction ID: ${dummyPaymentId}`);
        navigate('/ereciept', { state: { consumerNo } }); // Redirect to E-Receipt for this consumer
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [paymentStep, navigate, dummyPaymentId]);

  const startPaymentFlow = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('showingQR');
    }, 1500); // Short loading delay before QR shows
  };

  return (
    <div className="payment-container" style={styles.container}>
      {paymentStep === 'idle' && (
        <>
          <h1>Confirm Payment</h1>
          <div style={styles.detailsCard}>
            <p><strong>Consumer No:</strong> {consumerNo}</p>
            <p><strong>Name:</strong> {consumerName}</p>
            <p style={styles.amountText}><strong>Amount Due:</strong> ₹{amount}</p>
            <p><strong>Due Date:</strong> {dueDate}</p>
          </div>
          <button onClick={startPaymentFlow} style={styles.button}>
            Go with QR
          </button>
        </>
      )}

      {paymentStep === 'processing' && (
        <div style={styles.statusBox}>
          <div className="loader" style={styles.spinner}></div>
          <p>Initializing Secure Payment Gateway...</p>
        </div>
      )}

      {paymentStep === 'showingQR' && (
        <div style={styles.qrContainer}>
          <h2>Scan to Pay</h2>
          <p>Scan this QR using any UPI App (PhonePe, GPay, Paytm)</p>
          <div style={styles.qrPlaceholder}>
             {/* Using a standard dummy QR generator link */}
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=test@upi&pn=SmartEB&am=${amount}&cu=INR`} 
              alt="Payment QR Code" 
              style={styles.qrImage}
            />
          </div>
          <p style={styles.timerText}>Waiting for payment confirmation... (5s)</p>
          <div style={styles.progressBar}>
            <div style={styles.progressFill}></div>
          </div>
        </div>
      )}

      {paymentStep === 'success' && (
        <div style={styles.statusBox}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={{ color: '#2ecc71' }}>Payment Successful!</h2>
          <p>Transaction ID: <strong>{dummyPaymentId}</strong></p>
          <p>Redirecting you back to home...</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '40px', textAlign: 'center', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' },
  detailsCard: { 
    border: '1px solid #ddd', 
    padding: '20px', 
    borderRadius: '12px', 
    display: 'inline-block',
    textAlign: 'left',
    marginBottom: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  amountText: { fontSize: '1.4rem', color: '#2ecc71', margin: '10px 0' },
  button: { 
    padding: '15px 40px', 
    backgroundColor: '#007bff', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '30px', 
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: '0.3s'
  },
  qrContainer: { 
    padding: '30px', 
    backgroundColor: '#f8f9fa', 
    borderRadius: '15px', 
    display: 'inline-block',
    border: '2px solid #007bff'
  },
  qrPlaceholder: { backgroundColor: '#fff', padding: '15px', borderRadius: '10px', margin: '20px 0' },
  qrImage: { width: '200px', height: '200px' },
  statusBox: { padding: '50px' },
  successIcon: { fontSize: '4rem', color: '#2ecc71', marginBottom: '20px' },
  timerText: { color: '#666', fontStyle: 'italic' },
  progressBar: { width: '100%', height: '8px', backgroundColor: '#eee', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' },
  progressFill: { 
    width: '100%', 
    height: '100%', 
    backgroundColor: '#2ecc71', 
    animation: 'fillProgress 5s linear' 
  },
  // Note: For the animation to work, you would usually add a CSS file. 
  // I've kept it simple with inline styles.
};

export default Payment;