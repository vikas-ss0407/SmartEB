import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Gauge, 
  Calendar, 
  Hash, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

function AddReading() {
  const navigate = useNavigate();
  const [reading, setReading] = useState({
    consumerNumber: '',
    meterReading: '',
    readingDate: new Date().toISOString().split('T')[0],
  });

  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setReading({ ...reading, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    if (isNaN(reading.meterReading) || reading.meterReading <= 0) {
      setStatus({ type: 'error', msg: 'Please enter a valid meter reading above 0.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.put(
        `http://localhost:5000/api/consumers/add-reading/${reading.consumerNumber}`, 
        {
          unitsConsumed: Number(reading.meterReading),
          readingDate: reading.readingDate,
        }
      );
      setStatus({ type: 'success', msg: `Reading for ${reading.consumerNumber} recorded successfully!` });
      setReading(prev => ({ ...prev, meterReading: '' }));
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to update reading. Verify Consumer ID.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col items-center justify-center p-6">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-12 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors self-start max-w-lg mx-auto w-full"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      {/* Main Card - Removed overflow-hidden to let icon pop out */}
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 relative">
        
        {/* Floating Icon Container - Absolute positioned outside the box */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-teal-500 w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-teal-500/40 border-4 border-white">
            <Gauge size={38} strokeWidth={2.5} />
          </div>
        </div>

        {/* Header Section - Internal overflow hidden for rounded top */}
        <div className="bg-slate-900 pt-16 pb-8 px-8 text-center rounded-t-[2.5rem] overflow-hidden">
          <h2 className="text-2xl font-black text-white tracking-tight">GridVision Intake</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Telemetry Intake & Meter Logging</p>
        </div>

        {/* Form Body */}
        <div className="p-8 md:p-10">
          {/* Status Message */}
          {status.msg && (
            <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border animate-in slide-in-from-top-2 duration-300 ${
              status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
            }`}>
              {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {status.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Consumer Number */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identify Consumer</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  name="consumerNumber"
                  placeholder="e.g. GV-992031"
                  value={reading.consumerNumber}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500/20 focus:bg-white transition-all text-slate-800 font-bold outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Reading Value */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current kWh</label>
                <div className="relative">
                  <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="number"
                    name="meterReading"
                    placeholder="0.00"
                    value={reading.meterReading}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500/20 focus:bg-white transition-all text-slate-800 font-bold outline-none"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Logging Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="date"
                    name="readingDate"
                    value={reading.readingDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500/20 focus:bg-white transition-all text-slate-800 font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.98] ${
                isSubmitting 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/30'
              }`}
            >
              {isSubmitting ? 'Synchronizing...' : 'Submit Log Entry'}
            </button>
          </form>
        </div>
      </div>

      <p className="mt-12 text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
        Secured GridVision Telemetry Link
      </p>
    </div>
  );
}

export default AddReading;