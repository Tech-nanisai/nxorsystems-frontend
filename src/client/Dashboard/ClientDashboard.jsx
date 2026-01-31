import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useClientAuth } from "../../context/ClientAuthContext";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaProjectDiagram,
  FaTasks,
  FaFileInvoiceDollar,
  FaBell,
  FaArrowRight
} from "react-icons/fa";
import Loader from "../../components/Loader/Loader";
import "./ClientDashboard.css";

export default function ClientDashboard() {
  const { client, clientToken } = useClientAuth();
  const navigate = useNavigate();

  // State for Dynamic Data
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    payments: 0,
    messages: 0,
    updates: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("https://nxorsystems-backend-xglw.onrender.com/api/client/dashboard/stats", {
          headers: { Authorization: `Bearer ${clientToken}` }
        });
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    if (clientToken) fetchStats();
  }, [clientToken]);

  if (!client || loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
        <Loader />
      </div>
    );
  }

  const isActive = (client.status || "Active") === "Active";

  return (
    <div className="client-dashboard-container">

      {/* HEADER SECTION */}
      <div className="dashboard-header">
        <div className="header-greeting">
          <h1>Welcome back, {client.fullName.split(' ')[0]}! ðŸ‘‹</h1>
          <p>Here's what's happening with your projects today.</p>
        </div>
        <div className="header-actions">
          {/* Notification Bell Placeholder */}
          <button className="icon-btn-glass">
            <FaBell />
            <span className="notification-dot"></span>
          </button>
          <div className="date-badge">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}
          </div>
        </div>
      </div>

      {/* MAIN GRID LAYOUT */}
      <div className="dashboard-grid">

        {/* --- LEFT: STATS & OVERVIEW --- */}
        <div className="dashboard-main-area">

          {/* Stats Cards Row */}
          {/* Stats Cards Row */}
          <div className="stats-grid">
            <div className="stat-card glass-card" onClick={() => navigate('/client/projects')} style={{ cursor: 'pointer' }}>
              <div className="stat-icon-box gradient-blue">
                <FaProjectDiagram />
              </div>
              <div className="stat-info">
                <p className="stat-label">Active Projects</p>
                <h3 className="stat-value">{stats.projects}</h3>
              </div>
            </div>

            <div className="stat-card glass-card" onClick={() => navigate('/client/tasks')} style={{ cursor: 'pointer' }}>
              <div className="stat-icon-box gradient-orange">
                <FaTasks />
              </div>
              <div className="stat-info">
                <p className="stat-label">Pending Tasks</p>
                <h3 className="stat-value">{stats.tasks}</h3>
              </div>
            </div>

            <div className="stat-card glass-card" onClick={() => navigate('/client/payments')} style={{ cursor: 'pointer' }}>
              <div className="stat-icon-box gradient-green">
                <FaFileInvoiceDollar />
              </div>
              <div className="stat-info">
                <p className="stat-label">Due Payments</p>
                <h3 className="stat-value">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(stats.payments)}
                </h3>
              </div>
            </div>
          </div>

          {/* Quick Actions / Recent Activity Placeholder */}
          <div className="dashboard-section glass-card">
            <div className="section-header">
              <h3>Recent Updates</h3>
              <button className="view-all-link">View All <FaArrowRight /></button>
            </div>
            <div className="updates-list">
              {stats.updates && stats.updates.length > 0 ? (
                stats.updates.map((update, idx) => (
                  <div key={idx} className="update-item">
                    <span className="update-dot"></span>
                    <p>{update.title}: {update.desc}</p>
                    <span className="update-time">{update.time}</span>
                  </div>
                ))
              ) : (
                <div className="empty-updates">
                  <p>No recent activity to report.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* --- RIGHT: CLIENT PROFILE CARD --- */}
        <div className="dashboard-sidebar">
          <div className="client-profile-card glass-card">
            <div className="profile-banner"></div>
            <div className="profile-content">
              <div className="profile-avatar-large">
                {client.profilePicture ? (
                  <img src={client.profilePicture} alt="Profile" />
                ) : (
                  <FaUserCircle />
                )}
              </div>
              <h3 className="profile-name">{client.fullName}</h3>
              <span className="profile-id">ID: {client.clientID}</span>
              <span className={`status-pill ${isActive ? 'active' : 'inactive'}`}>
                {client.status || "Active Account"}
              </span>

              <div className="contact-info-list">
                <div className="contact-item">
                  <div className="ci-icon"><FaEnvelope /></div>
                  <div className="ci-text">
                    <span>Email</span>
                    <p>{client.email}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="ci-icon"><FaPhone /></div>
                  <div className="ci-text">
                    <span>Phone</span>
                    <p>{client.phone || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div className="account-summary">
                <p>Your relationship manager is just a message away.</p>
                <button className="manager-contact-btn">Contact Manager</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
