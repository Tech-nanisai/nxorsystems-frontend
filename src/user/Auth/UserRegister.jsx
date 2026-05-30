// frontend/src/user/Auth/UserRegister.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaUser, FaEnvelope, FaPhone, FaLock, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import CompanyLogoDark from "../../assets/logos/nxor-logo-dark.png";
import { API_BASE_URL } from "../../config";
import "./UserRegister.css";

// Import custom loader if present
import Loader from "../../components/NXORLoader/Loader";

const UserRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Password requirements state
  const [pwdMetrics, setPwdMetrics] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  // Track session
  useEffect(() => {
    const token = Cookies.get("user_auth_token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let sanitizedValue = value;
    if (name === "phone") {
      sanitizedValue = value.replace(/[^0-9]/g, ""); // Keep only numbers
    }

    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    setErrorMessage("");

    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (pwd) => {
    setPwdMetrics({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[@$!%*?&]/.test(pwd),
    });
  };

  const validateForm = () => {
    const nameRegex = /^[A-Za-z ]{3,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!nameRegex.test(formData.fullName)) {
      setErrorMessage("Full Name must contain only letters and spaces (min 3 chars).");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return false;
    }
    
    // Check all password criteria
    const isPwdValid = pwdMetrics.length && pwdMetrics.uppercase && pwdMetrics.number && pwdMetrics.special;
    if (!isPwdValid) {
      setErrorMessage("Password does not meet all security guidelines.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/user/auth/register`,
        {
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          password: formData.password,
        }
      );

      if (res.data?.success) {
        setSuccessMessage("Account created successfully! Redirecting to Sign In...");
        
        setTimeout(() => {
          navigate("/user/signIn");
        }, 2000);
      } else {
        setErrorMessage(res.data?.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Register Error:", error);
      const msg = error.response?.data?.message || "Registration failed. Please check details and try again.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="UserRegister-page-container page-fade-in">
      <div className="UserRegister-orb UserRegister-orb-pink"></div>
      <div className="UserRegister-orb UserRegister-orb-blue"></div>

      <div className="UserRegister-card">
        {/* Back navigation */}
        <Link to="/user/signIn" className="UserRegister-back-btn">
          <FaArrowLeft /> Back to Login
        </Link>

        {/* Header */}
        <div className="UserRegister-header">
          <div className="UserRegister-logo-wrapper">
            <img src={CompanyLogoDark} alt="NXOR Systems" className="UserRegister-logo-img" />
            <span className="UserRegister-logo-sub">SYSTEMS</span>
          </div>
          <h2 className="UserRegister-title">Create Account</h2>
          <p className="UserRegister-subtitle">Register for Entertainment Reels & Creative Designs</p>
        </div>

        {isLoading ? (
          <div className="UserRegister-loader-wrapper">
            {Loader ? <Loader /> : <div className="UserRegister-spinner"></div>}
            <p className="UserRegister-loader-text">Creating secure customer profile...</p>
          </div>
        ) : (
          <form className="UserRegister-form" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="UserRegister-input-group">
              <label className="UserRegister-input-label">Full Name</label>
              <div className="UserRegister-input-wrapper">
                <FaUser className="UserRegister-field-icon" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Alex Carter"
                  className="UserRegister-input-box"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="UserRegister-input-group">
              <label className="UserRegister-input-label">Email Address</label>
              <div className="UserRegister-input-wrapper">
                <FaEnvelope className="UserRegister-field-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. alex@nxorsystems.com"
                  className="UserRegister-input-box"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="UserRegister-input-group">
              <label className="UserRegister-input-label">Phone Number</label>
              <div className="UserRegister-input-wrapper">
                <FaPhone className="UserRegister-field-icon" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit mobile number"
                  className="UserRegister-input-box"
                  value={formData.phone}
                  onChange={handleInputChange}
                  maxLength={10}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="UserRegister-input-group">
              <label className="UserRegister-input-label">Set Password</label>
              <div className="UserRegister-input-wrapper">
                <FaLock className="UserRegister-field-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  className="UserRegister-input-box password-input"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <span
                  className="UserRegister-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Password strength checklist */}
            <div className="UserRegister-pwd-checklist">
              <p className="checklist-title">Password must include:</p>
              <div className="checklist-grid">
                <div className={`checklist-item ${pwdMetrics.length ? "valid" : ""}`}>
                  {pwdMetrics.length ? <FaCheck /> : <FaTimes />}
                  <span>8+ characters</span>
                </div>
                <div className={`checklist-item ${pwdMetrics.uppercase ? "valid" : ""}`}>
                  {pwdMetrics.uppercase ? <FaCheck /> : <FaTimes />}
                  <span>1 uppercase letter</span>
                </div>
                <div className={`checklist-item ${pwdMetrics.number ? "valid" : ""}`}>
                  {pwdMetrics.number ? <FaCheck /> : <FaTimes />}
                  <span>1 number</span>
                </div>
                <div className={`checklist-item ${pwdMetrics.special ? "valid" : ""}`}>
                  {pwdMetrics.special ? <FaCheck /> : <FaTimes />}
                  <span>1 special symbol (@$!%*?&)</span>
                </div>
              </div>
            </div>

            {errorMessage && <p className="UserRegister-error-message">{errorMessage}</p>}
            {successMessage && <p className="UserRegister-success-message">{successMessage}</p>}

            <button type="submit" className="UserRegister-btn-primary" disabled={isLoading}>
              Register Account
            </button>

            <div className="UserRegister-footer">
              <span>Already registered?</span>
              <Link to="/user/signIn" className="UserRegister-link-signin">
                Sign In Instead
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserRegister;
