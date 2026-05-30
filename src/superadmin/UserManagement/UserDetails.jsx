// frontend/src/superadmin/UserManagement/UserDetails.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
    FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaRegCalendarAlt, 
    FaDollarSign, FaFileUpload, FaHistory, FaUserShield, 
    FaFileInvoiceDollar, FaCloudUploadAlt, FaFileAlt, FaTimes, FaBan, FaCheckCircle
} from "react-icons/fa";
import Loader from "../../components/Loader/Loader";
import "./UserDetails.css";
import { API_BASE_URL } from "../../config";

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Purchase form states
    const [productDetails, setProductDetails] = useState("");
    const [priceDetails, setPriceDetails] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        fetchUserDetails();
        // Default to current date and time
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        setDateTime(`${year}-${month}-${day}T${hours}:${minutes}`);
    }, [id]);

    const fetchUserDetails = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/superadmin/data/user/${id}`);
            if (res.data.success) {
                setUser(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching user details:", err);
            alert("Failed to load user details. They might not exist or the server is offline.");
            navigate("/superadmin/user-management");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!user) return;
        const newStatus = user.status === "Active" ? "Blocked" : "Active";
        const confirmMsg = newStatus === "Blocked" 
            ? "Are you sure you want to block this user? They will not be able to log in to their dashboard."
            : "Activate this user's account?";
        
        if (!window.confirm(confirmMsg)) return;

        setLoadingStatus(true);
        try {
            const res = await axios.put(`${API_BASE_URL}/api/superadmin/data/update-user-status/${user._id}`, {
                status: newStatus
            });
            if (res.data.success) {
                setUser(prev => ({ ...prev, status: newStatus }));
                alert(`User status is now successfully set to ${newStatus}`);
            }
        } catch (err) {
            console.error("Error toggling user status:", err);
            alert(err.response?.data?.message || "Failed to update user status.");
        } finally {
            setLoadingStatus(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const removeFile = (e) => {
        e.stopPropagation();
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleAddPurchase = async (e) => {
        e.preventDefault();
        if (!productDetails.trim() || !priceDetails.trim()) {
            alert("Product details and price details are required!");
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("productDetails", productDetails.trim());
            formData.append("priceDetails", priceDetails.trim());
            formData.append("dateTime", dateTime);
            if (file) {
                formData.append("file", file);
            }

            const res = await axios.post(
                `${API_BASE_URL}/api/superadmin/data/user/${id}/purchase`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data.success) {
                alert("Purchase added successfully!");
                // Clear form
                setProductDetails("");
                setPriceDetails("");
                setFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                // Refresh purchases
                setUser(prev => ({ ...prev, purchases: res.data.data }));
            }
        } catch (err) {
            console.error("Error adding purchase details:", err);
            alert(err.response?.data?.message || "Failed to log purchase details.");
        } finally {
            setSubmitting(false);
        }
    };

    const formatIST = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: true
        });
    };

    const getFileUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        return `${API_BASE_URL}/${path}`;
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Loader />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="UserDetails-container" style={{ textAlign: 'center', padding: '3rem' }}>
                <h3>User not found!</h3>
                <Link to="/superadmin/user-management" className="UserDetails-back-btn">
                    <FaArrowLeft /> Back to Registered Users
                </Link>
            </div>
        );
    }

    const initials = user.fullName ? user.fullName.charAt(0).toUpperCase() : "U";

    return (
        <div className="UserDetails-container">
            {/* Navigation Header */}
            <div>
                <Link to="/superadmin/user-management" className="UserDetails-back-btn">
                    <FaArrowLeft style={{ fontSize: '0.8rem' }} /> Back to User Management
                </Link>
            </div>

            <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#64748b' }}>Dashboard &gt; Users &gt; Details</p>
                <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>User Purchase Manager</h2>
            </div>

            {/* Main Layout Grid */}
            <div className="UserDetails-grid">
                {/* Left Profile Overview Column */}
                <div className="UserDetails-profile-card">
                    <div className="UserDetails-avatar">{initials}</div>
                    <h3 className="UserDetails-name">{user.fullName}</h3>
                    <span className="UserDetails-role">Registered Customer</span>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <span className={`UserDetails-status-pill ${user.status === 'Active' ? 'active' : 'blocked'}`}>
                            {user.status || "Active"}
                        </span>
                    </div>

                    <div className="UserDetails-info-list">
                        <div className="UserDetails-info-item">
                            <label>Email Address</label>
                            <span><FaEnvelope style={{ color: '#94a3b8' }} /> {user.email}</span>
                        </div>
                        <div className="UserDetails-info-item">
                            <label>Phone / Mobile</label>
                            <span><FaPhone style={{ color: '#94a3b8' }} /> {user.phone}</span>
                        </div>
                        <div className="UserDetails-info-item">
                            <label>Registered Date</label>
                            <span><FaRegCalendarAlt style={{ color: '#94a3b8' }} /> {formatIST(user.createdAt)}</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleToggleStatus}
                        disabled={loadingStatus}
                        className={`UserDetails-status-toggle-btn ${user.status === 'Active' ? 'block' : 'activate'}`}
                    >
                        {loadingStatus ? 'Processing...' : user.status === 'Active' ? (
                            <>
                                <FaBan /> Block User Account
                            </>
                        ) : (
                            <>
                                <FaCheckCircle /> Activate User Account
                            </>
                        )}
                    </button>
                </div>

                {/* Right Form & Purchase Logs Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Add Purchase Log Form */}
                    <div className="UserDetails-card">
                        <h3 className="UserDetails-card-title">
                            <FaFileInvoiceDollar style={{ color: '#2563eb' }} /> Log New User Purchase
                        </h3>
                        <form onSubmit={handleAddPurchase} className="UserDetails-form">
                            <div className="UserDetails-form-group">
                                <label>Product Details / Description</label>
                                <textarea
                                    className="UserDetails-textarea"
                                    placeholder="Enter details of the service or product purchased (e.g. YouTube Thumbnails Set - Pack of 3)"
                                    value={productDetails}
                                    onChange={(e) => setProductDetails(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="UserDetails-form-row">
                                <div className="UserDetails-form-group">
                                    <label>Price / Amount Details</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            className="UserDetails-input"
                                            placeholder="e.g. $79.00 or Rs. 6,500"
                                            value={priceDetails}
                                            onChange={(e) => setPriceDetails(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="UserDetails-form-group">
                                    <label>Purchase Date &amp; Time (IST)</label>
                                    <input
                                        type="datetime-local"
                                        className="UserDetails-input"
                                        value={dateTime}
                                        onChange={(e) => setDateTime(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="UserDetails-form-group">
                                <label>Payment Proof Attachment (Screenshot / PDF Receipt)</label>
                                {!file ? (
                                    <div 
                                        className={`UserDetails-file-upload ${dragActive ? "drag-active" : ""}`}
                                        onDragEnter={handleDrag}
                                        onDragOver={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <FaCloudUploadAlt />
                                        <span>Click or drag file here to upload proof</span>
                                        <p>Supports Image screenshots (PNG, JPG) or PDF files</p>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                            accept="image/*,application/pdf"
                                        />
                                    </div>
                                ) : (
                                    <div className="UserDetails-file-selected">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaFileAlt style={{ color: '#10b981' }} />
                                            <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={removeFile}
                                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button 
                                type="submit" 
                                className="UserDetails-submit-btn"
                                disabled={submitting}
                            >
                                <FaFileUpload /> {submitting ? 'Logging Purchase...' : 'Add Purchase to User Account'}
                            </button>
                        </form>
                    </div>

                    {/* Purchase History Logs */}
                    <div className="UserDetails-card">
                        <h3 className="UserDetails-card-title">
                            <FaHistory style={{ color: '#7c3aed' }} /> Purchase History & Logs
                        </h3>

                        {!user.purchases || user.purchases.length === 0 ? (
                            <div className="UserDetails-no-purchases">
                                <p>No purchase logs recorded for this registered user account.</p>
                            </div>
                        ) : (
                            <div className="UserDetails-table-wrapper">
                                <table className="UserDetails-table">
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Product Details</th>
                                            <th>Price / Amount</th>
                                            <th>Date &amp; Time (IST)</th>
                                            <th>Payment Proof</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {user.purchases.map((purchase, index) => (
                                            <tr key={purchase._id || index}>
                                                <td style={{ fontWeight: '700' }}>#{index + 1}</td>
                                                <td>{purchase.productDetails}</td>
                                                <td style={{ fontWeight: '700', color: '#0f172a' }}>{purchase.priceDetails}</td>
                                                <td>{formatIST(purchase.dateTime)}</td>
                                                <td>
                                                    {purchase.paymentAttachment ? (
                                                        <a 
                                                            href={getFileUrl(purchase.paymentAttachment)} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="UserDetails-receipt-link"
                                                        >
                                                            <FaFileAlt /> View Proof
                                                        </a>
                                                    ) : (
                                                        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>No Receipt</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
