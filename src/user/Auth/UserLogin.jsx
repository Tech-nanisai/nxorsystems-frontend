// frontend/src/user/Auth/UserLogin.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheckCircle, FaUser } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import CompanyLogoDark from "../../assets/logos/nxor-logo-dark.png";
import { API_BASE_URL } from "../../config";
import "./UserLogin.css";
import { useAuth } from "../../context/AuthContext";


// Import custom loader if present, or fallback to simple premium spinner
import Loader from "../../components/NXORLoader/Loader";

const UserLogin = () => {
  const navigate = useNavigate();
  const { loginGeneralUser, logout } = useAuth();


  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeSession, setActiveSession] = useState(null);

  // -> CHECK IF ALREADY LOGGED IN ON MOUNT
  useEffect(() => {
    const token = Cookies.get("user_auth_token");
    const savedUser = sessionStorage.getItem("active_user");
    if (token && savedUser) {
      try {
        setActiveSession(JSON.parse(savedUser));
      } catch (e) {
        setActiveSession({ fullName: "Active User" });
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!phone || !password) {
      setErrorMessage("Please enter your mobile number or email and password.");
      return;
    }

    // Validation (allow standard 10-digit mobile number or email address)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const isEmail = emailRegex.test(phone.trim());
    const isPhone = phoneRegex.test(phone.trim());

    if (!isEmail && !isPhone) {
      setErrorMessage("Please enter a valid email or 10-digit mobile number.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/user/auth/login`,
        { phone: phone.trim(), password }
      );

      if (res.data?.success && res.data?.token) {
        setSuccess(true);

        // Store JWT in cookie
        Cookies.set("user_auth_token", res.data.token, {
          expires: 7,
          secure: false,
          sameSite: "Lax",
        });

        // Store user info in session
        sessionStorage.setItem("active_user", JSON.stringify(res.data.user));
        sessionStorage.setItem("USER_ROLE", "user");

        // Simulate short luxury pause for loader feedback
        setTimeout(() => {
          loginGeneralUser(res.data.user, res.data.token);
        }, 1500);
      } else {
        setErrorMessage(res.data?.message || "Invalid phone number or password.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      const msg = error.response?.data?.message || "Invalid credentials or Server Error.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setActiveSession(null);
    setPhone("");
    setPassword("");
    setErrorMessage("");
  };

  return (
    <div className="UserLogin-page-container page-fade-in">
      {/* Visual background glow orbs */}
      <div className="UserLogin-orb UserLogin-orb-purple"></div>
      <div className="UserLogin-orb UserLogin-orb-blue"></div>

      <div className="UserLogin-card">
        {/* Header with Logo */}
        <div className="UserLogin-header">
          <div className="UserLogin-logo-wrapper">
            <img src={CompanyLogoDark} alt="NXOR Systems" className="UserLogin-logo-img" />
            <span className="UserLogin-logo-sub">SYSTEMS</span>
          </div>
          <h2 className="UserLogin-title">User Login</h2>
          <p className="UserLogin-subtitle">Secure Access to NXOR Customer Portal</p>
        </div>

        {isLoading ? (
          <div className="UserLogin-loader-wrapper">
            {Loader ? <Loader /> : <div className="UserLogin-spinner"></div>}
            <p className="UserLogin-loader-text">Authenticating securely...</p>
          </div>
        ) : activeSession ? (
          /* Active Session View */
          <div className="UserLogin-session-view fade-in-down">
            <div className="UserLogin-session-icon-box">
              <FaCheckCircle className="UserLogin-session-success-icon" />
            </div>
            <h3 className="UserLogin-session-title">Already Signed In</h3>
            <p className="UserLogin-session-desc">
              You are currently logged in as <br />
              <strong>{activeSession.fullName}</strong> ({activeSession.phone})
            </p>
            <div className="UserLogin-session-actions">
              <button
                className="UserLogin-btn-primary"
                onClick={() => navigate("/user")}
              >
                Go to Dashboard
              </button>
              <button
                className="UserLogin-btn-secondary"
                onClick={handleLogout}
              >
                Sign Out / Switch Account
              </button>
            </div>
          </div>
        ) : (
          /* Sign In Form View */
          <form className="UserLogin-form" onSubmit={handleLogin}>
            <div className="UserLogin-input-group">
              <label className="UserLogin-input-label">Mobile Number / Email Address</label>
              <input
                type="text"
                placeholder="Enter 10-digit mobile number or email"
                className="UserLogin-input-box"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrorMessage("");
                }}
                required
              />
            </div>

            <div className="UserLogin-input-group">
              <div className="UserLogin-label-row">
                <label className="UserLogin-input-label">Password</label>
                <Link to="/user/forgot-password" className="UserLogin-link-forgot">
                  Forgot Password?
                </Link>
              </div>
              <div className="UserLogin-password-box-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter secure password"
                  className="UserLogin-input-box password-input"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage("");
                  }}
                  required
                />
                <span
                  className="UserLogin-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {errorMessage && <p className="UserLogin-error-message">{errorMessage}</p>}
            {success && <p className="UserLogin-success-message">Login Successful! Redirecting...</p>}

            <button type="submit" className="UserLogin-btn-primary" disabled={isLoading}>
              Sign In
            </button>

            <div className="UserLogin-footer">
              <span>New customer?</span>
              <Link to="/user/register" className="UserLogin-link-signup">
                Register Newly / Sign Up
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserLogin;
