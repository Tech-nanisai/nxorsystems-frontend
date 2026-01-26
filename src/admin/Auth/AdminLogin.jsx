import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AdminLogin.css";

const API = "http://localhost:1981";

const AdminLogin = () => {
  const { loginAdmin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [firstAdminExists, setFirstAdminExists] = useState(true);

  // 🔥 Check if admin exists
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get(`${API}/api/admin/auth/check-first-admin`);
        setFirstAdminExists(res.data.exists);
      } catch {
        setFirstAdminExists(true);
      }
    };
    checkAdmin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Logging in...");

      const res = await axios.post(
        `${API}/api/admin/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const token = res.data?.token;
      const adminData = res.data?.admin;

      if (!token || !adminData) {
        setMessage("Invalid server response.");
        return;
      }

      sessionStorage.setItem("TOKEN", token);
      sessionStorage.setItem("USER_ROLE", "admin");
      sessionStorage.setItem("ADMIN_DATA", JSON.stringify(adminData));

      loginAdmin(adminData, token);

    } catch (err) {
      console.error("Admin Login Error:", err);
      setMessage("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="superAdmin-container">
      <form onSubmit={handleSubmit} className="superAdmin-box">

        <h2 className="superAdmin-heading">Admin Login</h2>

        {/* 🔥 Show if admin does NOT exist */}
        {!firstAdminExists && (
          <div className="superAdmin-warningBox">
            <p className="superAdmin-warningText">
              No Admin found in system.
            </p>
            <button
              type="button"
              className="superAdmin-createButton"
              onClick={() => (window.location.href = "/admin/create-super")}
            >
              Create Super Admin
            </button>
          </div>
        )}

        {/* If admin exists → show login form */}
        {firstAdminExists && (
          <>
            <label className="superAdmin-label">Email</label>
            <input
              type="email"
              className="superAdmin-input"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="superAdmin-label">Password</label>
            <div className="superAdmin-passwordWrapper">
              <input
                type={showPwd ? "text" : "password"}
                className="superAdmin-input"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                className="superAdmin-toggleIcon"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {message && <p className="superAdmin-message">{message}</p>}

            <button className="superAdmin-button" type="submit" disabled={loading}>
              {loading ? "Please wait..." : "Login"}
            </button>
          </>
        )}

      </form>
    </div>
  );
};

export default AdminLogin;
