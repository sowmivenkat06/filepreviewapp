import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { email, password });

      // ✅ Save token in localStorage
      localStorage.setItem('token', res.data.token);
      alert('Login successful');

      // ✅ Navigate to home page
      navigate('/home');
    } catch (err) {
      console.error('❌ Login failed:', err);
      const message =
        err.response?.data?.message || 'Invalid credentials. Please try again.';
      alert(message);
    } finally {
      setLoading(false);
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
    </form>
  );
}
