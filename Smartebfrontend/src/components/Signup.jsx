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
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="fatherName" placeholder="Father's Name" onChange={handleChange} required />
      <input name="dob" type="date" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <input name="address" placeholder="Address" onChange={handleChange} required />
      <input name="phoneNo" type="tel" placeholder="Phone Number" onChange={handleChange} required /> {/* Added phoneNo input */}
      <select name="role" onChange={handleChange} required>
        <option value="citizen">Citizen</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;