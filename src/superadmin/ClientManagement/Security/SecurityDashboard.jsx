import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    FaShieldAlt, FaUserShield, FaKey, FaHistory, FaSearch, FaArrowLeft,
    FaPowerOff, FaCheckCircle, FaBan, FaExclamationTriangle
} from "react-icons/fa";
import "./SecurityDashboard.css";

const SecurityDashboard = () => {
    // State
    const [searchTerm, setSearchTerm] = useState("");
    const [clientData, setClientData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false); // For button spinners

    // Search Client
    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) return;

        setLoading(true);
        setClientData(null);
        try {
            // Fetch Client & Logs in parallel
            const [clientRes, logsRes] = await Promise.all([
                axios.get(`http://localhost:1981/api/superadmin/security/${searchTerm}`),
                axios.get(`http://localhost:1981/api/superadmin/security/logs/${searchTerm}`)
            ]);

            setClientData({
                client: clientRes.data,
                logs: logsRes.data
            });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Client not found or server error.");
            setClientData(null);
        } finally {
            setLoading(false);
        }
    };

    // Actions
    const handleStatusUpdate = async (newStatus) => {
        if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

        setActionLoading(true);
        try {
            await axios.post("http://localhost:1981/api/superadmin/security/update-status", {
                clientID: clientData.client.clientID,
                status: newStatus
            });
            alert("Status updated successfully!");
            refreshData();
        } catch (err) {
            alert("Failed to update status.");
        } finally {
            setActionLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        const newPass = prompt("Enter new password (min 6 chars):");
        if (!newPass) return;
        if (newPass.length < 6) {
            alert("Password too short.");
            return;
        }

        setActionLoading(true);
        try {
            await axios.post("http://localhost:1981/api/superadmin/security/reset-password", {
                clientID: clientData.client.clientID,
                newPassword: newPass
            });
            alert("Password reset successfully! All devices logged out.");
            refreshData();
        } catch (err) {
            alert("Failed to reset password.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleLogoutAll = async () => {
        if (!window.confirm("Are you sure? This will log out the client from ALL devices immediately.")) return;

        setActionLoading(true);
        try {
            await axios.post("http://localhost:1981/api/superadmin/security/logout-all", {
                clientID: clientData.client.clientID
            });
            alert("Client logged out from all devices.");
            refreshData();
        } catch (err) {
            alert("Action failed.");
        } finally {
            setActionLoading(false);
        }
    };

    const refreshData = () => {
        if (!clientData?.client?.clientID) return;

        Promise.all([
            axios.get(`http://localhost:1981/api/superadmin/security/${clientData.client.clientID}`),
            axios.get(`http://localhost:1981/api/superadmin/security/logs/${clientData.client.clientID}`)
        ]).then(([clientRes, logsRes]) => {
            setClientData({
                client: clientRes.data,
                logs: logsRes.data
            });
        }).catch(console.error);
    };

    // Format IST
    const formatIST = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true
        }) + " (IST)";
    };

    return (
        <div className="security-dashboard-container">
            {/* Header */}
            <div className="security-header">
                <p className="security-breadcrumb">Client Management / Security</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="security-title">Client Security Dashboard</h2>
                </div>

                {/* Back Button matching other pages */}
                <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                    <Link to="/superadmin/client-management" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', background: 'white' }}>
                        ← Back to Management
                    </Link>
                </div>
            </div>

            {/* Search Section */}
            <div className="client-search-section">
                <FaSearch style={{ color: '#94a3b8', fontSize: '1.2rem' }} />
                <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, gap: '1rem' }}>
                    <input
                        className="client-search-input"
                        type="text"
                        placeholder="Enter Client ID (e.g. CL10003) to manage security..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="client-search-btn" disabled={loading}>
                        {loading ? "Searching..." : "Search Client"}
                    </button>
                </form>
            </div>

            {/* Content Area */}
            {!clientData ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <FaUserShield style={{ fontSize: '4rem', color: '#e2e8f0', marginBottom: '1rem' }} />
                    <h3>No Client Selected</h3>
                    <p>Search for a client ID to view and manage their security settings.</p>
                </div>
            ) : (
                <div className="security-modules-grid">

                    {/* 1. Account Status */}
                    <div className="security-card theme-status">
                        <div className="security-card-header">
                            <div className="security-icon-box"><FaUserShield /></div>
                            <h3 className="security-card-title">Account Status</h3>
                        </div>
                        <div className="security-content">
                            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                <span className={`status-badge-lg status-${clientData.client.status}`}>
                                    {clientData.client.status}
                                </span>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '8px' }}>
                                    Last Updated: {formatIST(clientData.client.updatedAt)}
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <button className="action-btn btn-primary" onClick={() => handleStatusUpdate('Active')} disabled={actionLoading || clientData.client.status === 'Active'}>
                                    <FaCheckCircle /> Set Active
                                </button>
                                <button className="action-btn btn-warning" onClick={() => handleStatusUpdate('Suspended')} disabled={actionLoading || clientData.client.status === 'Suspended'}>
                                    <FaExclamationTriangle /> Suspend
                                </button>
                                <button className="action-btn btn-danger" onClick={() => handleStatusUpdate('Blocked')} disabled={actionLoading || clientData.client.status === 'Blocked'}>
                                    <FaBan /> Block
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 2. Password Settings */}
                    <div className="security-card theme-password">
                        <div className="security-card-header">
                            <div className="security-icon-box"><FaKey /></div>
                            <h3 className="security-card-title">Password Settings</h3>
                        </div>
                        <div className="security-content">
                            <p style={{ fontSize: '0.9rem', color: '#475569' }}>
                                Manage client authentication credentials.
                            </p>
                            <button className="action-btn btn-outline" onClick={handlePasswordReset} disabled={actionLoading}>
                                Send Password Reset Link
                            </button>
                            <button
                                className="action-btn btn-outline"
                                style={{ color: '#ef4444', borderColor: '#fecaca' }}
                                onClick={() => alert("Force reset logic would go here (e.g. temporary password).")}
                            >
                                Force Password Change
                            </button>
                        </div>
                    </div>

                    {/* 3. Session Management */}
                    <div className="security-card theme-session">
                        <div className="security-card-header">
                            <div className="security-icon-box"><FaShieldAlt /></div>
                            <h3 className="security-card-title">Session Management</h3>
                        </div>
                        <div className="security-content">
                            <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                                <strong style={{ fontSize: '0.85rem', color: '#166534', display: 'block' }}>Last Login detected:</strong>
                                <span style={{ fontSize: '0.9rem', color: '#15803d' }}>
                                    {clientData.client.lastLogin ? formatIST(clientData.client.lastLogin) : "No login record"}
                                </span>
                            </div>

                            <button className="action-btn btn-danger" onClick={handleLogoutAll} disabled={actionLoading} style={{ width: '100%', marginTop: 'auto' }}>
                                <FaPowerOff /> Logout from All Devices
                            </button>
                        </div>
                    </div>

                    {/* 4. Security Activity Logs */}
                    <div className="security-card theme-logs">
                        <div className="security-card-header">
                            <div className="security-icon-box"><FaHistory /></div>
                            <h3 className="security-card-title">Security Activity Logs</h3>
                        </div>
                        <div className="security-logs-list">
                            {clientData.logs && clientData.logs.length > 0 ? (
                                clientData.logs.map((log) => (
                                    <div key={log._id} className="log-item">
                                        <span className="log-action">{log.action.replace(/_/g, " ")}</span>
                                        <span className="log-date">{formatIST(log.createdAt)}</span>
                                        <span className="log-details">{log.details}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-logs">No recent activity detected.</div>
                            )}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default SecurityDashboard;
