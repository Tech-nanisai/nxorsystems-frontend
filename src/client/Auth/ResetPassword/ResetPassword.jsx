//frontend/src/client/Auth/ResetPassword/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaLock, FaSpinner, FaKey, FaShieldAlt, FaUserShield, FaFingerprint, FaUnlockAlt } from "react-icons/fa";
import { MdCheckCircle, MdError } from "react-icons/md";
import "./ResetPassword.css";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' or 'error'

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setStatus(null);

        try {
            // Updated API Endpoint & Payload
            const response = await axios.post(
                "https://nxorsystems-backend-xglw.onrender.com/api/client/auth/reset-password",
                {
                    token: token,
                    password: newPassword
                }
            );

            if (response.data.success) {
                setMessage(response.data.message);
                setStatus("success");
                setTimeout(() => navigate("/client/signIn"), 3000);
            } else {
                setMessage(response.data.message);
                setStatus("error");
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Error resetting password");
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            {/* Background Floating Icons */}
            <FaLock className="bg-icon icon-lock" />
            {/* <FaKey className="bg-icon icon-key" /> Removed */}
            <FaShieldAlt className="bg-icon icon-shield" />
            <FaFingerprint className="bg-icon icon-fingerprint" />
            <FaUserShield className="bg-icon icon-user-shield" />
            <FaUnlockAlt className="bg-icon icon-unlock" />
            {/* Reset Password Header */}
            <h2 className="reset-password-title">
                <FaLock className="reset-password-icon" /> Reset Password
            </h2>

            {/* Status Message (Success/Error) */}
            {message && (
                <p className={`reset-password-message ${status}`}>
                    {status === "success" ? <MdCheckCircle className="reset-password-success-icon" /> : <MdError className="reset-password-error-icon" />}
                    {message}
                </p>
            )}

            {/* Reset Password Form */}
            <form className="reset-password-form" onSubmit={handleSubmit}>
                <label className="reset-password-label">
                    {/* <FaLock className="reset-password-label-icon" />  */}
                    New Password:
                </label>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="reset-password-input"
                />
                <button type="submit" className="reset-password-btn" disabled={loading}>
                    {loading ? <FaSpinner className="reset-password-spinner" /> : "Reset Password"}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;

