import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { signup } from '../api/authApi';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', fatherName: '', dob: '', email: '',
    password: '', address: '', phoneNo: '', role: 'citizen'
  });
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.play().catch(() => {});
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await signup(formData);
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-[#0a0a0c] font-mono">
      
      {/* 1. INDUSTRIAL ANIMATED BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-transparent to-blue-600/10 z-10" />
        <video
          ref={videoRef}
          autoPlay loop muted playsInline
          className="w-full h-full object-cover opacity-30 grayscale contrast-150"
        >
          {/* Using an abstract mechanical/industrial movement video */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-mechanical-parts-of-a-clock-running-4321-large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 2. HUD OVERLAY: GRID & CORNER BRACKETS */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-orange-500/50" />
        <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-blue-500/50" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Back to Landing Button */}
      <button
        onClick={() => {
          navigate('/', { replace: true });
          // Hard fallback if SPA history is empty or swipe back is blocked
          setTimeout(() => {
            if (window.location.pathname === '/signup') {
              window.location.href = '/';
            }
          }, 60);
        }}
        className="absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-slate-400 hover:text-white transition-all text-sm font-bold"
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Back to Home</span>
      </button>

      {/* 3. THE "ENGINEERING" FORM CONTAINER */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-20 w-full max-w-5xl bg-[#121216] border border-white/10 rounded-sm shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* TOP STATUS BAR */}
        <div className="bg-orange-500 h-1 w-full animate-pulse" />
        <div className="flex items-center justify-between px-6 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-orange-500 text-xs font-black animate-pulse">● SYSTEM_IDLE</span>
            <span className="text-white/30 text-[10px] tracking-[0.3em]">REF: REG-2025-X</span>
          </div>
          <div className="text-white/30 text-[10px]">AUTH_LEVEL: 01</div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* SIDE LOGS PANEL */}
          <div className="lg:w-64 bg-black/40 p-6 border-r border-white/10 hidden lg:block">
            <h3 className="text-orange-500 text-[10px] font-black mb-8 tracking-widest uppercase italic">Diagnostic Data</h3>
            <div className="space-y-6 text-[9px] text-white/40">
              <div>
                <p className="text-white/60 mb-1 font-bold tracking-widest underline">HARDWARE_SCAN</p>
                <p>MEMORY: 64GB_ECC</p>
                <p>STATUS: OPTIMAL</p>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-white/60 mb-1 font-bold tracking-widest underline">ENCRYPTION</p>
                <p>TYPE: SHA-256</p>
                <p>KEY_GEN: ACTIVE</p>
              </div>
            </div>
          </div>

          {/* MAIN FORM AREA */}
          <div className="flex-1 p-8 lg:p-12">
            <header className="mb-10">
              <h2 className="text-3xl font-black text-white italic tracking-tighter">
                ACCOUNT_<span className="text-orange-500">PROVISIONING</span>
              </h2>
              <p className="text-white/40 text-[10px] mt-2 tracking-[0.5em] uppercase">Enter required parameters to initialize node</p>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              {[
                { label: 'USER_NAME', name: 'name', type: 'text', placeholder: 'ID_ALPHA' },
                { label: 'PATERNAL_ID', name: 'fatherName', type: 'text', placeholder: 'ID_BETA' },
                { label: 'TIMESTAMP_DOB', name: 'dob', type: 'date' },
                { label: 'COMMS_CHANNEL', name: 'email', type: 'email', placeholder: 'USER@GRID.IO' },
                { label: 'SEC_PROTOCOL', name: 'password', type: 'password', placeholder: '••••••••' },
                { label: 'MOBILE_UPLINK', name: 'phoneNo', type: 'tel', placeholder: '10-DIGIT_INT' },
              ].map((f) => (
                <div key={f.name} className="relative group">
                  <label className="block text-[10px] font-black text-white/40 mb-2 group-focus-within:text-orange-500 transition-colors uppercase tracking-widest">
                    {f.label}
                  </label>
                  <input
                    name={f.name} type={f.type} placeholder={f.placeholder} onChange={handleChange} required
                    className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:border-orange-500 outline-none transition-all placeholder:text-white/10"
                  />
                  <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-orange-500 group-focus-within:w-full transition-all duration-500" />
                </div>
              ))}

              <div className="md:col-span-2 relative group">
                <label className="block text-[10px] font-black text-white/40 mb-2 group-focus-within:text-orange-500 transition-colors uppercase tracking-widest">STATION_ADDRESS_LOCATION</label>
                <input
                  name="address" onChange={handleChange} required
                  className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:border-orange-500 outline-none transition-all"
                />
              </div>

              <div className="relative group">
                <label className="block text-[10px] font-black text-white/40 mb-2 group-focus-within:text-orange-500 transition-colors uppercase tracking-widest">ASSIGN_ROLE</label>
                <select 
                  name="role" onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:border-orange-500 outline-none transition-all cursor-pointer appearance-none"
                >
                  <option value="citizen" className="bg-[#121216]">OPERATOR (CITIZEN)</option>
                  <option value="admin" className="bg-[#121216]">COMMANDER (ADMIN)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-white text-black font-black text-xs py-4 hover:bg-orange-500 hover:text-white transition-all group flex items-center justify-center gap-3"
                >
                  {isLoading ? 'SYNCING...' : (
                    <>
                      INITIALIZE_NODE
                      <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-12 flex items-center gap-4 text-[9px] font-black">
              <span className="text-white/20 uppercase tracking-widest">Already have an ID?</span>
              <button onClick={() => navigate('/login')} className="text-orange-500 hover:underline">RETURN_TO_BASE</button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4. FOOTER TELEMETRY */}
      <div className="absolute bottom-6 left-6 text-white/10 text-[8px] flex gap-8 select-none">
        <span>LATENCY: 12ms</span>
        <span>UPTIME: 99.9%</span>
        <span>ENCODING: UTF-8</span>
      </div>
    </div>
  );
};

export default Signup;