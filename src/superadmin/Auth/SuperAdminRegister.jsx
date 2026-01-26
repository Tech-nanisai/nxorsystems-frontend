// frontend/src/superadmin/Auth/SuperAdminRegister.jsx
import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./SuperAdminRegister.css";

const API = "http://localhost:1981";

const SuperAdminRegister = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPwd) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API}/api/superadmin/auth/register`, {
        fullName,
        email,
        secretKey,
        password,
      });

      if (res.data.success) {
        setMessage("Super Admin created successfully. You can now login.");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="superadmin-container">
      <form className="superadmin-box" onSubmit={handleRegister}>
        <h2 className="superadmin-heading">Super Admin Registration</h2>

        <label className="superadmin-label">Full Name</label>
        <input
          className="superadmin-input"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter full name"
        />

        <label className="superadmin-label">Email</label>
        <input
          className="superadmin-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="superadmin@example.com"
        />

        <label className="superadmin-label">Secret Key</label>
        <input
          className="superadmin-input"
          type="text"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          placeholder="Enter Super Admin Secret Key"
        />

        <label className="superadmin-label">Password</label>
        <div className="superadmin-passwordWrapper">
          <input
            className="superadmin-input"
            type={showPwd ? "text" : "password"}
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="superadmin-toggleIcon" onClick={() => setShowPwd(!showPwd)}>
            {showPwd ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <label className="superadmin-label">Confirm Password</label>
        <div className="superadmin-passwordWrapper">
          <input
            className="superadmin-input"
            type={showPwd2 ? "text" : "password"}
            value={confirmPwd}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPwd(e.target.value)}
          />
          <span className="superadmin-toggleIcon" onClick={() => setShowPwd2(!showPwd2)}>
            {showPwd2 ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {message && <p className="superadmin-message">{message}</p>}

        <button className="superadmin-button" disabled={loading}>
          {loading ? "Please wait..." : "Register"}
        </button>

        <p className="superadmin-switchText">
          Already a Super Admin?{" "}
          <a href="/superadmin/login" className="superadmin-link">Login</a>
        </p>
      </form>
    </div>
  );
};

export default SuperAdminRegister;
