import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Upload, 
  LogOut, 
  User, 
  Search, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  RefreshCcw, 
  X,
  Database,
  ShieldCheck
} from 'lucide-react';

function ScanReadings({ onLogout }) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [consumerNo, setConsumerNo] = useState('');
  const [consumerName, setConsumerName] = useState('');
  const [meterNo, setMeterNo] = useState('');
  const [previousReading, setPreviousReading] = useState('');
  const [currentReading, setCurrentReading] = useState('');
  const [aiExtractedReading, setAiExtractedReading] = useState('');
  const [manualReading, setManualReading] = useState('');
  const [readingMatch, setReadingMatch] = useState(null);
  const [amount, setAmount] = useState('');
  const [tariff, setTariff] = useState(0);
  const [userName, setUserName] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'Guest User';
    setUserName(storedName);
  }, []);

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        } else {
          console.error('Video element not found');
        }
      }, 100);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const captureImage = () => {
    const context = canvasRef.current?.getContext('2d');
    if (!context || !videoRef.current || !canvasRef.current) return;

    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    
    canvasRef.current.toBlob(
      (blob) => {
        const file = new File([blob], `meter-${Date.now()}.png`, { type: 'image/png' });
        setUploadedImage(file);
        stopCamera();
        extractAIReading(file);
      },
      'image/png'
    );
  };

  const extractAIReading = async (file) => {
    try {
      console.log('🔍 Starting AI extraction for file:', file.name);
      console.log('📤 Sending request to: http://localhost:8000/validate-meter');
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('user_reading', '0'); 

      console.log('📋 FormData prepared with image and user_reading');

      const response = await fetch('http://localhost:8000/validate-meter', {
        method: 'POST',
        body: formData,
      });

      console.log('✅ Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Full AI Service Response:', JSON.stringify(data, null, 2));
        
        const meterReading = data.meter_reading ? String(data.meter_reading).trim() : '';
        console.log('🔄 Trimmed meter_reading:', meterReading);
        
        if (meterReading !== '') {
          setAiExtractedReading(meterReading);
          alert(`📊 AI extracted reading: ${meterReading}\n\nNow please enter the reading you see on the meter to verify.`);
        } else {
          setAiExtractedReading('');
          alert('Could not extract reading from image. Please enter manually.');
        }
      } else {
        setAiExtractedReading('');
        alert('Could not extract reading from image. Please enter manually.');
      }
    } catch (error) {
      console.error('❌ Error extracting AI reading:', error);
      setAiExtractedReading('');
      alert('Could not extract reading from image. Please enter manually.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert('Please upload a valid image file (JPEG or PNG)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      setUploadedImage(file);
      extractAIReading(file);
    }
  };

  const fetchConsumerDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/consumers/${consumerNo}`);
      if (!response.ok) throw new Error('Consumer not found');
      const data = await response.json();

      const tariffRateMap = {
        Domestic: 5,
        Commercial: 10,
        Industrial: 15,
      };

      setConsumerName(data.name || '');
      setMeterNo(data.meterSerialNumber || '');
      const lastReading = Array.isArray(data.readings) && data.readings.length > 0
        ? data.readings[data.readings.length - 1].units
        : data.currentReading ?? 0;
      setPreviousReading(lastReading);
      setTariff(tariffRateMap[data.tariffPlan] || 0);
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Consumer not found.');
    }
  };

  const handleCurrentReadingChange = (value) => {
    setCurrentReading(value);
    const prev = parseFloat(previousReading) || 0;
    const curr = parseFloat(value) || 0;
    const units = curr - prev;
    setAmount((units * tariff).toFixed(2));
  };

  const compareReadings = (aiReading, manualInput) => {
    if (!aiReading || !manualInput) return false;
    const aiVal = parseFloat(aiReading);
    const manualVal = parseFloat(manualInput);
    if (isNaN(aiVal) || isNaN(manualVal)) return false;
    const difference = Math.abs(aiVal - manualVal);
    return difference <= 1;
  };

  const handleManualReadingChange = (value) => {
    setManualReading(value);
    if (aiExtractedReading) {
      const isMatch = compareReadings(aiExtractedReading, value);
      setReadingMatch(isMatch);
      if (isMatch) {
        setCurrentReading(value);
        const prev = parseFloat(previousReading) || 0;
        const curr = parseFloat(value) || 0;
        const units = curr - prev;
        setAmount((units * tariff).toFixed(2));
      }
    }
  };

  const handleSubmitReading = async () => {
    const prev = parseFloat(previousReading) || 0;
    const curr = parseFloat(currentReading);

    if (Number.isNaN(curr)) {
      alert('Please enter a valid current reading.');
      return;
    }

    const unitsConsumed = curr - prev;
    if (unitsConsumed < 0) {
      alert('Current reading cannot be less than previous reading. Please check your readings again.');
      return;
    }

    if (unitsConsumed === 0) {
      alert('Current reading must be greater than previous reading. No units consumed.');
      return;
    }

    if (!uploadedImage) {
      alert('Please upload or capture an image first.');
      return;
    }

    if (!readingMatch) {
      alert('Please ensure your manual entry matches the AI extracted reading (within 1 unit difference).');
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('image', uploadedImage);
      formData.append('consumerNumber', consumerNo);
      formData.append('userReading', curr.toString());
      formData.append('aiExtractedReading', aiExtractedReading);
      formData.append('manualReading', manualReading);

      const response = await fetch(`http://localhost:5000/api/consumers/validate-meter-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (err.status === 'OCR_FAILED') {
          throw new Error(err.message || 'Could not extract reading from image. Please enter manually.');
        }
        throw new Error(err.message || err.reason || 'Failed to validate meter image');
      }

      const data = await response.json();
      
      if (data.status === 'VALID') {
        setPreviousReading(curr);
        setAmount((data.amount || 0).toFixed(2));
        setUploadedImage(null);
        setCurrentReading('');
        setAiExtractedReading('');
        setManualReading('');
        setReadingMatch(null);
        alert(`✓ Reading submitted successfully!\n\nAI Output: ${data.meter_reading}\nManual Entry: ${manualReading}\nUnits Consumed: ${data.units_consumed}\nAmount: ₹${data.amount}`);
      } else {
        alert(`Validation failed: ${data.reason || data.message}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert(error.message || 'Error submitting reading.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* GRIDVISION TOP NAV */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
              <Zap className="text-white w-6 h-6" fill="currentColor" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-800">Grid<span className="text-indigo-600">Vision</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
              <User size={16} className="text-indigo-600" />
              <span className="text-sm font-bold text-slate-700">{userName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-900 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-md"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: CONSUMER DATA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Search className="text-indigo-600" size={20} />
                Verification Center
              </h2>
              
              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="text"
                    value={consumerNo}
                    onChange={e => setConsumerNo(e.target.value)}
                    className="w-full pl-5 pr-28 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    placeholder="Consumer Number"
                  />
                  <button
                    onClick={fetchConsumerDetails}
                    className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Fetch
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Consumer Name</p>
                      <p className="text-slate-800 font-bold">{consumerName || '---'}</p>
                    </div>
                    <Database size={20} className="text-slate-300" />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Meter Serial</p>
                      <p className="text-slate-800 font-bold">{meterNo || '---'}</p>
                    </div>
                    <ShieldCheck size={20} className="text-slate-300" />
                  </div>
                  <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Previous Record</p>
                      <p className="text-indigo-900 font-black text-2xl">
                        {previousReading || '0'} <span className="text-sm font-bold">kWh</span>
                      </p>
                    </div>
                    <Zap size={24} className="text-indigo-600 opacity-50" />
                  </div>
                </div>
              </div>
            </div>

            {/* BILLING SUMMARY CARD */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
               <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.2em] mb-3">Estimated Total</p>
               <h3 className="text-5xl font-black mb-8 tracking-tighter">₹{amount || '0.00'}</h3>
               <div className="flex justify-between items-end border-t border-slate-800 pt-6">
                 <div>
                   <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Calculated Units</p>
                   <p className="text-xl font-bold">{currentReading ? (parseFloat(currentReading) - (parseFloat(previousReading) || 0)).toFixed(1) : '0'} kWh</p>
                 </div>
                 <div className="text-right">
                   <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Tariff Plan</p>
                   <p className="text-xl font-bold text-indigo-400">₹{tariff}/unit</p>
                 </div>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: AI SCANNING INTERFACE */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Camera className="text-indigo-600" size={20} />
                GridVision AI Capture
              </h2>

              {!isCameraOpen ? (
                <div className="flex-1 flex flex-col">
                  <div 
                    className={`flex-1 border-2 border-dashed rounded-[2.5rem] p-10 flex flex-col items-center justify-center transition-all duration-300
                      ${uploadedImage ? 'border-green-400 bg-green-50/20' : 'border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/30'}`}
                  >
                    {uploadedImage ? (
                      <div className="text-center">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                          <CheckCircle className="text-green-600 w-12 h-12" />
                        </div>
                        <p className="text-slate-800 font-black text-xl mb-1">Image Loaded</p>
                        <p className="text-slate-500 text-sm font-medium">{uploadedImage.name}</p>
                        <button 
                          onClick={() => { setUploadedImage(null); setAiExtractedReading(''); }}
                          className="mt-6 text-indigo-600 font-bold text-sm flex items-center gap-2 mx-auto hover:underline"
                        >
                          <RefreshCcw size={14} /> Clear and Retake
                        </button>
                      </div>
                    ) : (
                      <div className="text-center max-w-sm">
                        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-600">
                          <Camera size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">Scan Meter</h3>
                        <p className="text-slate-500 font-medium text-sm mb-10 leading-relaxed">
                          Position your electric meter display clearly. Our AI will automatically extract the readings.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <button 
                            onClick={startCamera}
                            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transform hover:-translate-y-1 transition-all"
                          >
                            Open Camera
                          </button>
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
                          >
                            <Upload size={18} /> Upload File
                          </button>
                        </div>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                  </div>

                  {/* READINGS VERIFICATION SECTION */}
                  <div className="mt-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">AI Detection</label>
                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-inner">
                          <p className="text-3xl font-black text-indigo-400 tracking-tighter">
                            {aiExtractedReading || '00000'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Human Validation</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={manualReading}
                            onChange={(e) => handleManualReadingChange(e.target.value)}
                            className={`w-full p-5 rounded-2xl text-3xl font-black outline-none border-2 transition-all ${
                              readingMatch === true ? 'border-green-500 bg-green-50 text-green-900' : 
                              readingMatch === false ? 'border-red-400 bg-red-50 text-red-900' : 'border-slate-200 bg-white focus:border-indigo-500'
                            }`}
                            placeholder="0.0"
                          />
                          <div className="absolute right-5 top-1/2 -translate-y-1/2">
                            {readingMatch === true && <CheckCircle className="text-green-600" />}
                            {readingMatch === false && <AlertCircle className="text-red-500" />}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={!readingMatch || isProcessing}
                      onClick={handleSubmitReading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[1.5rem] font-black text-lg transition-all shadow-xl shadow-indigo-100 disabled:opacity-20 disabled:shadow-none flex items-center justify-center gap-3"
                    >
                      {isProcessing ? (
                        <><RefreshCcw className="animate-spin" /> Finalizing...</>
                      ) : (
                        <>Submit Meter Record</>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="relative flex-1 bg-black rounded-[2.5rem] overflow-hidden border-4 border-slate-900 shadow-2xl flex items-center justify-center">
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                    
                    {/* CAMERA OVERLAY UI */}
                    <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
                        <div className="w-full h-40 border-2 border-indigo-400 border-dashed rounded-lg opacity-60"></div>
                    </div>
                    
                    <div className="absolute bottom-8 flex gap-6">
                      <button 
                        onClick={captureImage}
                        className="bg-white text-slate-900 p-6 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all"
                      >
                        <Camera size={36} />
                      </button>
                      <button 
                        onClick={stopCamera}
                        className="bg-red-600 text-white p-6 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all"
                      >
                        <X size={36} />
                      </button>
                    </div>
                  </div>
                  <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mt-6">Ensure digits are clearly visible within the frame</p>
                  <canvas ref={canvasRef} width="640" height="480" className="hidden" />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* GRIDVISION FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-indigo-600" />
            <p className="text-slate-500 text-sm font-bold">© 2025 GridVision Intelligence Systems Inc.</p>
          </div>
          <div className="flex gap-8 text-xs font-black text-slate-400 uppercase tracking-widest">
            <a href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Architecture</a>
            <a href="/terms" className="hover:text-indigo-600 transition-colors">Service Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ScanReadings;