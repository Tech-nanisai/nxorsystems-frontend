// frontend/src/components/TopNavbar/TopNavbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle, FaChevronDown, FaSignInAlt, FaUserShield, FaUserGraduate, FaUserTie } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../SideNavbar/SideNavbar.jsx";
import CompanyLogo from "../Images/TechnanisaiPNG.png";
import "./TopNavbar.css";
import { useAuth } from "../../context/AuthContext";
import UserProfileCard from "../UserProfileCard/UserProfileCard";

const Topbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);

  // Auth & Routing
  const { userRole, superAdmin, admin, client, student } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileAreaRef = useRef(null);
  // Separate ref for Auth Dropdown to handle click outside
  const authDropdownRef = useRef(null);

  // Detect Scroll for Glass Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile card on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Profile Card Logic
      if (showProfileCard && profileAreaRef.current && !profileAreaRef.current.contains(e.target)) {
        setShowProfileCard(false);
      }
      // Auth Dropdown Logic
      if (isAuthOpen && authDropdownRef.current && !authDropdownRef.current.contains(e.target)) {
        setIsAuthOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileCard, isAuthOpen]);

  // Determine Active User
  let activeUser = null;
  if (userRole === "superadmin") activeUser = superAdmin;
  else if (userRole === "admin") activeUser = admin;
  else if (userRole === "client") activeUser = client;
  else if (userRole === "student") activeUser = student;

  // Get Greeting Name
  const getGreetingName = () => {
    if (!activeUser) return "";
    const name = activeUser.fullName || activeUser.fullname || activeUser.name || activeUser.clientId || activeUser.studentId || "";
    return name.trim().split(" ").pop().toUpperCase();
  };
  const greetingName = getGreetingName();
  const activeUserAvatar = activeUser?.profilePicture || activeUser?.profilePic || "";
  const activeUserEmail = activeUser?.email || "";

  // Handlers
  const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);
  const toggleProfileCard = () => {
    if (userRole) setShowProfileCard((prev) => !prev);
  };

  const handleLoginSelect = (rolePath) => {
    navigate(rolePath);
    setIsAuthOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Animation Variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 15, scale: 0.95 }
  };

  return (
    <>
      <motion.nav
        className={`TopNavbar-container ${isScrolled ? "TopNavbar-scrolled" : ""}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="TopNavbar-content">

          {/* LOGO AREA */}
          <Link to="/" className="TopNavbar-logo-wrapper">
            <img src={CompanyLogo} className="TopNavbar-logo-img" alt="NXOR Systems" />
            <div className="TopNavbar-company-text">
              <span className="TopNavbar-brand-primary">NXOR</span>
              <span className="TopNavbar-brand-secondary">SYSTEMS</span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="TopNavbar-desktop-menu">
            <Link to="/" className={`TopNavbar-link ${isActive("/") ? "TopNavbar-active" : ""}`}>
              Home
            </Link>

            {/* Services Dropdown */}
            <div
              className={`TopNavbar-link-wrapper ${isActive("/servicelearn") ? "TopNavbar-active" : ""}`}
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <div className="TopNavbar-link TopNavbar-dropdown-trigger">
                Services <FaChevronDown className={`TopNavbar-chevron ${isServicesOpen ? "TopNavbar-rotate" : ""}`} />
              </div>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    className="TopNavbar-dropdown-menu"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                  >
                    <Link to="/servicelearn" className="TopNavbar-dropdown-item">Learn Port</Link>
                    <Link to="/servicesUIUX" className="TopNavbar-dropdown-item">UI/UX Design</Link>
                    <Link to="/servicesweb" className="TopNavbar-dropdown-item">Web Application</Link>
                    <Link to="/servicesAPIs" className="TopNavbar-dropdown-item">API Development</Link>
                    <Link to="/servicesmaintanance" className="TopNavbar-dropdown-item">Maint. & Support</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/portfolio" className={`TopNavbar-link ${isActive("/portfolio") ? "TopNavbar-active" : ""}`}>
              Portfolio
            </Link>
            <Link to="/testimonials" className={`TopNavbar-link ${isActive("/testimonials") ? "TopNavbar-active" : ""}`}>
              Testimonials
            </Link>
            <Link to="/contact" className={`TopNavbar-link ${isActive("/contact") ? "TopNavbar-active" : ""}`}>
              Contact
            </Link>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="TopNavbar-actions">

            {/* AUTH / PROFILE SECTION */}
            {userRole ? (
              // LOGGED IN VIEW
              <div className="TopNavbar-user-btn" onClick={toggleProfileCard} ref={profileAreaRef}>
                {activeUserAvatar ? (
                  <img src={activeUserAvatar} alt="Profile" className="TopNavbar-avatar" />
                ) : (
                  <FaUserCircle className="TopNavbar-user-icon" />
                )}
                <span className="TopNavbar-username">Hi, {greetingName}</span>

                {/* Profile Card Popup */}
                <AnimatePresence>
                  {showProfileCard && (
                    <motion.div
                      className="TopNavbar-profile-popup-wrapper"
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    >
                      <UserProfileCard userRole={userRole} userData={activeUser} email={activeUserEmail} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // GUEST VIEW -> SIGN IN DROPDOWN
              <div className="TopNavbar-auth-wrapper" ref={authDropdownRef}>
                <button
                  className={`TopNavbar-btn-signin ${isAuthOpen ? 'active' : ''}`}
                  onClick={() => setIsAuthOpen(!isAuthOpen)}
                >
                  <FaSignInAlt className="TopNavbar-icon-sm" />
                  <span>Sign In</span>
                  <FaChevronDown className={`TopNavbar-chevron ${isAuthOpen ? "TopNavbar-rotate" : ""}`} />
                </button>

                <AnimatePresence>
                  {isAuthOpen && (
                    <motion.div
                      className="TopNavbar-auth-dropdown"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="TopNavbar-auth-item" onClick={() => handleLoginSelect("/client/signIn")}>
                        <div className="TopNavbar-auth-icon-box"><FaUserTie /></div>
                        <span>Client Login</span>
                      </div>
                      <div className="TopNavbar-auth-item" onClick={() => handleLoginSelect("/student/signIn")}>
                        <div className="TopNavbar-auth-icon-box"><FaUserGraduate /></div>
                        <span>Student Login</span>
                      </div>
                      <div className="TopNavbar-auth-item" onClick={() => handleLoginSelect("/admin/signIn")}>
                        <div className="TopNavbar-auth-icon-box"><FaUserShield /></div>
                        <span>Admin Login</span>
                      </div>
                      <div className="TopNavbar-auth-item" onClick={() => handleLoginSelect("/superadmin/login")}>
                        <div className="TopNavbar-auth-icon-box"><FaUserCircle /></div>
                        <span>Super Admin</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Toggle */}
            <div className="TopNavbar-mobile-toggle" onClick={handleSidebarToggle}>
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE SIDEBAR COMPONENT */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />
    </>
  );
};

export default Topbar;
