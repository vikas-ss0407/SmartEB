import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { login } from '../api/authApi';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await login({ email, password });
      const user = res.data.user;
      const role = user.role;

      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userRole', role);

      onLoginSuccess({ name: user.name, role: role, id: user.id });

      if (role === 'citizen') {
        navigate('/dashboard');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        alert('Invalid role');
      }
    } catch (err) {
      alert('Authentication Shield: Access Denied. Check Credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#02040a] font-sans selection:bg-teal-500/30">
      
      {/* 1. INDUSTRIAL VIDEO BACKGROUND OVERLAY */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#02040a]/80 via-transparent to-[#02040a] z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30 filter grayscale"
        >
          {/* Replace this URL with a local industrial/tech video asset */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-circuit-board-12711-large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 2. BACKGROUND SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />

      {/* Back to Landing Button */}
      <button
        onClick={() => {
          navigate('/', { replace: true });
          // Hard fallback if SPA history is empty or swipe back is blocked
          setTimeout(() => {
            if (window.location.pathname === '/login') {
              window.location.href = '/';
            }
          }, 60);
        }}
        className="absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all text-sm font-bold"
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Back to Home</span>
      </button>

      {/* 3. LOGIN INTERFACE */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-[90%] max-w-[450px]"
      >
        {/* Terminal Header Decoration */}
        <div className="flex items-center justify-between bg-white/5 backdrop-blur-md border-t border-x border-white/10 p-3 rounded-t-2xl">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-teal-500/50" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Secure Node: 882-GV</span>
        </div>

        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden rounded-b-2xl">
          
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-teal-500/30 rounded-tr-xl" />
          
          <header className="mb-10 text-center">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-block p-4 bg-teal-500/10 rounded-full mb-6 border border-teal-500/20"
            >
              <span className="text-3xl">🛡️</span>
            </motion.div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-2">
              GRID<span className="text-teal-500">VISION</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Biometric Auth Terminal</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-teal-500 ml-1">Identity Vector (Email)</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors">👤</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-teal-500/50 focus:bg-teal-500/5 transition-all"
                  placeholder="USER@GRIDVISION.IO"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-teal-500 ml-1">Access Protocol (Password)</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors">🔑</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-teal-500/50 focus:bg-teal-500/5 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="py-4 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-white transition-all"
              >
                Register
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="relative overflow-hidden group py-4 rounded-xl bg-teal-500 text-black text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-[0_0_30px_rgba(20,184,166,0.4)]"
              >
                <span className={isLoading ? 'opacity-0' : 'opacity-100'}>Initialize</span>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* System Footer Info */}
          <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-bold text-slate-600 uppercase tracking-widest">
            <span>Server: ASIA-SOUTH-1</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              Online
            </span>
          </div>
        </div>
      </motion.div>

      {/* 4. FLOATING LOGS (Industrial Aesthetic) */}
      <div className="hidden lg:block absolute bottom-10 right-10 text-[10px] font-mono text-teal-500/30 text-right leading-tight select-none">
        <p>SYSTEM_BOOT_SUCCESS</p>
        <p>ENCRYPTION_LAYER_ACTIVE</p>
        <p>WAITING_FOR_USER_ID...</p>
      </div>
    </div>
  );
}

export default Login;