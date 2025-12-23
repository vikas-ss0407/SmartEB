import React, { useState } from 'react';
import { signup } from '../api/authApi';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    dob: '',
    email: '',
    password: '',
    address: '',
    phoneNo: '', // Added phoneNo field
    role: 'citizen'
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await signup(formData);
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-300 to-slate-500 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold italic text-black drop-shadow-lg mb-6 md:mb-10 text-center px-4">Create Your Account</h1>
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl shadow-2xl border-2 border-teal-400 p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <h2 className="text-xl md:text-2xl font-bold italic text-white mb-2 md:mb-4 text-center col-span-1 md:col-span-2">SIGNUP</h2>

          <div className="flex flex-col">
            <label className="text-white font-semibold mb-2 text-sm md:text-base">Name</label>
            <input name="name" placeholder="Name" onChange={handleChange} required className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 focus:bg-white focus:border-2 focus:border-teal-400 outline-none transition-all duration-300 text-base" />
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold mb-2 text-sm md:text-base">Father's Name</label>
            <input name="fatherName" placeholder="Father's Name" onChange={handleChange} required className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 focus:bg-white focus:border-2 focus:border-teal-400 outline-none transition-all duration-300 text-base" />
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold mb-2 text-sm md:text-base">Date of Birth</label>
            <input name="dob" type="date" onChange={handleChange} required className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 focus:bg-white focus:border-2 focus:border-teal-400 outline-none transition-all duration-300 text-base" />
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold mb-2 text-sm md:text-base">Email</label>
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 focus:bg-white focus:border-2 focus:border-teal-400 outline-none transition-all duration-300 text-base" />
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold mb-2 text-sm md:text-base">Password</label>
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 focus:bg-white focus:border-2 focus:border-teal-400 outline-none transition-all duration-300 text-base" />
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold mb-2 text-sm md:text-base">Address</label>
            <input name="address" placeholder="Address" onChange={handleChange} required className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 focus:bg-white focus:border-2 focus:border-teal-400 outline-none transition-all duration-300 text-base" />
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold mb-2 text-sm md:text-base">Phone Number</label>
            <input name="phoneNo" type="tel" placeholder="Phone Number" onChange={handleChange} required className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 focus:bg-white focus:border-2 focus:border-teal-400 outline-none transition-all duration-300 text-base" />
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold mb-2 text-sm md:text-base">Role</label>
            <select name="role" onChange={handleChange} required className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 focus:bg-white focus:border-2 focus:border-teal-400 outline-none transition-all duration-300 text-base">
              <option value="citizen">Citizen</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-2 pt-2">
            <button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-base md:text-lg">
              SIGNUP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;