// frontend/src/components/Signup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/signup', { email, password });
      alert(response.data.message || 'OTP sent to your email');
      navigate('/verify', { state: { email } });
    } catch (err) {
      console.error('❌ Signup error:', err);
      const errorMessage =
        err.response?.data?.message || 'Signup failed. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSignup}>
      <h2>Signup</h2>
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
        {loading ? 'Sending OTP...' : 'Send OTP'}
      </button>
    </form>
  );
}
