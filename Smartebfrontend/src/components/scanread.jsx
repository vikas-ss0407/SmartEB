import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';

function ScanReadings({ onLogout }) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [consumerNo, setConsumerNo] = useState('');
  const [consumerName, setConsumerName] = useState('');
  const [meterNo, setMeterNo] = useState('');
  const [previousReading, setPreviousReading] = useState('');
  const [currentReading, setCurrentReading] = useState('');
  const [amount, setAmount] = useState('');
  const [tariff, setTariff] = useState(0);
  const [userName, setUserName] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'Guest User';
    setUserName(storedName);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraOpen(true);
        } else {
          console.error('Video element not found');
        }
      }, 100);
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  // UI-only update: no manual current reading handler changes

  const captureImage = () => {
    const context = canvasRef.current?.getContext('2d');
    if (!context || !videoRef.current || !canvasRef.current) return;

    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = canvasRef.current.toDataURL();

    Tesseract.recognize(imageData, 'eng')
      .then(({ data: { text } }) => {
        const extracted = parseFloat(text.match(/[\d.]+/g)?.[0] || 0).toFixed(2);
        setCurrentReading(`${extracted} kwh`);
        const prev = parseFloat(previousReading) || 0;
        const curr = parseFloat(extracted) || 0;
        const units = curr - prev;
        setAmount((units * tariff).toFixed(2));
        stopCamera();
      })
      .catch(err => {
        console.error('OCR error:', err);
        stopCamera();
      });
  };

  const fetchConsumerDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/consumer/${consumerNo}`);
      if (!response.ok) throw new Error('Consumer not found');
      const data = await response.json();
      setConsumerName(data.name || '');
      setMeterNo(data.meterNo || '');
      setPreviousReading(data.previousReading || '');
      setTariff(data.tariff || 0);
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Consumer not found.');
    }
  };

  // UI-only update: no submit handler added/changed

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-400 to-slate-600 flex flex-col">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 shadow-lg p-3 md:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <div className="text-white font-bold text-base md:text-lg flex items-center gap-2">
            <span className="text-xl md:text-2xl">📷</span> Scan Readings
          </div>
          <div className="text-white flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="font-semibold text-sm md:text-base text-center">Hi {userName}, Welcome!</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-sm md:text-base transition-all duration-300 w-full sm:w-auto"
            >
              Logout →
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl border-2 border-teal-400 p-4 sm:p-6 md:p-8 w-full max-w-2xl">
          <h2 className="text-xl md:text-2xl font-bold text-slate-700 mb-4 md:mb-6 text-center">📋 Enter Meter Details</h2>

          <div className="space-y-4 md:space-y-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex flex-col">
                <label className="text-slate-700 font-semibold mb-2 text-sm md:text-base">Consumer No:</label>
                <input
                  type="text"
                  id="consumerNo"
                  value={consumerNo}
                  onChange={e => setConsumerNo(e.target.value)}
                  className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-teal-400 focus:bg-white outline-none transition-all text-sm md:text-base"
                  placeholder="Enter consumer number"
                />
              </div>
              <div className="flex items-end">
                <button
                  className="bg-gradient-to-r from-teal-500 to-teal-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg hover:shadow-lg transition-all duration-300 w-full sm:w-auto text-sm md:text-base"
                  onClick={fetchConsumerDetails}
                >
                  Enter
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-slate-700 font-semibold mb-2 text-sm md:text-base">Consumer Name:</label>
                <input
                  type="text"
                  value={consumerName}
                  readOnly
                  className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-200 text-slate-600 cursor-not-allowed text-sm md:text-base"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-slate-700 font-semibold mb-2 text-sm md:text-base">Meter No:</label>
                <input
                  type="text"
                  value={meterNo}
                  readOnly
                  className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-200 text-slate-600 cursor-not-allowed text-sm md:text-base"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-slate-700 font-semibold mb-2 text-sm md:text-base">Previous Month Reading:</label>
              <input
                type="text"
                value={previousReading + ' kwh'}
                readOnly
                className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-200 text-slate-600 cursor-not-allowed text-sm md:text-base"
              />
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 rounded-lg border-2 border-blue-300">
              <label className="text-slate-700 font-semibold mb-2 md:mb-3 block text-sm md:text-base">📸 Scan Readings:</label>

              {!isCameraOpen ? (
                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm md:text-base"
                  onClick={startCamera}
                >
                  📷 Click Here to Scan
                </button>
              ) : (
                <div className="space-y-3">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full rounded-lg border-2 border-blue-400"
                  />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 md:py-3 rounded-lg transition-all text-sm md:text-base"
                      onClick={captureImage}
                    >
                      ✓ Take Photo
                    </button>
                    <button
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 md:py-3 rounded-lg transition-all text-sm md:text-base"
                      onClick={stopCamera}
                    >
                      ✕ Stop Camera
                    </button>
                  </div>
                  <canvas ref={canvasRef} width="640" height="480" className="hidden" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-slate-700 font-semibold mb-2 text-sm md:text-base">Current Reading:</label>
                <input
                  type="text"
                  value={currentReading}
                  readOnly
                  className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-green-100 border-2 border-green-300 text-slate-700 font-semibold text-sm md:text-base"
                  placeholder="Reading will appear here"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-slate-700 font-semibold mb-2 text-sm md:text-base">Amount (₹):</label>
                <input
                  type="text"
                  value={amount}
                  readOnly
                  className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-amber-100 border-2 border-amber-300 text-slate-700 font-semibold text-sm md:text-base"
                  placeholder="Amount will appear here"
                />
              </div>
            </div>

            <button
              className="w-full bg-gradient-to-r from-slate-800 to-black text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm md:text-base"
            >
              ✓ Submit Reading
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white text-center py-3 md:py-4 border-t-2 border-slate-700">
        <p className="text-xs md:text-sm px-2">&copy; 2025 ScanReadings Inc. All rights reserved.</p>
        <div className="text-xs mt-1 md:mt-2 px-2">
          <a href="/privacy-policy" className="hover:text-teal-400">Privacy Policy</a> | <a href="/terms-of-service" className="hover:text-teal-400">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}

export default ScanReadings;