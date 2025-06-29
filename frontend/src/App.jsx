import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Signup from "./components/Signup";
import Login from "./components/Login";
import OTPVerify from "./components/OTPVerify";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { isAuthenticated } from "./utils/authUtils";

export default function App() {
  const [auth, setAuth] = useState(isAuthenticated());

  // Optional: Sync auth status when token changes (like in another tab)
  useEffect(() => {
    const checkAuth = () => setAuth(isAuthenticated());
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Protected Home Route */}
        <Route path="/" element={auth ? <Home /> : <Navigate to="/login" />} />

        {/* Login Route: passes setAuth to update state after login */}
        <Route path="/login" element={<Login setAuth={setAuth} />} />

        {/* Signup and OTP Verification */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<OTPVerify />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
