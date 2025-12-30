import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  User, 
  LayoutDashboard, 
  Info, 
  Zap, 
  ArrowRight
} from 'lucide-react';

// Original Assets
import manImage from '../assets/man.png';
import quickPayImage from '../assets/Cash-Drawing.png';
import eReceiptImage from '../assets/MONEY.png';
import NotificationWidget from './Notifications';

// Animation Config
const cardIn = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', damping: 25, stiffness: 120 }
  }
};

function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = sessionStorage.getItem('userName') || localStorage.getItem('userName') || 'User';
    setUserName(name);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,#16202c_0%,#0a0c10_100%)] pointer-events-none" />
      
      {/* Mac OS Style Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0c10]/60 border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap className="text-white w-6 h-6" fill="white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white italic">eMeter Seva</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Account Active</p>
              <p className="text-sm font-medium text-white">{userName}</p>
            </div>
            <button 
              onClick={() => { onLogout?.(); navigate('/login'); }}
              className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto p-6 md:p-10 pb-32">
        <NotificationWidget />

        {/* Welcome Text */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
            Hello, {userName.split(' ')[0]}!
          </h2>
          <p className="text-slate-400 text-lg">
            What would you like to do today?
          </p>
        </motion.div>

        {/* Main Grid Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1: Scan Readings */}
          <ActionCard 
            title="Scan Meter"
            desc="Snap a photo of your meter to update your current usage units."
            image={manImage}
            onClick={() => navigate('/scanread')}
          />

          {/* Card 2: Quick Pay */}
          <ActionCard 
            title="Quick Pay"
            desc="Pay your monthly EB bill instantly via secure payment gateway."
            image={quickPayImage}
            onClick={() => navigate('/quickpage')}
          />

          {/* Card 3: E-Receipt */}
          <ActionCard 
            title="My Receipts"
            desc="Download and view your previous bill payment history."
            image={eReceiptImage}
            onClick={() => navigate('/ereciept')}
          />
        </div>
      </main>

      {/* Mac Style Navigation Dock */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <nav className="flex items-center gap-2 bg-[#161b22]/90 backdrop-blur-2xl border border-white/10 p-2 rounded-3xl shadow-2xl">
          <DockIcon to="/dashboard" icon={<LayoutDashboard size={22} />} active />
          <DockIcon to="/about" icon={<Info size={22} />} />
          <div className="w-[1px] h-6 bg-white/10 mx-1" />
          <DockIcon to="/profile" icon={<User size={22} />} />
        </nav>
      </div>
    </div>
  );
}

// Sub-components
function ActionCard({ title, desc, image, onClick }) {
  return (
    <motion.div
      variants={cardIn}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="group relative bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-[2.5rem] p-6 md:p-8 cursor-pointer transition-all duration-300 overflow-hidden"
    >
      <div className="mb-6 h-32 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full scale-50 group-hover:scale-100 transition-transform duration-500" />
        <img src={image} alt={title} className="h-full object-contain relative z-10" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-6">{desc}</p>
      
      <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
        GET STARTED <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
}

function DockIcon({ to, icon, active }) {
  return (
    <Link 
      to={to} 
      className={`p-3.5 rounded-2xl transition-all ${
        active 
        ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' 
        : 'text-slate-400 hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon}
    </Link>
  );
}

export default Dashboard;