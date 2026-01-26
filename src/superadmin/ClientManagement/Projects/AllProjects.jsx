import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaProjectDiagram, FaSearch, FaFilter, FaArrowLeft } from "react-icons/fa";
import "../GenerateInvoice.css"; // Reuse existing styles for consistency

const AllProjects = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:1981/api/superadmin/data/all-projects");
            if (res.data.success) {
                setProjects(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching projects:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(proj => {
        const search = searchTerm.toLowerCase();

        // Match against Title, Client ID, or Project ID
        const matchTitle = proj.title?.toLowerCase().includes(search);
        const matchClient = proj.clientID?.toLowerCase().includes(search);
        const matchID = proj.projectID?.toLowerCase().includes(search);

        // Determine Effective Status (UI Logic)
        const effectiveStatus = (proj.approvalStatus === 'Rejected') ? 'Rejected' : proj.status;

        const matchesSearch = matchTitle || matchClient || matchID;
        const matchesStatus = statusFilter === "All" || effectiveStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="GenerateInvoice-container">
            <div className="invoice-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p className="GenerateInvoice-subtitle" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>CM {'>'} Projects {'>'} List</p>
                        <h2 className="dashboard-title" style={{ margin: 0 }}>All Projects</h2>
                        {/* PREMIUM BACK BUTTON */}
                        <div className="premium-back-container">
                            <Link to="/superadmin/client-management/projects" className="premium-back-btn">
                                <FaArrowLeft style={{ fontSize: '0.8rem' }} /> Back to Projects
                            </Link>
                        </div>
                    </div>
                </div>

                {/* FILTERS & SEARCH */}
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>

                    {/* PREMIUM SEARCH BAR */}
                    <div className="premium-search-box">
                        <FaSearch className="premium-search-icon" />
                        <input
                            type="text"
                            placeholder="Search Client ID or Project ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="GenerateInvoice-std-select"
                        style={{ width: 'auto', minWidth: '150px' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="history-card">
                <div className="hc-header">
                    <h4>Active Projects List</h4>
                    <span className="hc-badge blue">Total: {filteredProjects.length}</span>
                </div>

                <div className="hc-list">
                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading projects...</p>
                    ) : filteredProjects.length === 0 ? (
                        <div className="empty-text">No projects found.</div>
                    ) : (
                        filteredProjects.map((proj) => (
                            <div key={proj._id} className="hc-item" onClick={() => {/* Maybe open details in future */ }}>
                                <div className="hc-icon blue">
                                    <FaProjectDiagram />
                                </div>
                                <div className="hc-info">
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', letterSpacing: '0.5px' }}>
                                        {proj.projectID || "N/A"}
                                    </span>
                                    <span className="hc-id" style={{ fontSize: '1.1rem' }}>{proj.title}</span>
                                    <span style={{ fontSize: '0.9rem', color: '#334155' }}>Client: <strong>{proj.clientID}</strong></span>
                                    <div style={{ marginTop: '5px', width: '100%', maxWidth: '200px', background: '#e2e8f0', borderRadius: '10px', height: '6px', overflow: 'hidden' }}>
                                        <div style={{ width: `${proj.progress}%`, background: '#2563eb', height: '100%' }}></div>
                                    </div>
                                </div>
                                <div className="hc-meta">
                                    <span className={`hc-status ${(proj.status === 'Completed') ? 'paid' :
                                        (proj.status === 'Rejected' || proj.approvalStatus === 'Rejected') ? 'overdue' :
                                            (proj.status === 'In Progress') ? 'partial/due' : 'due'
                                        }`}>
                                        {proj.approvalStatus === 'Rejected' ? 'Rejected' : proj.status}
                                    </span>
                                    <span className="hc-date" style={{ marginTop: '4px' }}>{proj.progress}% Done</span>
                                    <span className="hc-date">Due: {proj.deadline ? new Date(proj.deadline).toLocaleDateString() : 'No Deadline'}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllProjects;
