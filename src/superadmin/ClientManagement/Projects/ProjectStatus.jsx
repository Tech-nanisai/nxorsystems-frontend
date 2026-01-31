import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaTasks, FaSearch, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import "../GenerateInvoice.css"; // Reuse existing styles

const ProjectStatus = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await axios.get("https://nxorsystems-backend-xglw.onrender.com/api/superadmin/data/all-projects");
            if (res.data.success) {
                setProjects(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching projects:", err);
        } finally {
            setLoading(false);
        }
    };

    // Format Date to IST Helper
    const formatIST = (dateString) => {
        if (!dateString) return "Not Actions Yet";
        const date = new Date(dateString);

        // Manual formatting to match: 01/Jan/2026, 10:05 AM, 33 sec (IST)
        const istDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        const day = String(istDate.getDate()).padStart(2, '0');
        const month = istDate.toLocaleString('en-US', { month: 'short' });
        const year = istDate.getFullYear();

        let hour = istDate.getHours();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        hour = hour ? hour : 12;

        const min = String(istDate.getMinutes()).padStart(2, '0');
        const sec = String(istDate.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year}, ${hour}:${min} ${ampm}, ${sec} sec (IST)`;
    };

    const filteredProjects = projects.filter(proj => {
        const search = searchTerm.toLowerCase();
        return (
            proj.title?.toLowerCase().includes(search) ||
            proj.clientID?.toLowerCase().includes(search) ||
            proj.projectID?.toLowerCase().includes(search)
        );
    });

    // Modal State
    const [selectedReasonProj, setSelectedReasonProj] = useState(null);

    const handleCardClick = (proj) => {
        if (proj.approvalStatus === 'Rejected' && proj.rejectionReason) {
            setSelectedReasonProj(proj);
        }
    };

    const closeModal = () => {
        setSelectedReasonProj(null);
    };

    return (
        <div className="GenerateInvoice-container">
            <div className="invoice-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p className="GenerateInvoice-subtitle" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>CM {'>'} Projects {'>'} Status</p>
                        <h2 className="dashboard-title" style={{ margin: 0 }}>Project Approvals & Status</h2>
                        <div className="premium-back-container">
                            <Link to="/superadmin/client-management/projects" className="premium-back-btn">
                                <FaArrowLeft style={{ fontSize: '0.8rem' }} /> Back to Projects
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="premium-search-box" style={{ marginTop: '2rem' }}>
                    <FaSearch className="premium-search-icon" />
                    <input
                        type="text"
                        placeholder="Search Client ID, Project ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="history-card">
                <div className="hc-header">
                    <h4>Approval Logs</h4>
                    <span className="hc-badge blue">Total: {filteredProjects.length}</span>
                </div>

                <div className="hc-list">
                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading status...</p>
                    ) : filteredProjects.length === 0 ? (
                        <div className="empty-text">No data found.</div>
                    ) : (
                        filteredProjects.map((proj) => (
                            <div
                                key={proj._id}
                                className="hc-item"
                                style={{
                                    alignItems: 'flex-start',
                                    cursor: (proj.approvalStatus === 'Rejected' && proj.rejectionReason) ? 'pointer' : 'default',
                                    transition: 'background 0.2s'
                                }}
                                onClick={() => handleCardClick(proj)}
                                onMouseEnter={(e) => {
                                    if (proj.approvalStatus === 'Rejected' && proj.rejectionReason)
                                        e.currentTarget.style.background = '#f8fafc';
                                }}
                                onMouseLeave={(e) => {
                                    if (proj.approvalStatus === 'Rejected' && proj.rejectionReason)
                                        e.currentTarget.style.background = 'white';
                                }}
                            >
                                <div className={`hc-icon ${proj.approvalStatus === 'Approved' ? 'green' : proj.approvalStatus === 'Rejected' ? 'red' : 'blue'}`}>
                                    {proj.approvalStatus === 'Approved' ? <FaCheckCircle /> : proj.approvalStatus === 'Rejected' ? <FaTimesCircle /> : <FaClock />}
                                </div>
                                <div className="hc-info">
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', letterSpacing: '0.5px' }}>
                                        {proj.projectID || "N/A"}
                                    </span>
                                    <span className="hc-id" style={{ fontSize: '1.1rem' }}>{proj.title}</span>
                                    <span style={{ fontSize: '0.9rem', color: '#334155' }}>Client: <strong>{proj.clientID}</strong></span>

                                </div>
                                <div className="hc-meta" style={{ textAlign: 'right' }}>
                                    <span className={`hc-status ${proj.approvalStatus === 'Approved' ? 'paid' :
                                        proj.approvalStatus === 'Rejected' ? 'overdue' : 'due'
                                        }`}>
                                        {proj.approvalStatus || "Pending"}
                                    </span>

                                    <div style={{ marginTop: '5px', fontSize: '0.85rem', color: '#64748b' }}>
                                        {proj.approvalStatus === 'Pending' ? (
                                            <span>Waiting for client action</span>
                                        ) : (
                                            <span style={{ fontWeight: 500 }}>
                                                Action taken on: <br />
                                                {formatIST(proj.approvalDate)}
                                            </span>
                                        )}

                                        {/* Click Hint for Rejected */}
                                        {proj.approvalStatus === 'Rejected' && proj.rejectionReason && (
                                            <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#dc2626', textDecoration: 'underline' }}>
                                                View Reason
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* REJECTION REASON MODAL */}
            {selectedReasonProj && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
                }} onClick={closeModal}>
                    <div style={{
                        background: 'white',
                        padding: '2.5rem',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '500px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        position: 'relative'
                    }} onClick={(e) => e.stopPropagation()}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                <FaTimesCircle />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem' }}>Project Rejected</h3>
                                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>{selectedReasonProj.projectID} â€¢ {selectedReasonProj.title}</p>
                            </div>
                        </div>

                        <div style={{
                            background: '#fff1f2',
                            border: '1px solid #fecdd3',
                            borderRadius: '8px',
                            padding: '1.5rem',
                            color: '#9f1239',
                            fontSize: '0.95rem',
                            lineHeight: '1.6',
                            maxHeight: '300px',
                            overflowY: 'auto'
                        }}>
                            <strong>Reason for Rejection:</strong><br />
                            <span style={{ display: 'block', marginTop: '8px', color: '#881337' }}>
                                "{selectedReasonProj.rejectionReason}"
                            </span>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={closeModal} style={{
                                padding: '10px 24px',
                                background: '#0f172a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}>
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectStatus;

