import React, { useState } from "react";
import axios from "axios";
import "./AdminReg.css";
import { useNavigate } from "react-router-dom";

const AdminReg = () => {
  const navigate = useNavigate();
  const API = "http://localhost:1981";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    secretKey: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");

    if (form.password !== form.confirmPassword) {
      setMsg("❌ Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API}/api/admin/auth/register`, form);

      if (res.data?.admin) {
        setMsg("✅ Admin created successfully!");
        setTimeout(() => navigate("/admin/signIn"), 1200);
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Error creating admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adminreg-container">
      <div className="adminreg-card">
        <h2 className="adminreg-title">Create Admin Account</h2>

        <form className="adminreg-form" onSubmit={handleRegister}>
          <label>Full Name</label>
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />

          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />

          <label>Admin Secret Key</label>
          <input type="text" name="secretKey" value={form.secretKey} onChange={handleChange} required />

          {msg && <p className="adminreg-msg">{msg}</p>}

          <button className="adminreg-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminReg;
