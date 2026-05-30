import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaTrash, FaUserCheck, FaUserTimes, FaBan, FaSlidersH, FaVideo, FaRegImages, FaSearchPlus } from "react-icons/fa";
import Loader from "../../components/Loader/Loader";
import "../ClientManagement/GenerateInvoice.css"; // Reuse standardized premium styling
import { API_BASE_URL } from "../../config";

const UserManagementDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [lookupKey, setLookupKey] = useState("");
    const [lookupLoading, setLookupLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleQuickLookup = async (e) => {
        e.preventDefault();
        if (!lookupKey.trim()) return;
        setLookupLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/superadmin/data/user/lookup`, {
                key: lookupKey.trim()
            });
            if (res.data.success && res.data.userId) {
                navigate(`/superadmin/user-management/user/${res.data.userId}`);
            }
        } catch (err) {
            console.error("Lookup error:", err);
            alert(err.response?.data?.message || "No user found with the given email address or phone number.");
        } finally {
            setLookupLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/superadmin/data/all-users`);
            if (res.data.success) {
                setUsers(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        const newStatus = currentStatus === "Active" ? "Blocked" : "Active";
        setActionLoadingId(userId);
        try {
            const res = await axios.put(`${API_BASE_URL}/api/superadmin/data/update-user-status/${userId}`, {
                status: newStatus
            });
            if (res.data.success) {
                setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: newStatus } : u));
            }
        } catch (err) {
            console.error("Error updating user status:", err);
            alert(err.response?.data?.message || "Failed to update user status");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to permanently delete this user account? This action is irreversible.")) {
            return;
        }
        setActionLoadingId(userId);
        try {
            const res = await axios.delete(`${API_BASE_URL}/api/superadmin/data/delete-user/${userId}`);
            if (res.data.success) {
                setUsers(prev => prev.filter(u => u._id !== userId));
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            alert(err.response?.data?.message || "Failed to delete user account");
        } finally {
            setActionLoadingId(null);
        }
    };

    const formatIST = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: true
        });
    };

    const filteredUsers = users.filter(user => {
        const search = searchTerm.toLowerCase();
        return (
            user.fullName?.toLowerCase().includes(search) ||
            user.email?.toLowerCase().includes(search) ||
            user.phone?.toLowerCase().includes(search) ||
            user.status?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="GenerateInvoice-container">
            {/* Header */}
            <div className="invoice-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p className="GenerateInvoice-subtitle" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>Dashboard {'>'} Users</p>
                        <h2 className="dashboard-title" style={{ margin: 0 }}>User Management</h2>
                        <div className="premium-back-container">
                            <Link to="/superadmin/dashboard" className="premium-back-btn">
                                <FaArrowLeft style={{ fontSize: '0.8rem' }} /> Back to Dashboard
                            </Link>
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link
                                to="/superadmin/user-management/flagship-offering"
                                className="premium-back-btn"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    textDecoration: 'none',
                                    background: '#2563eb',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <FaSlidersH /> Customize Flagship Offers
                            </Link>
                            <Link
                                to="/superadmin/user-management/entertainment-reels-editor"
                                className="premium-back-btn"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    textDecoration: 'none',
                                    background: '#7c3aed',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <FaVideo /> Manage Entertainment Reels
                            </Link>
                            <Link
                                to="/superadmin/user-management/creative-designs-editor"
                                className="premium-back-btn"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    textDecoration: 'none',
                                    background: '#ec4899',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(236, 72, 153, 0.15)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <FaRegImages /> Manage Creative Designs
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="premium-search-box" style={{ marginTop: '2rem' }}>
                    <FaSearch className="premium-search-icon" />
                    <input
                        type="text"
                        placeholder="Search Name, Email, Phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Quick Lookup Panel */}
            <div className="history-card" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(20px)', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaSearchPlus style={{ color: '#2563eb' }} /> Quick User Lookup & Purchase Management
                </h4>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#64748b' }}>Quickly locate a user and update their purchase records using their email address or phone number as a key.</p>
                <form onSubmit={handleQuickLookup} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Enter user's registered email or phone..."
                        value={lookupKey}
                        onChange={(e) => setLookupKey(e.target.value)}
                        style={{
                            flex: 1,
                            minWidth: '260px',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            outline: 'none',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s',
                            background: '#ffffff'
                        }}
                        required
                    />
                    <button
                        type="submit"
                        disabled={lookupLoading}
                        style={{
                            background: '#2563eb',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '10px',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {lookupLoading ? 'Searching...' : 'Find & Manage'}
                    </button>
                </form>
            </div>

            {/* Users List */}
            <div className="history-card">
                <div className="hc-header">
                    <h4>Registered Users</h4>
                    <span className="hc-badge blue">Total: {filteredUsers.length}</span>
                </div>

                <div className="hc-list">
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                            <Loader />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="empty-text" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No users found.</div>
                    ) : (
                        filteredUsers.map((user) => (
                            <div 
                                key={user._id} 
                                className="hc-item" 
                                style={{ 
                                    opacity: actionLoadingId === user._id ? 0.6 : 1,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={() => navigate(`/superadmin/user-management/user/${user._id}`)}
                                title="Click to view details & purchases"
                            >
                                <div className={`hc-icon ${user.status === 'Active' ? 'blue' : 'red'}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>
                                    <FaUser />
                                </div>
                                <div className="hc-info">
                                    <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{user.fullName}</span>
                                    <span style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <FaEnvelope style={{ color: '#94a3b8', fontSize: '0.8rem' }} /> {user.email}
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <FaPhone style={{ color: '#94a3b8', fontSize: '0.75rem' }} /> {user.phone}
                                    </span>
                                </div>
                                <div className="hc-meta" style={{ textAlign: 'right', minWidth: '220px' }} onClick={(e) => e.stopPropagation()}>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>
                                        Registered: {formatIST(user.createdAt)}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                                        <span className={`hc-status ${user.status === 'Active' ? 'paid' : 'overdue'}`} style={{ padding: '3px 10px', fontSize: '0.75rem', fontWeight: '600' }}>
                                            {user.status || "Active"}
                                        </span>
                                        
                                        {/* Actions */}
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleStatusToggle(user._id, user.status); }} 
                                            disabled={actionLoadingId !== null}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: user.status === 'Active' ? '#ea580c' : '#16a34a',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                padding: '4px',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                            title={user.status === 'Active' ? 'Block User' : 'Activate User'}
                                        >
                                            {user.status === 'Active' ? <FaBan /> : <FaUserCheck />}
                                        </button>
                                        
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDeleteUser(user._id); }} 
                                            disabled={actionLoadingId !== null}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                padding: '4px',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                            title='Delete User Account'
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserManagementDashboard;
