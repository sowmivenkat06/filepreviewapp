// src/components/OTPVerify.jsx

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api/api';

function OTPVerify() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const emailFromState = location.state?.email;
    const savedEmail = localStorage.getItem('signupEmail');

    if (emailFromState) {
      setEmail(emailFromState);
      localStorage.setItem('signupEmail', emailFromState);
    } else if (savedEmail) {
      setEmail(savedEmail);
    } else {
      alert('Email not found. Please sign up again.');
      navigate('/signup');
    }
  }, [location, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/auth/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.removeItem('signupEmail');
      navigate('/login'); // ✅ redirect to login after verifying OTP
    } catch (err) {
      alert(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleVerify}>
      <h2>Enter OTP</h2>
      <input
        type="text"
        placeholder="Enter 6-digit OTP"
        required
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button type="submit">Verify</button>
    </form>
  );
}

export default OTPVerify; // ✅ make sure this line is present
