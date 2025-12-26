import React from 'react';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-400 to-slate-600 flex flex-col">
      {/* Top Navigation */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 shadow-lg p-3 md:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <div className="text-white font-bold text-base md:text-lg flex items-center gap-2">
            <span className="text-xl md:text-2xl">ℹ️</span> About Us
          </div>
          <div className="text-white flex items-center gap-2 sm:gap-4">
            <span className="text-xl md:text-2xl">👤</span>
            <button
              onClick={() => navigate('/login')}
              className="bg-red-600 hover:bg-red-700 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-sm md:text-base transition-all duration-300 w-full sm:w-auto"
            >
              Logout →
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl md:rounded-2xl shadow-2xl border-2 border-teal-400 p-4 sm:p-6 md:p-8">
          <div className="space-y-4 md:space-y-6">
            {/* Title */}
            <div className="text-center border-b-2 border-teal-400 pb-4 md:pb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">⚡ SMART EB METER READER</h1>
              <p className="text-slate-600 mt-2 text-sm sm:text-base md:text-lg">Advanced Technology for Modern Energy Management</p>
            </div>

            {/* Overview */}
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-4 md:p-6 rounded-lg border-l-4 border-teal-500">
              <p className="text-slate-700 text-sm sm:text-base md:text-lg leading-relaxed">
                The <strong className="text-teal-700">Smart EB Meter Reader</strong> is a web-based mobile solution that empowers electricity consumers
                to submit their own meter readings using their device camera. Instead of relying on manual field readings by utility officials,
                users simply photograph their energy meter, and our advanced OCR (Optical Character Recognition) technology automatically extracts
                the reading. This approach eliminates manual data entry errors, reduces the workload on EB officials, ensures on-time submissions,
                and provides transparent, accurate billing.
              </p>
            </div>

            {/* Key Features */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 md:mb-4 flex items-center gap-2">
                <span className="text-xl md:text-2xl">✨</span> Key Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 md:p-4 rounded-lg border-2 border-green-300 hover:shadow-md hover:-translate-y-0.5 transition">
                  <p className="font-bold text-green-700 text-sm md:text-base">� Photo-Based Reading Capture:</p>
                  <p className="text-slate-600 text-xs md:text-sm mt-1">Users scan their meter dial using the device camera for quick, on-site submission.</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 md:p-4 rounded-lg border-2 border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition">
                  <p className="font-bold text-blue-700 text-sm md:text-base">🤖 OCR Technology:</p>
                  <p className="text-slate-600 text-xs md:text-sm mt-1">Automatic number extraction from meter photos using AI-powered optical character recognition.</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-3 md:p-4 rounded-lg border-2 border-yellow-300 hover:shadow-md hover:-translate-y-0.5 transition">
                  <p className="font-bold text-yellow-700 text-sm md:text-base">💯 Accurate Billing:</p>
                  <p className="text-slate-600 text-xs md:text-sm mt-1">Automated bill calculation based on OCR-extracted readings, eliminating manual transcription errors.</p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-3 md:p-4 rounded-lg border-2 border-pink-300 hover:shadow-md hover:-translate-y-0.5 transition">
                  <p className="font-bold text-pink-700 text-sm md:text-base">💳 Digital Payments:</p>
                  <p className="text-slate-600 text-xs md:text-sm mt-1">Seamless online bill payment portal with instant confirmations and e-receipts.</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-3 md:p-4 rounded-lg border-2 border-purple-300 hover:shadow-md hover:-translate-y-0.5 transition">
                  <p className="font-bold text-purple-700 text-sm md:text-base">📊 Consumption Tracking:</p>
                  <p className="text-slate-600 text-xs md:text-sm mt-1">View billing history, previous readings, and consumption trends in one place.</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-3 md:p-4 rounded-lg border-2 border-orange-300 hover:shadow-md hover:-translate-y-0.5 transition">
                  <p className="font-bold text-orange-700 text-sm md:text-base">🔐 Secure & Transparent:</p>
                  <p className="text-slate-600 text-xs md:text-sm mt-1">Secure user authentication and transparent billing with timestamp verification.</p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 md:p-6 rounded-lg border-2 border-slate-300">
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 md:mb-3 flex items-center gap-2">
                <span className="text-xl md:text-2xl">⚙️</span> How It Works
              </h3>
              <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
                Users open the Smart EB Meter Reader web application and navigate to "Scan Readings." They enter their consumer number,
                and the system retrieves their account details including the previous month's reading and tariff. Using their device camera,
                users capture a clear photo of their meter dial. The OCR engine instantly recognizes the numerical display, extracts the
                current reading, and automatically calculates the bill amount. Users can edit the reading if needed, then submit it. The reading
                is saved securely, and users can instantly pay their bill or download an e-receipt. EB officials gain instant visibility into
                submitted readings instead of scheduling manual field visits.
              </p>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 md:mb-4 flex items-center gap-2">
                <span className="text-xl md:text-2xl">🎯</span> Benefits
              </h2>
              <ul className="space-y-2 md:space-y-3">
                <li className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <span className="text-green-600 font-bold text-lg md:text-xl">✓</span>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm md:text-base">User Convenience</p>
                    <p className="text-slate-600 text-xs md:text-sm">Submit readings anytime, anywhere using a smartphone; no need to wait for officials.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <span className="text-blue-600 font-bold text-lg md:text-xl">✓</span>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm md:text-base">Reduced Official Workload</p>
                    <p className="text-slate-600 text-xs md:text-sm">EB officials spend less time on field visits and manual data entry; focus on customer service instead.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <span className="text-green-600 font-bold text-lg md:text-xl">✓</span>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm md:text-base">Eco-Friendly</p>
                    <p className="text-slate-600 text-xs md:text-sm">Paperless submissions and digital receipts reduce environmental impact.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <span className="text-purple-600 font-bold text-lg md:text-xl">✓</span>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm md:text-base">Fewer Billing Errors</p>
                    <p className="text-slate-600 text-xs md:text-sm">OCR automation eliminates human transcription mistakes and ensures fair, accurate billing.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <span className="text-orange-600 font-bold text-lg md:text-xl">✓</span>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm md:text-base">Instant Bill Availability</p>
                    <p className="text-slate-600 text-xs md:text-sm">Readings are processed immediately; users can pay and get e-receipts instantly without delays.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Future Scope */}
            <div className="bg-gradient-to-r from-teal-100 to-emerald-100 p-4 md:p-6 rounded-lg border-2 border-teal-400">
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 md:mb-3 flex items-center gap-2">
                <span className="text-xl md:text-2xl">🚀</span> Future Scope
              </h3>
              <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
                The Smart EB Meter Reader roadmap includes advanced OCR models for faster and more diverse meter types, multi-language support
                for broader accessibility, AI-powered consumption analytics to help users identify peak usage patterns, automated bill notifications,
                and integration with payment systems for one-click billing. We also envision support for commercial and industrial meters, admin
                dashboards for real-time revenue tracking, and eventual mobile app availability for iOS and Android. Our goal is to make meter
                reading a seamless, error-free process that benefits both consumers and utility providers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white text-center py-3 md:py-4 border-t-2 border-slate-700">
        <p className="text-xs md:text-sm px-2">&copy; 2025 scanReadings Inc. All rights reserved.</p>
        <div className="text-xs mt-1 md:mt-2 px-2">
          <a href="/privacy-policy" className="hover:text-teal-400">Privacy Policy</a> | <a href="/terms-of-service" className="hover:text-teal-400">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}

export default About;
