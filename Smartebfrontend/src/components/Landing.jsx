import React from 'react';
import { useNavigate } from 'react-router-dom';
import manImage from '../assets/man.png';
import quickPayImage from '../assets/Cash-Drawing.png';
import eReceiptImage from '../assets/MONEY.png';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-300 via-slate-500 to-slate-700 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-slate-800 to-slate-900/95 backdrop-blur shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white">
            <span className="text-2xl md:text-3xl">⚡</span>
            <h1 className="text-xl md:text-2xl font-bold tracking-wide">Smart EB Meter Reader</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => navigate('/about')} className="text-white/90 hover:text-teal-300 font-semibold px-3 py-2">About</button>
            <button onClick={() => navigate('/login')} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-lg">Login</button>
            <button onClick={() => navigate('/signup')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg">Sign Up</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-14">
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl border-2 border-teal-400 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-6 sm:p-8 md:p-12">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-emerald-600 to-amber-600">Scan. Extract. Pay.</span>
                </h2>
                <p className="mt-4 md:mt-6 text-slate-700 text-base md:text-lg">
                  A professional, error-free way to submit your meter readings. Take a photo, let OCR do the work, get instant billing and payment—all in one elegant web app.
                </p>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <li className="flex items-center gap-2 text-slate-700"><span className="text-teal-600">✓</span> Photo-based OCR extraction</li>
                  <li className="flex items-center gap-2 text-slate-700"><span className="text-teal-600">✓</span> Automated, transparent billing</li>
                  <li className="flex items-center gap-2 text-slate-700"><span className="text-teal-600">✓</span> Instant Quick Pay + e-receipts</li>
                  <li className="flex items-center gap-2 text-slate-700"><span className="text-teal-600">✓</span> Mobile-first, secure experience</li>
                </ul>
                <div className="mt-6 md:mt-8 flex flex-wrap gap-3">
                  <button onClick={() => navigate('/scanread')} className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-3 rounded-lg shadow">
                    Start Scanning
                  </button>
                  <button onClick={() => navigate('/quickpage')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-lg shadow">
                    Quick Pay
                  </button>
                  <button onClick={() => navigate('/ereciept')} className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-3 rounded-lg shadow">
                    View E-Receipt
                  </button>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-3">
                    <p className="text-slate-700 text-sm md:text-base font-semibold">Photo-based OCR</p>
                    <p className="text-slate-500 text-xs md:text-sm">Reads your meter digits from photos—fast and accurate.</p>
                  </div>
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-3">
                    <p className="text-slate-700 text-sm md:text-base font-semibold">Error-free Billing</p>
                    <p className="text-slate-500 text-xs md:text-sm">Automated calculation eliminates manual entry mistakes.</p>
                  </div>
                </div>
              </div>
              <div className="relative bg-gradient-to-br from-slate-800 to-black p-8 md:p-12">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_40%),_radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.2),transparent_40%)]" />
                <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                    <img src={manImage} alt="Scan Readings" className="w-full h-28 md:h-36 object-contain" />
                    <p className="mt-3 text-white font-semibold">Scan Readings</p>
                    <p className="text-white/70 text-xs">Use your camera to capture and submit readings.</p>
                  </div>
                  <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                    <img src={quickPayImage} alt="Quick Pay" className="w-full h-28 md:h-36 object-contain" />
                    <p className="mt-3 text-white font-semibold">Quick Pay</p>
                    <p className="text-white/70 text-xs">Pay bills instantly with a few taps.</p>
                  </div>
                  <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                    <img src={eReceiptImage} alt="E-Receipt" className="w-full h-28 md:h-36 object-contain" />
                    <p className="mt-3 text-white font-semibold">E-Receipt</p>
                    <p className="text-white/70 text-xs">View and download your receipts anytime.</p>
                  </div>
                  <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                    <div className="h-28 md:h-36 flex items-center justify-center text-4xl">🔐</div>
                    <p className="mt-3 text-white font-semibold">Secure & Transparent</p>
                    <p className="text-white/70 text-xs">Your data is protected and verifiable.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 text-center">How It Works</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-xl p-5">
              <p className="text-slate-800 font-bold">1. Scan Meter</p>
              <p className="text-slate-600 text-sm">Open Scan Readings and capture a photo of your meter dial.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5">
              <p className="text-slate-800 font-bold">2. Extract Reading</p>
              <p className="text-slate-600 text-sm">OCR extracts the digits and calculates your bill automatically.</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-5">
              <p className="text-slate-800 font-bold">3. Submit & Pay</p>
              <p className="text-slate-600 text-sm">Submit your reading securely and pay immediately with Quick Pay.</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <button onClick={() => navigate('/signup')} className="bg-slate-900 hover:bg-black text-white font-bold px-6 py-3 rounded-lg">Get Started</button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-slate-800 via-slate-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-teal-400">10k+</p>
              <p className="text-white/80 text-sm md:text-base mt-1">Readings Submitted</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-emerald-400">98%</p>
              <p className="text-white/80 text-sm md:text-base mt-1">Error Reduction</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-amber-400"><span className="align-middle">⚡</span> Instant</p>
              <p className="text-white/80 text-sm md:text-base mt-1">Billing & Receipts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 text-center">Trusted by Consumers</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="rounded-xl border-2 border-slate-200 p-6 bg-gradient-to-br from-slate-50 to-white">
              <p className="text-slate-700 text-sm md:text-base">“Submitting readings is finally easy. The OCR is spot on and payments are instant.”</p>
              <p className="mt-3 text-slate-500 text-xs">— Priya, Chennai</p>
            </div>
            <div className="rounded-xl border-2 border-slate-200 p-6 bg-gradient-to-br from-slate-50 to-white">
              <p className="text-slate-700 text-sm md:text-base">“No more waiting for meter reading day. I upload from home and get my receipt.”</p>
              <p className="mt-3 text-slate-500 text-xs">— Arjun, Coimbatore</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-teal-700 via-emerald-700 to-amber-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 text-center">
          <h4 className="text-2xl md:text-3xl font-extrabold text-white">Ready to modernize your meter reading?</h4>
          <p className="mt-2 text-white/90">Join thousands of consumers who scan, submit, and pay in minutes.</p>
          <div className="mt-5 flex justify-center gap-3">
            <button onClick={() => navigate('/signup')} className="bg-white text-slate-900 font-bold px-6 py-3 rounded-lg hover:bg-slate-200">Create Account</button>
            <button onClick={() => navigate('/login')} className="bg-slate-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-black">Login</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white text-center py-4 border-t border-slate-700">
        <p className="text-xs md:text-sm">© 2025 Smart EB Meter Reader. All rights reserved.</p>
        <div className="text-xs mt-1">
          <button onClick={() => navigate('/about')} className="hover:text-teal-400">About</button>
          <span className="mx-2">|</span>
          <button onClick={() => navigate('/login')} className="hover:text-teal-400">Login</button>
        </div>
      </footer>
    </div>
  );
}

export default Landing;