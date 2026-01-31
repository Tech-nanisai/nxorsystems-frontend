import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaArrowLeft, FaUserTie, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
import Loader from "../../../components/Loader/Loader";
import "../GenerateInvoice.css"; // Reuse standardized styling

const AllClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await axios.get("https://nxorsystems-backend-xglw.onrender.com/api/superadmin/data/all-clients");
            if (res.data.success) {
                setClients(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching clients:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatIST = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: true
        });
    };

    const filteredClients = clients.filter(client => {
        const search = searchTerm.toLowerCase();
        return (
            client.fullName?.toLowerCase().includes(search) ||
            client.clientID?.toLowerCase().includes(search) ||
            client.email?.toLowerCase().includes(search) ||
            client.companyName?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="GenerateInvoice-container">
            {/* Header */}
            <div className="invoice-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p className="GenerateInvoice-subtitle" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>Dashboard {'>'} Clients</p>
                        <h2 className="dashboard-title" style={{ margin: 0 }}>All Clients</h2>
                        <div className="premium-back-container">
                            <Link to="/superadmin/dashboard" className="premium-back-btn">
                                <FaArrowLeft style={{ fontSize: '0.8rem' }} /> Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="premium-search-box" style={{ marginTop: '2rem' }}>
                    <FaSearch className="premium-search-icon" />
                    <input
                        type="text"
                        placeholder="Search Name, ID, Company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Client List */}
            <div className="history-card">
                <div className="hc-header">
                    <h4>Registered Clients</h4>
                    <span className="hc-badge blue">Total: {filteredClients.length}</span>
                </div>

                <div className="hc-list">
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                            <Loader />
                        </div>
                    ) : filteredClients.length === 0 ? (
                        <div className="empty-text">No clients found.</div>
                    ) : (
                        filteredClients.map((client) => (
                            <div key={client._id || client.clientID} className="hc-item">
                                <div className="hc-icon blue">
                                    <FaUserTie />
                                </div>
                                <div className="hc-info">
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', letterSpacing: '0.5px' }}>
                                        {client.clientID}
                                    </span>
                                    <span className="hc-id" style={{ fontSize: '1.1rem' }}>{client.fullName}</span>
                                    <span style={{ fontSize: '0.9rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <FaBuilding style={{ color: '#94a3b8', fontSize: '0.8rem' }} /> {client.companyName || "N/A"}
                                    </span>
                                </div>
                                <div className="hc-meta" style={{ textAlign: 'right', minWidth: '200px' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                                        {client.email} <FaEnvelope style={{ color: '#cbd5e1' }} />
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                                        {client.phone} <FaPhone style={{ color: '#cbd5e1', fontSize: '0.7rem' }} />
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                                        Joined: {formatIST(client.createdAt)}
                                    </div>
                                    <div style={{ marginTop: '5px' }}>
                                        <span className={`hc-status ${client.status === 'Active' ? 'paid' : 'overdue'}`} style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
                                            {client.status || "Active"}
                                        </span>
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

export default AllClients;

