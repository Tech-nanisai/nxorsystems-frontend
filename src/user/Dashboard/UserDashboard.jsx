// frontend/src/user/Dashboard/UserDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaCog,
  FaShoppingBag,
  FaChartLine,
  FaRegPlayCircle,
  FaRegImages,
  FaArrowRight,
  FaCheckCircle,
  FaLock,
  FaCamera,
  FaChevronLeft,
  FaChevronRight,
  FaPhoneAlt,
  FaSignOutAlt,
  FaBars,
  FaClipboardList,
  FaRegEye,
  FaMagic,
  FaCloudDownloadAlt
} from "react-icons/fa";
import SecureReelPlayer from "../../components/common/SecureReelPlayer/SecureReelPlayer";
import ContactModal from "../../components/Home/ContactModal";
import CompanyLogoDark from "../../assets/logos/nxor-logo-dark.png";
import "./UserDashboard.css";
import axios from "axios";
import { API_BASE_URL } from "../../config";


// --- SECURE IMAGE PLAYER SUB-COMPONENT (Screenshot & download protected) ---
const SecureImagePlayer = ({ imageUrl, title }) => {
  const [isFocused, setIsFocused] = useState(true);
  const [securityAlert, setSecurityAlert] = useState(false);

  const triggerSecurityAlert = () => {
    setSecurityAlert(true);
    setTimeout(() => setSecurityAlert(false), 4500);
  };

  useEffect(() => {
    const onBlur = () => setIsFocused(false);
    const onFocus = () => setIsFocused(true);

    const onVisibilityChange = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        setIsFocused(false);
        navigator.clipboard?.writeText('').catch(() => { });
      } else {
        setIsFocused(true);
      }
    };

    const onKeyDown = (e) => {
      const blocked = [
        e.key === 'PrintScreen',
        e.key === 'F12',
        e.ctrlKey && e.shiftKey && ['I', 'i', 'C', 'c', 'J', 'j', 'K', 'k'].includes(e.key),
        e.ctrlKey && ['u', 'U', 's', 'S'].includes(e.key),
        e.metaKey && ['s', 'S'].includes(e.key),
      ];
      if (blocked.some(Boolean)) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityAlert();
        navigator.clipboard?.writeText('').catch(() => { });
        return false;
      }
    };

    const onKeyUp = (e) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard?.writeText('').catch(() => { });
        triggerSecurityAlert();
      }
    };

    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);

    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
    };
  }, []);

  return (
    <div
      className={`SecureImagePlayer-container ${!isFocused ? 'blurred' : ''}`}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#080b14',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserDrag: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        isolation: 'isolate',
        transform: 'translateZ(0)',
        willChange: 'transform'
      }}
    >
      <img
        src={imageUrl}
        alt={title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
          WebkitUserDrag: 'none',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          transition: !isFocused ? 'filter 0.4s ease' : 'none',
          filter: !isFocused ? 'blur(28px)' : 'none'
        }}
      />

      {/* Focus Lost — Security Shield */}
      {!isFocused && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 80,
          background: 'rgba(4, 6, 10, 0.9)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '28px',
          color: '#ffffff'
        }}>
          <span style={{ fontSize: '38px', color: '#ffc107', marginBottom: '12px' }}>⚠️</span>
          <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 10px 0' }}>NXOR Secure Content</h3>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0, maxWidth: '240px', lineHeight: '1.5' }}>
            Creative visuals protected. Return to this tab to resume viewing.
          </p>
        </div>
      )}

      {/* Security Alert Toast */}
      {securityAlert && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '16px',
          right: '16px',
          zIndex: 100,
          background: 'rgba(220, 38, 38, 0.95)',
          backdropFilter: 'blur(14px)',
          borderRadius: '12px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 8px 24px rgba(220, 38, 38, 0.3)',
          fontSize: '11px',
          fontWeight: '500',
          color: '#ffffff'
        }}>
          <span>🛡️ Recording and capture is disabled for this private creative asset.</span>
        </div>
      )}
    </div>
  );
};

// --- DATA ---
const carouselSlides = [
  {
    image: "https://res.cloudinary.com/dexueorjm/image/upload/v1779966863/NXOR_LinkedIn_banner_wxqm1o.png",
    title: "HOOK YOUR AUDIENCE INSTANTLY",
    subtitle: "Premium Cinematic Reels Editing optimized for maximum audience retention and high-tempo beat syncing.",
    category: "reels"
  },
  {
    image: "https://res.cloudinary.com/dexueorjm/image/upload/v1779966871/promotion1_l0momw.png",
    title: "CREATIVE DESIGNS THAT CONVERT",
    subtitle: "Bespoke Event Posters and High-CTR YouTube Thumbnails engineered with premium contrast and bold typography.",
    category: "designs"
  },
  {
    image: "https://res.cloudinary.com/dexueorjm/image/upload/v1779277913/ChatGPT_Image_May_16_2026_10_22_33_PM_bnwyar.png",
    title: "AESTHETIC BRAND COMPOSTING",
    subtitle: "Leverage master-level visual color grading LUTs and custom social media advertising campaign assets.",
    category: "designs"
  }
];

const reelsProducts = [
  {
    id: "reel-1",
    title: "Cinematic Travel & Lifestyle",
    instagram: "@rupavathi.g",
    videoUrl: "https://res.cloudinary.com/dexueorjm/video/upload/v1779453023/Rupavathi_Gari_reel._vlz4nf.mp4",
    desc: "Hook-focused editing and premium lifestyle travel color grading."
  },
  {
    id: "reel-2",
    title: "High-Energy Pacing Sync",
    instagram: "@ruthvika.fit",
    videoUrl: "https://res.cloudinary.com/dexueorjm/video/upload/v1779280450/Ruthvika_project_htimbd.mp4",
    desc: "120 BPM precise sound effect beat syncing and kinetic captions."
  },
  {
    id: "reel-3",
    title: "Dynamic Adventure Promo",
    instagram: "@nxor.creative",
    videoUrl: "https://res.cloudinary.com/dexueorjm/video/upload/v1779280429/VN20260331_020852_nqam16.mp4",
    desc: "High watch-retention edits and cinematic contrast grading."
  }
];

const postersProducts = [
  {
    url: "https://res.cloudinary.com/dexueorjm/image/upload/v1779278244/9877972_4297769_eowzbh.jpg",
    title: "Vibrant College Celebration",
    category: "Event Poster"
  },
  {
    url: "https://res.cloudinary.com/dexueorjm/image/upload/v1779278566/3547973_qe7dds.jpg",
    title: "Vibe Music Festival Layout",
    category: "Music Event"
  },
  {
    url: "https://res.cloudinary.com/dexueorjm/image/upload/v1779278252/30124113_7622855_hcaemu.jpg",
    title: "Silver Marriage Anniversary",
    category: "Milestone Invite"
  },
  {
    url: "https://res.cloudinary.com/dexueorjm/image/upload/v1779278565/5704179_oqxqnk.jpg",
    title: "Premium Birthday Celebration",
    category: "Milestone Invite"
  },
  {
    url: "https://res.cloudinary.com/dexueorjm/image/upload/v1773997904/naswa_logo_fwgaye.png",
    title: "Naswa Campaign Branding",
    category: "Digital Ad"
  }
];

const processSteps = [
  {
    icon: <FaClipboardList />,
    title: "Gather Details",
    desc: "We collect your brief, creative goals, and raw files."
  },
  {
    icon: <FaRegEye />,
    title: "Analyze Details",
    desc: "Our directors evaluate raw pacing and design requirements."
  },
  {
    icon: <FaMagic />,
    title: "Execute Best Work",
    desc: "Our editors craft master color grading and kinetic styles."
  },
  {
    icon: <FaCloudDownloadAlt />,
    title: "Deliver Work",
    desc: "We deliver secure, full-resolution assets immediately."
  }
];

// --- DRAG SCROLL HOOK ---
const useDragScroll = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false;

    const handleMouseDown = (e) => {
      isDown = true;
      el.style.scrollBehavior = "auto";
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      isDragging = false;
    };

    const handleMouseLeave = () => {
      isDown = false;
      el.style.scrollBehavior = "";
    };

    const handleMouseUp = () => {
      isDown = false;
      el.style.scrollBehavior = "";
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 5) {
        isDragging = true;
      }
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("mousedown", handleMouseDown);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("mouseup", handleMouseUp);
    el.addEventListener("mousemove", handleMouseMove);

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mouseup", handleMouseUp);
      el.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return ref;
};

const getSlideImage = (img) => {
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) {
    return img;
  }
  return `${API_BASE_URL}/${img}`;
};

const UserDashboard = () => {
  const { getActiveUser, token, logout, updateGeneralUserProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const user = getActiveUser();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [reels, setReels] = useState(reelsProducts);
  const [posters, setPosters] = useState(postersProducts);
  const [purchases, setPurchases] = useState([]);

  // Fetch fresh user data whenever activeTab shifts to 'orders' or on mount
  useEffect(() => {
    const fetchFreshUser = async () => {
      const userToken = token || sessionStorage.getItem("TOKEN");
      if (!userToken) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/api/user/auth/me`, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        if (res.data.success && res.data.user) {
          setPurchases(res.data.user.purchases || []);
          updateGeneralUserProfile(res.data.user);
        }
      } catch (err) {
        console.error("Error loading fresh user profile:", err);
      }
    };

    if (activeTab === "orders" || activeTab === "profile" || activeTab === "overview") {
      fetchFreshUser();
    }
  }, [activeTab, token]);

  useEffect(() => {
    const fetchRegisteredData = async () => {
      try {
        const reelsRes = await axios.get(`${API_BASE_URL}/api/superadmin/entertainment-reels/all?audience=registered`);
        if (reelsRes.data.success && reelsRes.data.reels && reelsRes.data.reels.length > 0) {
          const flattenedReels = reelsRes.data.reels.flatMap(reel => 
            reel.videos.map((vid, idx) => ({
              id: `${reel._id}-${idx}`,
              title: vid.title,
              instagram: reel.instagram || "@nxor.creative",
              videoUrl: vid.videoUrl.startsWith("http") ? vid.videoUrl : `${API_BASE_URL}/${vid.videoUrl}`,
              desc: reel.comment
            }))
          );
          if (flattenedReels.length > 0) {
            setReels(flattenedReels);
          }
        }
      } catch (err) {
        console.error("Error fetching registered reels:", err);
      }

      try {
        const designsRes = await axios.get(`${API_BASE_URL}/api/superadmin/creative-designs/all?audience=registered`);
        if (designsRes.data.success && designsRes.data.designs && designsRes.data.designs.length > 0) {
          const formattedPosters = designsRes.data.designs.map(design => ({
            url: design.url.startsWith("http") ? design.url : `${API_BASE_URL}/${design.url}`,
            title: design.title,
            category: design.category
          }));
          setPosters(formattedPosters);
        }
      } catch (err) {
        console.error("Error fetching registered designs:", err);
      }
    };

    fetchRegisteredData();
  }, []);

  // Settings form states
  const [settingsName, setSettingsName] = useState("");
  const [settingsPhone, setSettingsPhone] = useState("");

  // Synchronize settings form state with context user details
  useEffect(() => {
    if (user) {
      setSettingsName(user.fullName || "");
      setSettingsPhone(user.phone || "");
    }
  }, [user]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (!settingsName.trim()) {
      alert("Name field cannot be empty.");
      return;
    }
    updateGeneralUserProfile({
      fullName: settingsName.trim(),
      phone: settingsPhone.trim(),
    });
    alert("Profile configurations updated successfully!");
  };

  const handleReelsScroll = (direction) => {
    const el = reelsScrollRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleDesignsScroll = (direction) => {
    const el = designsScrollRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };


  // Carousel State
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [slides, setSlides] = useState(carouselSlides);

  // Fetch flagship slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/global/flagship-offerings/all`);
        if (res.data.success && res.data.slides && res.data.slides.length > 0) {
          setSlides(res.data.slides);
        }
      } catch (err) {
        console.error("Error fetching flagship slides:", err);
      }
    };
    fetchSlides();
  }, []);

  // Modal State
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactCategory, setContactCategory] = useState("reels");

  // Lightbox Modal State
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const [lightboxTitle, setLightboxTitle] = useState("");

  // Drag Scroll Refs
  const reelsScrollRef = useDragScroll();
  const designsScrollRef = useDragScroll();

  // Sync Tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam && ["overview", "profile", "settings", "orders"].includes(tabParam)) {
      setActiveTab(tabParam);
    } else {
      setActiveTab("overview");
    }
  }, [location]);

  // Carousel Auto-rotation Effect (5 seconds)
  useEffect(() => {
    if (activeTab !== "overview" || slides.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeTab, slides.length]);

  if (!user) {
    return (
      <div className="UserDashboard-loading-container">
        <div className="UserDashboard-spinner"></div>
      </div>
    );
  }

  const handleTabChange = (tabName) => {
    navigate(`/user?tab=${tabName}`);
    setIsMobileMenuOpen(false);
  };

  const openContactModal = (category) => {
    setContactCategory(category);
    setIsContactModalOpen(true);
  };

  const displayName = user.fullName || "Customer";
  const initials = displayName.charAt(0).toUpperCase();

  const tabContentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3 } }
  };

  return (
    <div className="UserDashboard-page-container">
      {/* Ambient background glows */}
      <div className="UserDashboard-glow-orb-1"></div>
      <div className="UserDashboard-glow-orb-2"></div>

      {/* Floating Sticky Mobile Header */}
      <div className="UserDashboard-mobile-header">
        <button
          className="UserDashboard-mobile-hamburger-btn"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open Navigation"
        >
          <FaBars />
        </button>
        <div className="UserDashboard-mobile-logo">
          <img src={CompanyLogoDark} alt="NXOR Systems" />
          <span className="UserDashboard-mobile-logo-systems">SYSTEMS</span>
        </div>
        <div style={{ width: "32px" }}></div>
      </div>

      {/* Sidebar Mobile Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="UserDashboard-sidebar-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <div className="UserDashboard-layout-wrapper">

        {/* COLLAPSIBLE SIDEBAR */}
        <aside className={`UserDashboard-sidebar ${isSidebarCollapsed ? "collapsed" : ""} ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          <div className="UserDashboard-sidebar-header">
            <div className="UserDashboard-sidebar-logo">
              <img
                src={CompanyLogoDark}
                alt="NXOR Systems"
              />
              <span className="UserDashboard-sidebar-systems">SYSTEMS</span>
            </div>

            <button
              className="UserDashboard-sidebar-toggle-btn"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? "Expand Menu" : "Collapse Menu"}
            >
              <FaBars />
            </button>

            <button
              className="UserDashboard-sidebar-close-btn"
              onClick={() => setIsMobileMenuOpen(false)}
              title="Close Menu"
            >
              &times;
            </button>
          </div>

          <div className="UserDashboard-sidebar-menu">
            <button
              className={`UserDashboard-sidebar-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => handleTabChange("overview")}
              title="Overview"
            >
              <FaChartLine className="UserDashboard-sidebar-icon" />
              <span className="UserDashboard-sidebar-label">Overview</span>
            </button>
            <button
              className={`UserDashboard-sidebar-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => handleTabChange("profile")}
              title="My Profile"
            >
              <FaUser className="UserDashboard-sidebar-icon" />
              <span className="UserDashboard-sidebar-label">My Profile</span>
            </button>
            <button
              className={`UserDashboard-sidebar-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => handleTabChange("settings")}
              title="Settings"
            >
              <FaCog className="UserDashboard-sidebar-icon" />
              <span className="UserDashboard-sidebar-label">Settings</span>
            </button>
            <button
              className={`UserDashboard-sidebar-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => handleTabChange("orders")}
              title="My Orders"
            >
              <FaShoppingBag className="UserDashboard-sidebar-icon" />
              <span className="UserDashboard-sidebar-label">My Orders</span>
            </button>

            <div className="UserDashboard-sidebar-spacer"></div>

            <button
              className="UserDashboard-sidebar-item UserDashboard-sidebar-logout"
              onClick={logout}
              title="Logout"
            >
              <FaSignOutAlt className="UserDashboard-sidebar-icon" />
              <span className="UserDashboard-sidebar-label">Logout</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className={`UserDashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
          <div className="UserDashboard-content-wrapper">




            {/* ========================================================
           TABBED CONTENT BODY
           ======================================================== */}
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview-tab-landing"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="UserDashboard-tab-view"
                >

                  {/* ========================================================
                 SECTION 1: HERO CAROUSEL
                 ======================================================== */}
                  <section className="UserDashboard-carousel-section">
                    <div className="UserDashboard-carousel-wrapper">
                      <AnimatePresence mode="wait">
                        {slides.length > 0 && (
                          <motion.div
                            key={carouselIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="UserDashboard-carousel-slide"
                            style={{
                              backgroundImage: `linear-gradient(to bottom, rgba(8, 11, 20, 0.45), rgba(8, 11, 20, 0.85)), url(${getSlideImage(slides[carouselIndex]?.image)})`
                            }}
                          >
                            <div className="UserDashboard-carousel-overlay-text">
                              <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="UserDashboard-carousel-tag"
                              >
                                NXOR Flagship Offering
                              </motion.span>
                              <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="UserDashboard-carousel-title"
                              >
                                {slides[carouselIndex]?.title}
                              </motion.h2>
                              <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="UserDashboard-carousel-subtitle"
                              >
                                {slides[carouselIndex]?.subtitle}
                              </motion.p>
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="UserDashboard-carousel-cta-area"
                              >
                                <button
                                  className="UserDashboard-carousel-btn-started"
                                  onClick={() => openContactModal(slides[carouselIndex]?.category)}
                                >
                                  <span>Get Started</span> <FaArrowRight />
                                </button>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Carousel Page Indicators */}
                      <div className="UserDashboard-carousel-dots">
                        {slides.map((_, dotIdx) => (
                          <span
                            key={dotIdx}
                            className={`UserDashboard-carousel-dot ${dotIdx === carouselIndex ? "active" : ""}`}
                            onClick={() => setCarouselIndex(dotIdx)}
                          ></span>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* ========================================================
                 SECTION 2: ENTERTAINMENT REELS EDITING (Horizontal Drag-Scroll with Navigation)
                 ======================================================== */}
                  <section className="UserDashboard-showroom-section">
                    <div className="UserDashboard-section-header-block">
                      <h2 className="UserDashboard-showroom-title UserDashboard-showroom-title-reels">
                        <FaRegPlayCircle className="UserDashboard-showroom-title-icon-blue" />
                        <span>Entertainment Reels Editing</span>
                      </h2>
                      <p className="UserDashboard-showroom-subtitle">
                        Cinematic vertical edits crafted for Instagram and YouTube Shorts (Maximum 5 items).
                      </p>
                    </div>

                    <div className="UserDashboard-scroll-track-container">
                      {/* Left Scroll Navigation Button */}
                      {reels.length > 3 && (
                        <button
                          className="UserDashboard-scroll-arrow-btn left"
                          onClick={() => handleReelsScroll("left")}
                          aria-label="Scroll Left"
                        >
                          <FaChevronLeft />
                        </button>
                      )}

                      {/* 1st Container for Reels & NXOR PRO Ad Card */}
                      <div className="UserDashboard-reels-container-1st">

                        {/* 2nd Container for Reel #1, Reel #2, Reel #3 */}
                        <div
                          className="UserDashboard-reels-container-2nd"
                          ref={reelsScrollRef}
                        >
                          {reels.map((reel, rIndex) => (
                            <div key={reel.id} className="UserDashboard-reel-show-card">
                              {/* Bezel frame wrapper */}
                              <div className="UserDashboard-reel-show-bezel">
                                <SecureReelPlayer video={reel} isActive={true} />
                              </div>
                              <div className="UserDashboard-reel-show-meta">
                                <span className="UserDashboard-reel-show-tag">Reel #{rIndex + 1}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* 3rd Container for NXOR PRO Ad Card */}
                        <div className="UserDashboard-reels-container-3rd">
                          <div className="UserDashboard-reel-ad-card">
                            <div className="UserDashboard-reel-ad-badge">NXOR PRO</div>
                            <div className="UserDashboard-reel-ad-body">
                              <div className="UserDashboard-reel-ad-left">
                                <h3>Multiplying Your Reach</h3>
                                <p className="UserDashboard-reel-ad-tagline">Hook viewers instantly with flagship visual aesthetics. From high-energy sound design to cinematic color grading, we craft vertical visual assets engineered to maximize retention, driving traffic and converting casual viewers into loyal customers.</p>
                                <button
                                  className="UserDashboard-btn-reel-ad-cta"
                                  onClick={() => openContactModal("reels")}
                                >
                                  Order Now!
                                </button>
                              </div>

                              <div className="UserDashboard-reel-ad-divider-vertical"></div>

                              <div className="UserDashboard-reel-ad-right">
                                <ul className="UserDashboard-reel-ad-features">
                                  <li>🚀 3.5x Higher Retention</li>
                                  <li>🔥 Hook First 3 Seconds</li>
                                  <li>🎵 Master Sound Beat Sync</li>
                                  <li>🎨 Premium Film LUTs</li>
                                  <li>📝 Kinetic Subtitles</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Right Scroll Navigation Button */}
                      {reels.length > 3 && (
                        <button
                          className="UserDashboard-scroll-arrow-btn right"
                          onClick={() => handleReelsScroll("right")}
                          aria-label="Scroll Right"
                        >
                          <FaChevronRight />
                        </button>
                      )}
                    </div>
                  </section>

                  {/* ========================================================
                 SECTION 3: CREATIVE DESIGNS & POSTERS (Horizontal Drag-Scroll)
                 ======================================================== */}
                  <section className="UserDashboard-showroom-section">
                    <div className="UserDashboard-section-header-block">
                      <h2 className="UserDashboard-showroom-title UserDashboard-showroom-title-posters">
                        <FaRegImages className="UserDashboard-showroom-title-icon-pink" />
                        <span>Creative Designs & Posters</span>
                      </h2>
                      <p className="UserDashboard-showroom-subtitle">
                        Bespoke event fests, milestones celebration banners, and digital high-CTR thumbnails (Maximum 5 items).
                      </p>
                    </div>

                    <div className="UserDashboard-scroll-track-container">
                      {/* Left Scroll Navigation Button */}
                      {posters.length > 3 && (
                        <button
                          className="UserDashboard-scroll-arrow-btn left"
                          onClick={() => handleDesignsScroll("left")}
                          aria-label="Scroll Left"
                        >
                          <FaChevronLeft />
                        </button>
                      )}

                      {/* 1st Container for Posters & NXOR CREATIVE PRO Ad Card */}
                      <div className="UserDashboard-posters-container-1st">

                        {/* 2nd Container for Poster #1, Poster #2, Poster #3 */}
                        <div
                          className="UserDashboard-posters-container-2nd"
                          ref={designsScrollRef}
                        >
                          {posters.map((post, pIndex) => (
                            <div
                              key={pIndex}
                              className="UserDashboard-poster-show-card"
                              onClick={() => {
                                setLightboxUrl(post.url);
                                setLightboxTitle(post.title);
                              }}
                            >
                              <div className="UserDashboard-poster-show-image-wrap">
                                <img src={post.url} alt={post.title} />
                                <div className="UserDashboard-poster-show-overlay">
                                  <span>View Protected Design</span>
                                </div>
                              </div>
                              <div className="UserDashboard-poster-show-info">
                                <h4>{post.title}</h4>
                                <span className="UserDashboard-poster-show-tag">{post.category}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* 3rd Container for NXOR CREATIVE PRO Ad Card */}
                        <div className="UserDashboard-posters-container-3rd">
                          <div className="UserDashboard-poster-ad-card">
                            <div className="UserDashboard-poster-ad-badge">NXOR CREATIVE PRO</div>
                            <div className="UserDashboard-poster-ad-body">
                              <div className="UserDashboard-poster-ad-left">
                                <h3>Multiplying Your Impact</h3>
                                <p className="UserDashboard-poster-ad-tagline">Capture attention instantly with high-CTR creative poster aesthetics. We merge mathematical color psychology with bold, modern typography to deliver digital assets and print-ready designs that stand out in crowded feeds and drive engagement.</p>
                                <button
                                  className="UserDashboard-btn-poster-ad-cta"
                                  onClick={() => openContactModal("designs")}
                                >
                                  Order Now!
                                </button>
                              </div>

                              <div className="UserDashboard-poster-ad-divider-vertical"></div>

                              <div className="UserDashboard-poster-ad-right">
                                <ul className="UserDashboard-poster-ad-features">
                                  <li>🎨 High-CTR Graphic Art</li>
                                  <li>⚡ 24h Ultra-Fast Draft</li>
                                  <li>🎯 Color Psychology Math</li>
                                  <li>📐 Infinite Scale Formats</li>
                                  <li>📂 Print-Ready Vector Source</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Right Scroll Navigation Button */}
                      {posters.length > 3 && (
                        <button
                          className="UserDashboard-scroll-arrow-btn right"
                          onClick={() => handleDesignsScroll("right")}
                          aria-label="Scroll Right"
                        >
                          <FaChevronRight />
                        </button>
                      )}
                    </div>
                  </section>

                  {/* ========================================================
                 SECTION 4: OUR PROCESS (Numbered Sequential Stepper Timeline)
                 ======================================================== */}
                  <section className="UserDashboard-process-section">
                    <div className="UserDashboard-process-timeline-wrapper" style={{ marginTop: 0 }}>
                      <div className="UserDashboard-process-connector-line"></div>

                      <div className="UserDashboard-process-timeline">
                        {processSteps.map((step, sIdx) => (
                          <div key={sIdx} className="UserDashboard-process-node-card">
                            <div className="UserDashboard-process-badge-ring">
                              <span className="UserDashboard-process-badge-icon">{step.icon}</span>
                            </div>
                            <div className="UserDashboard-process-node-text">
                              <h4>{step.title}</h4>
                              <p>{step.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                </motion.div>
              )}

              {/* MY PROFILE TAB */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile-tab"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="UserDashboard-tab-view"
                >
                  <div className="UserDashboard-generic-tab-card">
                    <div className="UserDashboard-profile-details-wrapper">
                      <div className="UserDashboard-profile-avatar-large">
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt={displayName} />
                        ) : (
                          <div className="UserDashboard-profile-avatar-initials-large">{initials}</div>
                        )}
                        <div className="UserDashboard-avatar-camera-btn">
                          <FaCamera />
                        </div>
                      </div>

                      <div className="UserDashboard-profile-info-fields">
                        <h2 className="UserDashboard-profile-name-header">{displayName}</h2>
                        <span className="UserDashboard-profile-status-badge">Account Status: Active</span>

                        <hr className="UserDashboard-profile-divider" />

                        <div className="UserDashboard-info-field">
                          <label>Full Name</label>
                          <p>{displayName}</p>
                        </div>

                        <div className="UserDashboard-info-field">
                          <label>Email Address</label>
                          <p>{user.email || "No Email Provided"}</p>
                        </div>

                        <div className="UserDashboard-info-field">
                          <label>Phone / Mobile Number</label>
                          <p>{user.phone || "No Mobile Connected"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === "settings" && (
                <motion.div
                  key="settings-tab"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="UserDashboard-tab-view"
                >
                  <div className="UserDashboard-generic-tab-card">
                    <h2 className="UserDashboard-inner-title">Account Settings</h2>
                    <p className="UserDashboard-inner-desc">Update your security configurations or change your profile settings.</p>

                    <form className="UserDashboard-form-layout" onSubmit={handleSaveSettings}>
                      <div className="UserDashboard-form-group">
                        <label className="UserDashboard-form-label">Update Full Name</label>
                        <input
                          type="text"
                          className="UserDashboard-form-input"
                          value={settingsName}
                          onChange={(e) => setSettingsName(e.target.value)}
                          placeholder="Enter new full name"
                          required
                        />
                      </div>

                      <div className="UserDashboard-form-group">
                        <label className="UserDashboard-form-label">Update Phone Number</label>
                        <input
                          type="text"
                          className="UserDashboard-form-input"
                          value={settingsPhone}
                          onChange={(e) => setSettingsPhone(e.target.value)}
                          placeholder="Enter new phone number"
                        />
                      </div>

                      <div className="UserDashboard-form-group">
                        <label className="UserDashboard-form-label">Email Address</label>
                        <input
                          type="email"
                          className="UserDashboard-form-input"
                          defaultValue={user.email}
                          disabled
                        />
                        <small className="UserDashboard-form-hint">Email address cannot be changed. Contact support for updates.</small>
                      </div>

                      <div className="UserDashboard-form-group">
                        <label className="UserDashboard-form-label">New Password</label>
                        <input
                          type="password"
                          className="UserDashboard-form-input"
                          placeholder="Enter secure password"
                        />
                      </div>

                      <button type="submit" className="UserDashboard-btn-primary">
                        Save Configurations
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* MY ORDERS TAB */}
              {activeTab === "orders" && (
                <motion.div
                  key="orders-tab"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="UserDashboard-tab-view"
                >
                  <div className="UserDashboard-generic-tab-card">
                    <h2 className="UserDashboard-inner-title">Order History & Statements</h2>
                    <p className="UserDashboard-inner-desc">Review payments, download invoices, or trace dynamic edits status.</p>

                    <div className="UserDashboard-orders-table-wrapper">
                      <table className="UserDashboard-orders-table">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Product Details</th>
                            <th>Amount</th>
                            <th>Date Ordered</th>
                            <th>Receipt File</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchases.length === 0 ? (
                            <tr>
                              <td colSpan="5" style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                                No purchase records or statements found in your portal.
                              </td>
                            </tr>
                          ) : (
                            purchases.map((purchase, index) => {
                              const purchaseDate = new Date(purchase.dateTime).toLocaleDateString("en-US", {
                                year: "numeric", month: "short", day: "numeric"
                              });
                              const receiptUrl = purchase.paymentAttachment ? (
                                purchase.paymentAttachment.startsWith("http") 
                                  ? purchase.paymentAttachment 
                                  : `${API_BASE_URL}/${purchase.paymentAttachment}`
                              ) : null;
                              
                              return (
                                <tr key={purchase._id || index}>
                                  <td className="UserDashboard-order-id-td">#NX-{String(index + 1001).padStart(4, "0")}</td>
                                  <td style={{ fontWeight: "600", color: "#334155" }}>{purchase.productDetails}</td>
                                  <td style={{ fontWeight: "700", color: "#10b981" }}>{purchase.priceDetails}</td>
                                  <td>{purchaseDate}</td>
                                  <td>
                                    {receiptUrl ? (
                                      <a
                                        href={receiptUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "6px",
                                          color: "#2563eb",
                                          textDecoration: "none",
                                          fontWeight: "700",
                                          fontSize: "0.85rem",
                                          padding: "6px 12px",
                                          borderRadius: "6px",
                                          background: "rgba(37, 99, 235, 0.08)",
                                          transition: "all 0.2s"
                                        }}
                                        className="UserDashboard-view-receipt-btn"
                                      >
                                        <FaCloudDownloadAlt /> View Receipt
                                      </a>
                                    ) : (
                                      <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic" }}>No Receipt Uploaded</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </main>
      </div>

      {/* ========================================================
         LIGHTBOX MODAL FOR EVENT POSTERS (SecureImagePlayer)
         ======================================================== */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            className="UserDashboard-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxUrl(null)}
          >
            <button className="UserDashboard-lightbox-close" onClick={() => setLightboxUrl(null)}>
              ×
            </button>
            <motion.div
              className="UserDashboard-lightbox-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <SecureImagePlayer imageUrl={lightboxUrl} title={lightboxTitle} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
         CONTACT POPUP MODAL FOR HERO & INQUIRIES
         ======================================================== */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        category={contactCategory}
      />

    </div>
  );
};

export default UserDashboard;
