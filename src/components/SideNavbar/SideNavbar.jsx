// frontend/src/components/SideNavbar/SideNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBars,
  FaTimes, // Used for close button
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaServicestack,
  FaBriefcase,
  FaCommentAlt,
  FaEnvelope,
  FaSignInAlt,
  FaUserTie,
  FaUserShield,
  FaUserCircle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./SideNavbar.css";
import CompanyLogo from "../../assets/logos/nxor-logo.png";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { userRole, superAdmin, admin, client, logout } = useAuth();
  const sidebarRef = useRef(null); // sidebarRef is kept as it was in the original code, though its specific outside-click useEffect is removed in favor of backdrop.

  // ACTIVE USER
  let activeUser = null;
  if (userRole === "superadmin") activeUser = superAdmin;
  else if (userRole === "admin") activeUser = admin;
  else if (userRole === "client") activeUser = client;

  const userName =
    activeUser?.fullName ||
    activeUser?.fullname ||
    activeUser?.name ||
    activeUser?.clientId ||
    activeUser?.adminId ||
    "User";

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const handleServicesToggle = () => setIsServicesOpen(!isServicesOpen);
  const handleClientMenuToggle = () => setIsClientMenuOpen(!isClientMenuOpen);

  const goTo = (route) => {
    navigate(route);
    toggleSidebar();
  };

  const handleLogout = () => {
    logout();
    toggleSidebar();
  };

  // Sidebar Variants
  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", opacity: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  const backdropVariants = {
    open: { opacity: 1, pointerEvents: "auto" },
    closed: { opacity: 0, pointerEvents: "none" },
  };

  const menuVariants = {
    closed: { height: 0, opacity: 0 },
    open: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="SideNavbar-backdrop"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={toggleSidebar}
          />

          {/* SIDEBAR DRAWER */}
          <motion.div
            className="SideNavbar-container"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* HEADER */}
            <div className="SideNavbar-header">
              <Link to="/" onClick={toggleSidebar} className="SideNavbar-logo-link" style={{ flexDirection: "column", gap: "2px", alignItems: "center" }}>
                <img src={CompanyLogo} alt="NXOR Logo" className="SideNavbar-logo" style={{ height: "32px", width: "auto" }} />
                <span className="SideNavbar-brand-sub" style={{ fontSize: "8px", letterSpacing: "5.5px", marginRight: "-5.5px", marginTop: "1px" }}>SYSTEMS</span>
              </Link>
              <button className="SideNavbar-close-btn" onClick={toggleSidebar}>
                <FaTimes />
              </button>
            </div>

            {/* CONTENT SCROLL AREA */}
            <div className="SideNavbar-content">

              {/* MAIN NAVIGATION */}
              <div className="SideNavbar-section">
                <p className="SideNavbar-section-title">Menu</p>
                <div className="SideNavbar-nav-item" onClick={() => goTo("/")}>
                  <FaHome className="SideNavbar-icon" /> Home
                </div>

                {/* Services Group */}
                <div className={`SideNavbar-nav-item ${isServicesOpen ? 'active' : ''}`} onClick={handleServicesToggle}>
                  <div className="SideNavbar-nav-item-header">
                    <span><FaServicestack className="SideNavbar-icon" /> Services</span>
                    {isServicesOpen ? <FaChevronUp className="SideNavbar-arrow" /> : <FaChevronDown className="SideNavbar-arrow" />}
                  </div>
                </div>
                <AnimatePresence>
                  {isServicesOpen && (
                    <motion.div
                      className="SideNavbar-submenu"
                      variants={menuVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <div className="SideNavbar-subitem" onClick={() => goTo("/services/entertainment")}>Entertainment Reels</div>
                      <div className="SideNavbar-subitem" onClick={() => goTo("/services/designs")}>Creative Designs & Posters</div>
                      <div className="SideNavbar-subitem" onClick={() => goTo("/services/platforms")}>Technical Business Platforms</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="SideNavbar-nav-item" onClick={() => goTo("/portfolio")}>
                  <FaBriefcase className="SideNavbar-icon" /> Portfolio
                </div>
                <div className="SideNavbar-nav-item" onClick={() => goTo("/contact")}>
                  <FaEnvelope className="SideNavbar-icon" /> Contact
                </div>
              </div>

              {/* USER SECTION */}
              <div className="SideNavbar-divider" />
              <div className="SideNavbar-section">
                <p className="SideNavbar-section-title">Account</p>

                {userRole ? (
                  // LOGGED IN
                  <div className="SideNavbar-account-group">
                    <div className="SideNavbar-user-profile" onClick={handleClientMenuToggle}>
                      <div className="SideNavbar-avatar-placeholder">
                        {userName.charAt(0)}
                      </div>
                      <div className="SideNavbar-user-info">
                        <span className="SideNavbar-user-name">{userName}</span>
                        <span className="SideNavbar-user-role">{userRole}</span>
                      </div>
                      {isClientMenuOpen ? <FaChevronUp className="SideNavbar-arrow" /> : <FaChevronDown className="SideNavbar-arrow" />}
                    </div>

                    <AnimatePresence>
                      {isClientMenuOpen && (
                        <motion.div
                          className="SideNavbar-submenu"
                          variants={menuVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                        >
                          {/* SuperAdmin Links */}
                          {userRole === "superadmin" && (
                            <>
                              <div className="SideNavbar-subitem" onClick={() => goTo("/superadmin/dashboard")}>Dashboard</div>
                              <div className="SideNavbar-subitem" onClick={() => goTo("/superadmin/client-management")}>Clients</div>
                            </>
                          )}
                          {/* Client Links */}
                          {userRole === "client" && (
                            <>
                              <div className="SideNavbar-subitem" onClick={() => goTo("/client/dashboard")}>Dashboard</div>
                              <div className="SideNavbar-subitem" onClick={() => goTo("/client/projects")}>Projects</div>
                            </>
                          )}
                          {/* Admin Links */}
                          {userRole === "admin" && (
                            <>
                              <div className="SideNavbar-subitem" onClick={() => goTo("/admin/dashboard")}>Dashboard</div>
                            </>
                          )}

                          <div className="SideNavbar-subitem logout" onClick={handleLogout}>Logout</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  // GUEST -> Login Options
                  <div className="SideNavbar-auth-list">
                    <div className="SideNavbar-auth-btn" onClick={() => goTo("/client/signIn")}>
                      <FaUserTie className="SideNavbar-icon" /> Client Sign In
                    </div>
                    <div className="SideNavbar-auth-btn" onClick={() => goTo("/user/signIn")}>
                      <FaUser className="SideNavbar-icon" /> User Sign In
                    </div>
                    <div className="SideNavbar-auth-btn" onClick={() => goTo("/admin/signIn")}>
                      <FaUserShield className="SideNavbar-icon" /> Admin Sign In
                    </div>
                    <div className="SideNavbar-auth-btn" onClick={() => goTo("/superadmin/login")}>
                      <FaUserCircle className="SideNavbar-icon" /> Super Admin
                    </div>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;

