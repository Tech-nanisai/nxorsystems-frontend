import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFileInvoiceDollar, FaArrowLeft, FaEye, FaSearch, FaTrash } from "react-icons/fa";
import "./GenerateInvoice.css"; // Reusing existing styles

const InvoiceHistory = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:1981/api/superadmin/data/all-invoices");
            if (res.data.success) {
                setInvoices(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching invoices:", err);
            setInvoices([]);
        } finally {
            setLoading(false);
        }
    };



    const handleDelete = async (id, e) => {
        e.stopPropagation(); // Prevent navigating to details page
        if (!window.confirm("Are you sure you want to delete this invoice? This action is permanent and will remove it from the Client Dashboard as well.")) {
            return;
        }

        try {
            const res = await axios.delete(`http://localhost:1981/api/superadmin/data/invoice/${id}`);
            if (res.data.success) {
                // Remove from state immediately
                setInvoices(prev => prev.filter(inv => inv._id !== id));
                alert("Invoice deleted successfully.");
            } else {
                alert("Failed to delete invoice: " + res.data.message);
            }
        } catch (err) {
            console.error("Error deleting invoice:", err);
            alert("Error deleting invoice.");
        }
    };

    // Helper to format ID for display/search match
    const getFormattedId = (inv) => {
        if (!inv) return "";
        const d = new Date(inv.date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const suffix = inv._id.slice(-6).toUpperCase();
        return `NXOR${day}${month}${suffix}`;
    };

    const filteredInvoices = invoices.filter(inv => {
        const search = searchTerm.toLowerCase();
        const clientMatch = inv.clientID.toLowerCase().includes(search);
        const idMatch = inv._id.toLowerCase().includes(search);
        const formattedMatch = getFormattedId(inv).toLowerCase().includes(search);
        return clientMatch || idMatch || formattedMatch;
    });

    return (
        <div className="GenerateInvoice-container">
            <div className="invoice-header" style={{ textAlign: 'left', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <p className="GenerateInvoice-subtitle" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>CM {'>'} Billing {'>'} History</p>
                    <h2 className="dashboard-title" style={{ margin: 0 }}>Invoice History</h2>

                    {/* PREMIUM BACK BUTTON */}
                    <div className="premium-back-container">
                        <Link to="/superadmin/client-management/billing" className="premium-back-btn">
                            <FaArrowLeft style={{ fontSize: '0.8rem' }} /> Back to Billing
                        </Link>
                    </div>
                </div>

                {/* PREMIUM SEARCH BAR */}
                <div className="premium-search-box">
                    <FaSearch className="premium-search-icon" />
                    <input
                        type="text"
                        placeholder="Search Client ID or Invoice #"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="history-card">
                <div className="hc-header">
                    <h4>All Generated Invoices</h4>
                    <span className="hc-badge blue">Total: {filteredInvoices.length}</span>
                </div>

                <div className="hc-list" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                    {loading ? (
                        <div className="empty-text">Loading history...</div>
                    ) : filteredInvoices.length === 0 ? (
                        <div className="empty-text">No invoices found.</div>
                    ) : (
                        filteredInvoices.map((inv) => (
                            <div key={inv._id} className="hc-item" onClick={() => navigate(`/superadmin/invoice/${inv._id}`)} style={{ cursor: 'pointer' }}>
                                <div className="hc-icon blue">
                                    <FaFileInvoiceDollar />
                                </div>
                                <div className="hc-info">
                                    <span className="hc-id">{inv.clientID}</span>
                                    <span className="hc-date">{new Date(inv.date).toLocaleDateString()}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: #{inv._id.slice(-6).toUpperCase()}</span>
                                </div>
                                <div className="hc-meta">
                                    <span className="hc-amount">₹{inv.amount.toLocaleString()}</span>
                                    <span className={`hc-status ${inv.status.toLowerCase()}`}>
                                        {inv.status}
                                    </span>
                                </div>
                                <div className="hc-actions" style={{ display: 'flex', gap: '15px', marginLeft: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ color: '#cbd5e1' }} title="View Details">
                                        <FaEye />
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(inv._id, e)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '5px', display: 'flex', alignItems: 'center' }}
                                        title="Delete Invoice"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceHistory;
