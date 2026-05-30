// frontend/src/client/Auth/ClientForgetPassword/ClientForgetPassword.jsx

import React, { useState } from "react";
import axios from "axios";
import { FaSpinner, FaLock, FaKey, FaShieldAlt, FaUserShield, FaFingerprint, FaUnlockAlt } from "react-icons/fa";
import "./ClientForgetPassword.css";

const ClientForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (!email) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://nxorsystems-backend-xglw.onrender.com/api/client/auth/forgot-password", {
        email,
      });

      if (response.data.success) {
        setMessage("Email sent successfully! Please wait and refresh your email inbox after 5 minutes.");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ClientForgetPassword-container">
      {/* Background Floating Icons */}
      <FaLock className="bg-icon icon-lock" />
      {/* <FaKey className="bg-icon icon-key" /> Removed */}
      <FaShieldAlt className="bg-icon icon-shield" />
      <FaFingerprint className="bg-icon icon-fingerprint" />
      <FaUserShield className="bg-icon icon-user-shield" />
      <FaUnlockAlt className="bg-icon icon-unlock" />
      {/* Forgot Password Box */}
      <div className="ClientForgetPassword-box">
        <h2 className="ClientForgetPassword-title">Forgot Password</h2>
        <p className="ClientForgetPassword-subtitle">Enter your registered email to reset your password.</p>

        {/* Success & Error Messages */}
        {message && <p className="ClientForgetPassword-success">{message}</p>}
        {error && <p className="ClientForgetPassword-error">{error}</p>}

        {/* Form Section */}
        <form className="ClientForgetPassword-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="ClientForgetPassword-input"
          />
          <button type="submit" className="ClientForgetPassword-btn" disabled={loading}>
            {loading ? <FaSpinner className="ClientForgetPassword-spinner" /> : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login Link */}
        <a href="/client/signIn" className="ClientForgetPassword-link">
          Back to Login
        </a>
      </div>
    </div>
  );
};

export default ClientForgetPassword;

