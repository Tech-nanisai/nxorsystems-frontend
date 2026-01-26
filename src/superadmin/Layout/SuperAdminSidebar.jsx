//frontend/src/superadmin/Layout/SuperAdminSidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./SuperAdminSidebar.css";

import {
  FaThLarge,
  FaUsers,
  FaUserGraduate,
  FaIdCard,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft
} from "react-icons/fa";

const SuperAdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { superAdmin, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  // Helper to check active route
  const isActive = (path) => location.pathname === path;

  // Handle mobile close on navigation
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const displayName = superAdmin?.fullName || superAdmin?.name || "Super Admin";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* MOBILE BACKDROP */}
      <div
        className={`superadminsidebar-backdrop ${sidebarOpen ? "visible" : ""
          }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* SIDEBAR */}
      <aside
        className={`superadminsidebar-wrapper ${sidebarOpen ? "superadminsidebar-open" : "superadminsidebar-closed"
          }`}
      >
        {/* HEADER */}
        <div className="superadminsidebar-header">
          <div>
            <div className="superadminsidebar-brand">NXOR SYSTEMS</div>
            <span className="superadminsidebar-brand-sub">CEO PORTAL</span>
          </div>
          {/* Close Toggle for Sidebar */}
          <button
            className="superadminsidebar-close-toggle"
            onClick={() => setSidebarOpen(false)}
            title="Collapse Sidebar"
          >
            <FaChevronLeft />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="superadminsidebar-nav">
          <Link
            to="/superadmin/dashboard"
            className={`superadminsidebar-nav-item ${isActive("/superadmin/dashboard") ? "active" : ""
              }`}
            onClick={handleNavClick}
          >
            <FaThLarge className="superadminsidebar-nav-icon" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/superadmin/client-management"
            className={`superadminsidebar-nav-item ${isActive("/superadmin/client-management") ? "active" : ""
              }`}
            onClick={handleNavClick}
          >
            <FaUsers className="superadminsidebar-nav-icon" />
            <span>Client Management</span>
          </Link>

          <Link
            to="/superadmin/student-management"
            className={`superadminsidebar-nav-item ${isActive("/superadmin/student-management") ? "active" : ""
              }`}
            onClick={handleNavClick}
          >
            <FaUserGraduate className="superadminsidebar-nav-icon" />
            <span>Student Management</span>
          </Link>

          <Link
            to="/superadmin/idgeneration"
            className={`superadminsidebar-nav-item ${isActive("/superadmin/idgeneration") ? "active" : ""
              }`}
            onClick={handleNavClick}
          >
            <FaIdCard className="superadminsidebar-nav-icon" />
            <span>ID Generation</span>
          </Link>

          <Link
            to="/superadmin/updates"
            className={`superadminsidebar-nav-item ${isActive("/superadmin/updates") ? "active" : ""
              }`}
            onClick={handleNavClick}
          >
            <FaHistory className="superadminsidebar-nav-icon" />
            <span>Updates</span>
          </Link>
        </nav>

        {/* FOOTER / PROFILE */}
        <div className="superadminsidebar-footer">
          <div
            className="superadminsidebar-profile-card"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="superadminsidebar-avatar">{initials}</div>
            <div className="superadminsidebar-user-info">
              <span className="superadminsidebar-user-name">{displayName}</span>
              <span className="superadminsidebar-user-role">Super Admin</span>
            </div>
            {profileOpen ? (
              <FaChevronUp className="superadminsidebar-chevron" />
            ) : (
              <FaChevronDown className="superadminsidebar-chevron" />
            )}
          </div>

          {/* DROPDOWN */}
          {profileOpen && (
            <div className="superadminsidebar-menu">
              <Link
                to="/superadmin/profile"
                className="superadminsidebar-menu-item"
                onClick={handleNavClick}
              >
                <FaUserCircle /> Profile
              </Link>
              <Link
                to="/superadmin/account-settings"
                className="superadminsidebar-menu-item"
                onClick={handleNavClick}
              >
                <FaCog /> Settings
              </Link>
              <div
                className="superadminsidebar-menu-item logout"
                onClick={() => {
                  logout();
                  handleNavClick();
                }}
              >
                <FaSignOutAlt /> Logout
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default SuperAdminSidebar;
