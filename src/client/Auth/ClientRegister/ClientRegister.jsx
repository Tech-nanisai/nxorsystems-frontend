import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Use navigate for better UX
import "./ClientRegister.css";

// Simple Green Tick Icon Component
const GreenTick = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="input-icon-success"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 6L9 17L4 12"
      stroke="#22c55e"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ClientRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    clientID: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user types
    if (error) setError("");
  };

  const verifyID = async () => {
    if (!form.clientID || !form.fullName) {
      setError("Please enter both Client ID and Full Name");
      return;
    }

    setError("");
    setVerifying(true);

    try {
      // Using direct URL as requested to bypass proxy issues
      const res = await axios.post("http://localhost:1981/api/client/auth/verify", {
        clientID: form.clientID,
        fullName: form.fullName,
      });

      if (res.data.valid) {
        setVerified(true);
      }
    } catch (err) {
      setVerified(false);
      setError(err.response?.data?.message || "Verification failed. Check details.");
    } finally {
      setVerifying(false);
    }
  };

  const submit = async () => {
    // 1. Validate Passwords
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // 2. Validate Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // 3. Validate Phone (Simple 10-digit check)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      await axios.post("http://localhost:1981/api/client/auth/register", form);
      // Redirect using React Router
      navigate("/client/signIn");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="ClientRegister-container">
      <div className="ClientRegister-card">
        <h2 className="ClientRegister-title">Client Registration</h2>

        {error && <p className="ClientRegister-error">{error}</p>}

        {/* --- CLIENT ID (LOCKED IF VERIFIED) --- */}
        <div className="ClientRegister-field">
          <label className="ClientRegister-label">Client ID</label>
          <div className="input-wrapper">
            <input
              className={`ClientRegister-input ${verified ? "input-locked" : ""}`}
              name="clientID"
              value={form.clientID}
              onChange={handleChange}
              placeholder="e.g. CL10003"
              disabled={verified} // Disable editing
              readOnly={verified}
            />
            {verified && <GreenTick />}
          </div>
        </div>

        {/* --- FULL NAME (LOCKED IF VERIFIED) --- */}
        <div className="ClientRegister-field">
          <label className="ClientRegister-label">Full Name</label>
          <div className="input-wrapper">
            <input
              className={`ClientRegister-input ${verified ? "input-locked" : ""}`}
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="As per records"
              disabled={verified} // Disable editing
              readOnly={verified}
            />
            {verified && <GreenTick />}
          </div>
        </div>

        {/* --- VERIFY BUTTON (HIDDEN IF VERIFIED) --- */}
        {!verified && (
          <button
            className="ClientRegister-verifyBtn"
            disabled={!form.clientID || !form.fullName || verifying}
            onClick={verifyID}
          >
            {verifying ? "Verifying..." : "Verify ID"}
          </button>
        )}

        {/* --- REGISTRATION FORM (SHOWN IF VERIFIED) --- */}
        {verified && (
          <div className="ClientRegister-verifiedSection">
            
            {/* Email */}
            <div className="ClientRegister-field">
              <label className="ClientRegister-label">Email</label>
              <input
                className="ClientRegister-input"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Email"
              />
            </div>

            {/* Phone */}
            <div className="ClientRegister-field">
              <label className="ClientRegister-label">Phone Number</label>
              <input
                className="ClientRegister-input"
                name="phone"
                type="text" // 'text' prevents scroll wheels on inputs
                maxLength="10"
                value={form.phone}
                onChange={(e) => {
                  // Allow only numbers
                  const re = /^[0-9\b]+$/;
                  if (e.target.value === "" || re.test(e.target.value)) {
                     handleChange(e);
                  }
                }}
                placeholder="Enter Phone Number"
              />
            </div>

            {/* Password */}
            <div className="ClientRegister-field">
              <label className="ClientRegister-label">Password</label>
              <input
                className="ClientRegister-input"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Strong Password"
              />
            </div>

            {/* Confirm Password */}
            <div className="ClientRegister-field">
              <label className="ClientRegister-label">Confirm Password</label>
              <input
                className="ClientRegister-input"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
            </div>

            <button className="ClientRegister-submitBtn" onClick={submit}>
              Register Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}