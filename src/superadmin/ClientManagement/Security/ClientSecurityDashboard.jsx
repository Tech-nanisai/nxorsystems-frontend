import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserShield, FaKey, FaSignOutAlt, FaHistory, FaSearch, FaCheckCircle, FaBan, FaExclamationTriangle } from "react-icons/fa";
import "./ClientSecurityDashboard.css";

const ClientSecurityDashboard = () => {
    const [searchID, setSearchID] = useState("");
    const [clientData, setClientData] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    // Form States
    const [newStatus, setNewStatus] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // Utility: Fetch Client Data
    const fetchClient = async (id) => {
        setLoading(true);
        setError("");
        setMsg("");
        setClientData(null);

        try {
            const res = await axios.get(`https://nxorsystems-backend-xglw.onrender.com/api/superadmin/security/${id}`);
            setClientData(res.data);
            setNewStatus(res.data.status);
            fetchLogs(id);
        } catch (err) {
            setError(err.response?.data?.message || "Client not found or server error");
        } finally {
            setLoading(false);
        }
    };

    // Utility: Fetch Logs
    const fetchLogs = async (id) => {
        try {
            const res = await axios.get(`https://nxorsystems-backend-xglw.onrender.com/api/superadmin/security/logs/${id}`);
            setLogs(res.data);
        } catch (err) {
            console.error("Error fetching logs:", err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchID.trim()) {
            fetchClient(searchID.trim());
        }
    };

    // 1. Update Status
    const handleStatusUpdate = async () => {
        if (!clientData) return;
        try {
            await axios.post("https://nxorsystems-backend-xglw.onrender.com/api/superadmin/security/update-status", {
                clientID: clientData.clientID,
                status: newStatus
            });
            setMsg("Status updated successfully!");
            setClientData({ ...clientData, status: newStatus });
            fetchLogs(clientData.clientID);
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            alert("Error updating status");
        }
    };

    // 2. Reset Password
    const handlePasswordReset = async () => {
        if (!newPassword || newPassword.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }
        if (!window.confirm("Are you sure? This will reset the password and logout all devices.")) return;

        try {
            await axios.post("https://nxorsystems-backend-xglw.onrender.com/api/superadmin/security/reset-password", {
                clientID: clientData.clientID,
                newPassword
            });
            setMsg("Password reset successfully!");
            setNewPassword("");
            fetchLogs(clientData.clientID);
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            alert("Error reset password");
        }
    };

    // 3. Logout All Devices
    const handleLogoutAll = async () => {
        if (!window.confirm("This will invalidate all current sessions for this user. Continue?")) return;
        try {
            await axios.post("https://nxorsystems-backend-xglw.onrender.com/api/superadmin/security/logout-all", {
                clientID: clientData.clientID
            });
            setMsg("All devices logged out!");
            fetchLogs(clientData.clientID);
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            alert("Error logging out devices");
        }
    };

    return (
        <div className="security-dashboard-container">
            <h2 className="security-title">
                <FaUserShield className="icon-header" /> Client Security Watchtower
            </h2>
            <p className="security-subtitle">Manage account access, passwords, and track security events.</p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="security-search-bar">
                <input
                    type="text"
                    placeholder="Enter Client ID (e.g., CL-1025)"
                    value={searchID}
                    onChange={(e) => setSearchID(e.target.value)}
                />
                <button type="submit"><FaSearch /> Search</button>
            </form>

            {loading && <div className="loading-spinner">Searching Security Database...</div>}
            {error && <div className="error-msg"><FaExclamationTriangle /> {error}</div>}
            {msg && <div className="success-msg"><FaCheckCircle /> {msg}</div>}

            {clientData && (
                <div className="security-grid fade-in">

                    {/* SECTION 1: ACCOUNT STATUS */}
                    <div className="security-card status-card">
                        <div className="card-header">
                            <h3><FaBan /> Account Status</h3>
                        </div>
                        <div className="card-body">
                            <div className="current-status">
                                Current: <span className={`badge ${clientData.status.toLowerCase()}`}>{clientData.status}</span>
                            </div>
                            <div className="control-group">
                                <label>Change Status:</label>
                                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                                    <option value="Active">Active</option>
                                    <option value="Suspended">Suspended</option>
                                    <option value="Blocked">Blocked</option>
                                </select>
                            </div>
                            <button className="btn-save" onClick={handleStatusUpdate}>Update Status</button>
                        </div>
                    </div>

                    {/* SECTION 2: PASSWORD SETTINGS */}
                    <div className="security-card password-card">
                        <div className="card-header">
                            <h3><FaKey /> Password Settings</h3>
                        </div>
                        <div className="card-body">
                            <p className="info-text">Resetting will force logout on all devices.</p>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button className="btn-danger" onClick={handlePasswordReset}>Reset Password</button>
                        </div>
                    </div>

                    {/* SECTION 3: SESSION MANAGEMENT */}
                    <div className="security-card session-card">
                        <div className="card-header">
                            <h3><FaSignOutAlt /> Session Management</h3>
                        </div>
                        <div className="card-body">
                            <div className="session-info">
                                <p><strong>Last Login:</strong> {clientData.lastLogin ? new Date(clientData.lastLogin).toLocaleString() : "Never"}</p>
                                <p><strong>Active Sessions:</strong> Indicated by Token v{clientData.tokenVersion}</p>
                            </div>
                            <button className="btn-warning" onClick={handleLogoutAll}>
                                Logout from all devices
                            </button>
                            <p className="small-text">Increments token version to invalidate old JWTs.</p>
                        </div>
                    </div>

                    {/* SECTION 4: ACTIVITY LOGS */}
                    <div className="security-card logs-card">
                        <div className="card-header">
                            <h3><FaHistory /> Security Activity Logs</h3>
                        </div>
                        <div className="card-body logs-body">
                            {logs.length === 0 ? (
                                <p className="no-logs">No logs found.</p>
                            ) : (
                                <ul className="logs-list">
                                    {logs.map((log) => (
                                        <li key={log._id} className="log-item">
                                            <div className="log-header">
                                                <span className="log-action">{log.action}</span>
                                                <span className="log-date">{new Date(log.createdAt).toLocaleString()}</span>
                                            </div>
                                            <div className="log-details">{log.details}</div>
                                            <div className="log-actor">By: {log.performedBy}</div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default ClientSecurityDashboard;

