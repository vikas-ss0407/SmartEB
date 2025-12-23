import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      const user = res.data.user;
      const role = user.role;

      // Save to localStorage
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userRole', role);

      // Set parent user state
      onLoginSuccess({ name: user.name, role: role, id: user.id });

      // Navigate based on role
      if (role === 'citizen') {
        navigate('/dashboard');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        alert('Invalid role');
      }
    } catch (err) {
      alert('Login failed. Please check credentials.');
    }
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-300 to-slate-500 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold italic text-black drop-shadow-lg mb-6 md:mb-10 text-center px-4">SMART EB METER READER</h1>
      <div className="w-full max-w-sm">
        <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl shadow-2xl border-2 border-teal-400 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold italic text-white mb-6 md:mb-8 text-center">LOGIN</h2>
          <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-white font-semibold mb-2 text-sm md:text-base">EMAIL:</label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 focus:bg-white focus:border-2 focus:border-teal-400 outline-none transition-all duration-300 text-base md:text-lg"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-white font-semibold mb-2 text-sm md:text-base">PASSWORD:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 focus:bg-white focus:border-2 focus:border-teal-400 outline-none transition-all duration-300 text-base md:text-lg"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-3 md:pt-4">
              <button
                type="button"
                className="flex-1 bg-gradient-to-r from-slate-800 to-black text-white font-bold py-2.5 md:py-3 px-4 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm md:text-base"
                onClick={goToSignup}
              >
                SIGNUP
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-2.5 md:py-3 px-4 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm md:text-base"
              >
                LOGIN
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
