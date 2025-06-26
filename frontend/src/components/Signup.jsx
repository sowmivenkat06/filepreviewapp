import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/auth/signup', { email, password });
      alert('OTP sent to email');
      navigate('/verify', { state: { email } });
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSignup}>
      <h2>Signup</h2>
      <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Send OTP</button>
    </form>
  );
}
