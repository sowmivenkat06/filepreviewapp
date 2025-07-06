import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/api';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode } from 'jwt-decode'; // ✅ default import

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Email/Password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      alert('Login successful');
      navigate('/home');
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid credentials';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { email, name, picture } = decoded;

      const res = await apiClient.post('/auth/google', { email, name, picture });
      localStorage.setItem('token', res.data.token);
      alert('Google login successful');
      navigate('/home');
    } catch (err) {
      console.error('Google Login Error:', err);
      alert('Google Login Failed');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <div style={{ marginTop: '1rem' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => alert('Google Login Failed')}
        />
      </div>
      

      <div style={{ marginTop: '1rem' }}>
        <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>      </div>
    </form>
  );
}
