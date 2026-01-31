import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaUsers, FaProjectDiagram, FaFileInvoiceDollar, FaChartLine,
  FaUserShield, FaIdCard, FaHistory, FaUserGraduate
} from "react-icons/fa";
import { motion } from "framer-motion";
import Loader from "../../components/Loader/Loader";
import "./SuperadminDashboard.css";

const SuperadminDashboard = () => {
  const [stats, setStats] = useState({ totalClients: 0, activeProjects: 0, totalInvoices: 0 });
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleString("en-IN", {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Parallel Fetch: Stats + Recent Updates (limit 5)
      const [statsRes, updatesRes] = await Promise.all([
        axios.get("https://nxorsystems-backend-xglw.onrender.com/api/superadmin/data/dashboard-stats"),
        // We can reuse the updates endpoint but we only want top 5. 
        // Backend 'getRecentUpdates' accepts query param? Let's assume standard behavior or just slice it.
        // Actually, looking at controller it defaults to 15. We'll utilize that.
        axios.get("https://nxorsystems-backend-xglw.onrender.com/api/superadmin/updates/recent?limit=5")
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (updatesRes.data.success) setRecentUpdates(updatesRes.data.data.slice(0, 5)); // Take top 5 just in case

    } catch (error) {
      console.error("Dashboard Data Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="superadmin-dashboard-container">
      {/* 1. Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="welcome-title">Welcome Back, Chief!</h1>
          <p className="welcome-subtitle">Here's what's happening with your platform today.</p>
        </div>
        <div className="dashboard-time">
          {formatTime(currentTime)}
        </div>
      </div>

      {loading ? (
        <div style={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loader />
        </div>
      ) : (
        <motion.div
          className="dashboard-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 2. Stats Row */}
          <div className="stats-grid">
            <motion.div className="stat-card blue-gradient" variants={itemVariants}>
              <Link to="/superadmin/client-management/all-clients" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%', color: 'inherit', textDecoration: 'none' }}>
                <div className="stat-icon"><FaUsers /></div>
                <div className="stat-info">
                  <h3>{stats.totalClients}</h3>
                  <p>Total Clients</p>
                </div>
              </Link>
            </motion.div>

            <motion.div className="stat-card purple-gradient" variants={itemVariants}>
              <Link to="/superadmin/client-management/projects/all" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%', color: 'inherit', textDecoration: 'none' }}>
                <div className="stat-icon"><FaProjectDiagram /></div>
                <div className="stat-info">
                  <h3>{stats.activeProjects}</h3>
                  <p>Active Projects</p>
                </div>
              </Link>
            </motion.div>

            <motion.div className="stat-card green-gradient" variants={itemVariants}>
              <Link to="/superadmin/client-management/billing/history" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%', color: 'inherit', textDecoration: 'none' }}>
                <div className="stat-icon"><FaFileInvoiceDollar /></div>
                <div className="stat-info">
                  <h3>{stats.totalInvoices}</h3>
                  <p>Invoices Generated</p>
                </div>
              </Link>
            </motion.div>

            <motion.div className="stat-card orange-gradient" variants={itemVariants}>
              <Link to="/superadmin/updates" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%', color: 'inherit', textDecoration: 'none' }}>
                <div className="stat-icon"><FaChartLine /></div>
                <div className="stat-info">
                  <h3>Good</h3>
                  <p>System Health</p>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* 3. Main Content Grid */}
          <div className="main-dashboard-grid">

            {/* Left Column: Quick Actions */}
            <div className="quick-actions-section">
              <h3 className="section-title">Quick Access Modules</h3>
              <div className="actions-grid">
                <Link to="/superadmin/client-management" className="action-card">
                  <div className="action-icon icon-client"><FaUserShield /></div>
                  <h4>Client Management</h4>
                  <p>Manage clients, invoices, and billing.</p>
                </Link>

                <Link to="/superadmin/idgeneration" className="action-card">
                  <div className="action-icon icon-id"><FaIdCard /></div>
                  <h4>ID Generation</h4>
                  <p>Create new unique IDs for system entities.</p>
                </Link>

                <Link to="/superadmin/student-management" className="action-card">
                  <div className="action-icon icon-student"><FaUserGraduate /></div>
                  <h4>Student Management</h4>
                  <p>Manage student records and performance.</p>
                </Link>

                <Link to="/superadmin/updates" className="action-card">
                  <div className="action-icon icon-updates"><FaHistory /></div>
                  <h4>System Updates</h4>
                  <p>View complete activity logs and timeline.</p>
                </Link>
              </div>
            </div>

            {/* Right Column: Recent Activity Feed */}
            <div className="recent-activity-section">
              <div className="activity-header">
                <h3 className="section-title">Recent Activity</h3>
                <Link to="/superadmin/updates" className="view-all-link">View All</Link>
              </div>

              <div className="activity-list">
                {recentUpdates.length === 0 ? (
                  <p className="no-activity">No recent activity recorded.</p>
                ) : (
                  recentUpdates.map((update) => (
                    <div className="activity-item" key={update._id}>
                      <div className={`activity-dot type-${update.type}`}></div>
                      <div className="activity-content">
                        <span className="activity-module">{update.module}</span>
                        <p className="activity-desc">{update.action}</p>
                        <span className="activity-time">
                          {new Date(update.createdAt).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </motion.div>
      )
      }
    </div >
  );
};

export default SuperadminDashboard;
