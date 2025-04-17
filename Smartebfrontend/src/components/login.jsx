import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import '../styles/login.css';

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
        navigate('/admin-dashboard'); // Redirect to the correct admin route
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
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Login</button>
        <button type="button" onClick={goToSignup}>Create Account</button>
      </form>
    </div>
  );
}

export default Login;
