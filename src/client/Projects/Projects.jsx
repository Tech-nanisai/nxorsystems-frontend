//frontend/src/client/Projects/Projects.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaCalendarAlt, FaTasks, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import { useClientAuth } from "../../context/ClientAuthContext";
import "./Projects.css";

const Projects = () => {
  const navigate = useNavigate();
  const { clientToken } = useClientAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Projects from Backend
  useEffect(() => {
    if (clientToken) {
      fetchProjects();
    }
  }, [clientToken]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("https://nxorsystems-backend-xglw.onrender.com/api/client/dashboard/my-projects", {
        headers: { Authorization: `Bearer ${clientToken}` }
      });

      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching client projects:", err);
      // Fallback to empty or error state
    } finally {
      setLoading(false);
    }
  };

  // Format Date to IST
  const formatIST = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const options = {
      timeZone: "Asia/Kolkata",
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: true
    };
    // Custom formatting to match "01/Jan/2026, 10:05 AM, 33 sec (IST)" exactly is hard with Intl alone, doing best effort + manual tweak if needed.
    // Intl output: "01 Jan 2026, 10:05:33 am" -> close enough or I can parse parts.
    // Let's use a robust manual format for exact match if strict:

    const istDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const day = String(istDate.getDate()).padStart(2, '0');
    const month = istDate.toLocaleString('en-US', { month: 'short' });
    const year = istDate.getFullYear();
    let hour = istDate.getHours();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    const min = String(istDate.getMinutes()).padStart(2, '0');
    const sec = String(istDate.getSeconds()).padStart(2, '0'); // Note: prompt asked for "33 sec", so maybe literal "sec"? "33 sec"

    return `${day}/${month}/${year}, ${hour}:${min} ${ampm}, ${sec} sec (IST)`;
  };

  // Rejection Modal Logic
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedProjectID, setSelectedProjectID] = useState(null);

  const openRejectModal = (e, id) => {
    e.stopPropagation();
    setSelectedProjectID(id);
    setRejectReason("");
    setIsRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setSelectedProjectID(null);
  };

  const submitRejection = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    await handleApproval(null, selectedProjectID, 'reject', rejectReason);
    closeRejectModal();
  };

  const handleApproval = async (e, id, action, reason = null) => {
    if (e) e.stopPropagation(); // Only call stopPropagation if event exists

    // If reject is clicked directly (without reason flow started), open modal
    if (action === 'reject' && !reason) {
      openRejectModal(e || { stopPropagation: () => { } }, id);
      return;
    }

    try {
      const res = await axios.post("https://nxorsystems-backend-xglw.onrender.com/api/client/dashboard/project-approval",
        { projectID: id, action, rejectionReason: reason },
        { headers: { Authorization: `Bearer ${clientToken}` } }
      );

      if (res.data.success) {
        // Update local state
        setProjects(prev => prev.map(p =>
          p._id === id ? { ...p, approvalStatus: action === 'approve' ? 'Approved' : 'Rejected', status: action === 'approve' ? 'In Progress' : 'Rejected', approvalDate: new Date() } : p
        ));
      }
    } catch (err) {
      console.error("Approval Error:", err);
      // alert("Failed to update status.");
    }
  };

  const handleProjectClick = (id) => {
    navigate(`/client/projects/${id}`);
  };

  return (
    <div className="client-projects-container">
      <div className="projects-header">
        <h2>My Projects</h2>
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search projects by ID, Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div className="projects-grid">
          {projects.length > 0 ? (
            projects.map((project) => {
              // Filter logic if needed
              if (searchTerm && !project.title.toLowerCase().includes(searchTerm.toLowerCase()) && !project.projectID?.toLowerCase().includes(searchTerm.toLowerCase())) return null;

              return (
                <div key={project._id} className="project-card" onClick={() => handleProjectClick(project._id)}>
                  <div className="card-header">
                    <span className="project-id">{project.projectID || project._id.slice(-6).toUpperCase()}</span>
                    <span className={`status-badge ${project.approvalStatus === 'Rejected' ? 'rejected' :
                      project.status.toLowerCase().replace(" ", "-")
                      }`}>
                      {project.approvalStatus === 'Rejected' ? 'REJECTED' : project.status}
                    </span>
                  </div>

                  <h3 className="project-title">{project.title}</h3>

                  <div className="card-meta">
                    <div className="meta-item">
                      {project.deadline ? (
                        <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                      ) : (
                        <span>No Deadline</span>
                      )}
                    </div>
                  </div>

                  {/* APPROVAL SECTION */}
                  <div className="project-approval-section" onClick={(e) => e.stopPropagation()} style={{ marginTop: '1rem', padding: '0.8rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem', cursor: 'default' }}>
                    {(!project.approvalStatus || project.approvalStatus === 'Pending') && (
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                          onClick={(e) => handleApproval(e, project._id, 'approve')}
                          style={{ padding: '6px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={(e) => handleApproval(e, project._id, 'reject')}
                          style={{ padding: '6px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {project.approvalStatus === 'Approved' && (
                      <div style={{ color: '#15803d', textAlign: 'center' }}>
                        <strong><FaCheckCircle style={{ marginRight: 5 }} /> Approved</strong>
                        <div style={{ fontSize: '0.75rem', marginTop: '4px', color: '#64748b' }}>
                          {formatIST(project.approvalDate)}
                        </div>
                      </div>
                    )}

                    {project.approvalStatus === 'Rejected' && (
                      <div style={{ color: '#b91c1c', textAlign: 'center' }}>
                        <strong><FaTimesCircle style={{ marginRight: 5 }} /> Rejected</strong>
                        <div style={{ fontSize: '0.75rem', marginTop: '4px', color: '#64748b' }}>
                          {formatIST(project.approvalDate)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="progress-section" style={{ opacity: project.approvalStatus === 'Rejected' ? 0.5 : 1 }}>
                    <div className="progress-labels">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {isRejectModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '400px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ marginTop: 0, color: '#ef4444' }}>Reject Project</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>Please provide a reason for rejecting this project.</p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Type rejection reason here..."
              style={{
                width: '100%', height: '100px', padding: '10px', borderRadius: '8px',
                border: '1px solid #e2e8f0', fontFamily: 'inherit', resize: 'vertical'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
              <button onClick={closeRejectModal} style={{
                padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer'
              }}>Cancel</button>
              <button onClick={submitRejection} style={{
                padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: '600'
              }}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
