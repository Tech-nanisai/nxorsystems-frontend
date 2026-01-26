import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import "./ClientLogin.css";

// 1. IMPORT THE LOADER
import Loader from "../../../components/NXORLoader/Loader";

// IMPORTANT: Import the Client Context hook
import { useClientAuth } from "../../../context/ClientAuthContext";

const ClientLogin = () => {
  const { loginClient } = useClientAuth();

  const API_URL = "http://localhost:1981/api/client/auth/login";

  const [clientId, setClientId] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

  const validateClientIdFormat = (id) => /^CL\d{5}$/.test(id);

  const handleVerifyClick = (e) => {
    e.preventDefault();
    setMessage("");
    const trimmedID = clientId.trim().toUpperCase();

    if (!trimmedID) {
      setMessage("Please enter your Client ID first.");
      setMsgType("error");
      return;
    }

    if (validateClientIdFormat(trimmedID)) {
      setIsVerified(true);
      setClientId(trimmedID);
      setMessage("");
    } else {
      setIsVerified(false);
      setMessage("Invalid ID format. It should look like CL10003");
      setMsgType("error");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!isVerified) {
      setMessage("Before signing in, please verify your ID.");
      setMsgType("error");
      return;
    }

    if (!password) {
      setMessage("Please enter your password.");
      setMsgType("error");
      return;
    }

    try {
      setLoading(true); // Start showing Loader

      const res = await axios.post(API_URL, {
        clientID: clientId,
        password: password,
      });

      console.log("Backend Response:", res.data);

      const { token, user } = res.data;

      if (token && user) {
        // 2. ADD 2 SECOND DELAY HERE
        // This forces the code to pause so the user sees the branding
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Pass data to context. Context handles the navigate("/client/dashboard")
        loginClient(user, token);
      } else {
        setMessage("Login successful but user data missing.");
        setMsgType("error");
      }

    } catch (err) {
      console.error(err);
      setMsgType("error");
      setMessage(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      // Only stop loading if we are NOT successful (if successful, the redirect happens)
      // But for safety, we can set it to false here, or let the component unmount.
      // If we failed, we definitely want to stop loading to show the error.
      setLoading(false);
    }
  };

  const handleEditID = () => {
    setIsVerified(false);
    setPassword("");
    setMessage("");
  };

  return (
    <div className="clientsignin-container">
      <div className="clientsignin-card">

        {/* 3. CONDITIONAL RENDERING: SHOW LOADER OR FORM */}
        {loading ? (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px", // Maintains card height
            flexDirection: "column"
          }}>
            <Loader />
            <p style={{ marginTop: "20px", color: "#888", fontSize: "0.9rem" }}>Authenticating...</p>
          </div>
        ) : (
          <>
            <div className="clientsignin-header">
              <h2 className="clientsignin-title">Client Login</h2>
              <p className="clientsignin-subtitle">Secure access to your portal</p>
            </div>

            <form className="clientsignin-form">
              <div className="input-block">
                <label className="clientsignin-label">Client ID</label>
                <div className={`clientsignin-input-group ${isVerified ? "locked" : ""}`}>
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value.toUpperCase())}
                    placeholder="e.g. CL10003"
                    className="clientsignin-input"
                    readOnly={isVerified}
                  />
                  {!isVerified ? (
                    <button
                      className="clientsignin-verify-btn"
                      onClick={handleVerifyClick}
                    >
                      Verify
                    </button>
                  ) : (
                    <div className="verified-badge-group">
                      <FaCheckCircle className="verified-icon" />
                      <span className="edit-link" onClick={handleEditID}>Change</span>
                    </div>
                  )}
                </div>
              </div>

              {isVerified && (
                <div className="password-section fade-in-down">
                  <div className="input-block">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label className="clientsignin-label" style={{ margin: 0 }}>Password</label>
                      <Link to="/client/forgot-password" style={{ fontSize: '0.85rem', color: '#2563eb', textDecoration: 'none' }}>
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="clientsignin-input-group">
                      <input
                        type={showPwd ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="clientsignin-input"
                      />
                      <span
                        className="clientsignin-pwd-icon"
                        onClick={() => setShowPwd(!showPwd)}
                      >
                        {showPwd ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                  <button
                    className="clientsignin-login-btn"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    Sign In
                  </button>
                </div>
              )}

              {message && (
                <div className={`clientsignin-msg ${msgType}`}>
                  {message}
                </div>
              )}
            </form>

            <div className="clientsignin-footer">
              <p>Don't have an account?</p>
              <Link to="/client/register" className="register-link">Create Account</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientLogin;