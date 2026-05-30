import React, { useState, useRef, useEffect } from "react";
import "./ClientNavbar.css";
import CompanyLogo from "../../assets/logos/nxor-logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useClientAuth } from "../../context/ClientAuthContext";

import {
  FaHome,
  FaFolder,
  FaSync,
  FaTasks,
  FaMoneyBill,
  FaHeadset,
  FaEnvelope,
  FaFileAlt,
  FaCog,
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
  FaChevronRight
} from "react-icons/fa";

const NAV_ITEMS = [
  { id: "Dashboard", label: "Dashboard", icon: <FaHome />, route: "/client/dashboard" },
  { id: "Projects", label: "Projects", icon: <FaFolder />, route: "/client/projects" },
  { id: "Updates", label: "Updates", icon: <FaSync />, route: "/client/updates" },
  { id: "Tasks", label: "Tasks", icon: <FaTasks />, route: "/client/tasks" },
  { id: "Payments", label: "Payments", icon: <FaMoneyBill />, route: "/client/payments" },
  { id: "Support", label: "Support", icon: <FaHeadset />, route: "/client/support" },
  { id: "Messages", label: "Messages", icon: <FaEnvelope />, route: "/client/messages" },
  { id: "Documents", label: "Documents", icon: <FaFileAlt />, route: "/client/documents" },
  { id: "Settings", label: "Settings", icon: <FaCog />, route: "/client/settings" },
];

const ClientNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const { client, logoutClient } = useClientAuth();

  const activeRoute = NAV_ITEMS.find(item => location.pathname.startsWith(item.route))?.id;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="client-mobile-header">
        <div className="mobile-brand-group">
          <FaBars className="client-mobile-menu-icon" onClick={toggleMenu} />
          <h3 className="client-mobile-title">NXOR <span>CLIENT</span></h3>
        </div>
        <div className="mobile-user-mini">
          {client?.profilePicture ? <img src={client.profilePicture} alt="User" /> : <FaUserCircle />}
        </div>
      </div>

      {/* SIDEBAR */}
      <div
        ref={sidebarRef}
        className={`client-sidebar-container ${menuOpen ? "open" : ""}`}
      >
        {/* LOGO AREA */}
        <div className="client-sidebar-top" style={{ padding: '20px 24px' }}>
          <div className="sidebar-brand-box" style={{ justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <img src={CompanyLogo} alt="NXOR Systems" className="client-sidebar-logo-img" style={{ height: '32px', width: 'auto' }} />
              <span style={{ fontSize: '8px', fontWeight: 600, color: '#94a3b8', letterSpacing: '5.5px', marginRight: '-5.5px', textTransform: 'uppercase', marginTop: '1px' }}>SYSTEMS</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="client-sidebar-scroll-area">
          <div className="client-sidebar-menu-title">MAIN MENU</div>
          <nav className="client-sidebar-menu">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.id}
                className={`client-sidebar-item ${activeRoute === item.id ? "active" : ""}`}
                onClick={() => {
                  navigate(item.route);
                  setMenuOpen(false);
                }}
              >
                <span className="client-sidebar-item-icon">{item.icon}</span>
                <span className="client-sidebar-item-label">{item.label}</span>
                {activeRoute === item.id && <FaChevronRight className="active-arrow" />}
              </div>
            ))}
          </nav>
        </div>

        {/* USER PROFILE & LOGOUT */}
        <div className="client-sidebar-footer">
          <div className="glass-user-card">
            <div className="sidebar-user-profile">
              <div className="sidebar-user-avatar">
                {client?.profilePicture ? (
                  <img src={client.profilePicture} alt="User" />
                ) : (
                  <FaUserCircle />
                )}
              </div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">
                  {client?.fullName || "Client User"}
                </span>
                <span className="sidebar-user-role">Premium Account</span>
              </div>
            </div>

            <button className="sidebar-logout-btn" onClick={logoutClient} title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        </div>

      </div>

      {/* MOBILE OVERLAY BACKDROP */}
      {menuOpen && <div className="mobile-backdrop" onClick={() => setMenuOpen(false)}></div>}
    </>
  );
};

export default ClientNavbar;