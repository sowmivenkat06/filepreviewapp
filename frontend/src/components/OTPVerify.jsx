import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api/api';

export default function OTPVerify() {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/auth/verify', { email, otp });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      alert('OTP verification failed');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleVerify}>
      <h2>Enter OTP</h2>
      <input type="text" placeholder="Enter 6-digit OTP" required value={otp} onChange={(e) => setOtp(e.target.value)} />
      <button type="submit">Verify</button>
    </form>
  );
}
