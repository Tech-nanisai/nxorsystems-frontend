import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaLaptopCode, FaServer, FaDatabase, FaMobileAlt, FaArrowLeft, FaPhoneAlt,
  FaStar, FaPlay, FaTimes, FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ContactModal from '../../Home/ContactModal';
import './TechnicalPlatforms.css';

// --- SECURE WEB PLATFORM VIEWER SUB-COMPONENT (Screenshot & capture protected) ---
const SecurePlatformViewer = ({ url, title }) => {
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
        navigator.clipboard?.writeText('').catch(() => {});
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
        navigator.clipboard?.writeText('').catch(() => {});
        return false;
      }
    };

    const onKeyUp = (e) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard?.writeText('').catch(() => {});
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

  // Clean secure website mockup preview
  const getMockupContent = () => {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        padding: '30px',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Abstract code graphics */}
        <div style={{ fontSize: '48px', marginBottom: '16px', filter: 'drop-shadow(0 0 10px rgba(244,114,182,0.3))' }}>💻</div>
        <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.3px' }}>{title}</h3>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '0 0 20px 0', maxWidth: '300px', lineHeight: '1.4' }}>
          Production-grade Technical Platform engineered securely.
        </p>
        
        {/* Live URL Link Badge */}
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            padding: '8px 16px',
            borderRadius: '20px',
            color: '#f472b6',
            fontSize: '11px',
            fontWeight: '700',
            textDecoration: 'none',
            pointerEvents: 'auto',
            transition: 'all 0.2s'
          }}
        >
          <span>Visit Live Website</span> 🔗
        </a>
      </div>
    );
  };

  return (
    <div 
      className={`SecurePlatformViewer-container ${!isFocused ? 'blurred' : ''}`}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#04060a',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserDrag: 'none',
        display: 'flex',
        flexDirection: 'column',
        isolation: 'isolate',
        transform: 'translateZ(0)',
        willChange: 'transform'
      }}
    >
      {/* Browser address bar mockup */}
      <div style={{
        background: '#1e293b',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        height: '38px',
        flexShrink: 0
      }}>
        {/* Dots */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
        </div>
        {/* URL Input Bar */}
        <div style={{
          flex: 1,
          background: '#0f172a',
          borderRadius: '6px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          gap: '6px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <span style={{ fontSize: '9px', color: '#10b981' }}>🔒</span>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{url}</span>
        </div>
      </div>

      {/* Main Mockup Screen Content */}
      <div style={{ flex: 1, position: 'relative' }}>
        {getMockupContent()}
      </div>

      {/* Focus Lost — Security Shield */}
      {!isFocused && (
        <div className="SecurePlatformViewer-shield" style={{
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
          <span style={{ fontSize: '38px', color: '#f472b6', marginBottom: '12px' }}>🔒</span>
          <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 10px 0' }}>NXOR Secure Sandbox</h3>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0, maxWidth: '240px', lineHeight: '1.5' }}>
            Production platform previews protected. Return to this tab to resume.
          </p>
        </div>
      )}

      {/* Security Alert Toast */}
      {securityAlert && (
        <div className="SecurePlatformViewer-toast" style={{
          position: 'absolute',
          top: '50px',
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
          <span>🛡️ Screenshot & capture has been disabled for this private system sandbox.</span>
        </div>
      )}
    </div>
  );
};

const TechnicalPlatforms = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [currentDesignIndex, setCurrentDesignIndex] = useState(0);

  const handleOpenModal = (item) => {
    setCurrentDesignIndex(0);
    setSelectedCreator(item);
  };

  const capabilities = [
    { icon: FaLaptopCode, title: 'Next.js & Vite Portals', desc: 'Sleek, lightning-fast static and dynamic web apps with top-tier user experiences and built-in SEO optimizations.' },
    { icon: FaMobileAlt, title: 'Cross-Platform Mobile Apps', desc: 'Robust iOS and Android applications developed using React Native and Flutter for native-level smoothness.' },
    { icon: FaServer, title: 'High-Speed API Engines', desc: 'Secure backend servers and RESTful/GraphQL APIs designed to scale to thousands of active concurrent requests.' },
    { icon: FaDatabase, title: 'Secure Cloud Architecture', desc: 'Scalable databases, reliable server setups, offline sync capabilities, and structured cloud deployments.' },
  ];

  const feedbacks = [
    {
      name: 'Madhav',
      role: 'Founder, Amaravathi Naturo Tech',
      avatar: 'M',
      category: 'E-Commerce & Digital Health',
      rating: 5,
      comment: 'We had a great experience with the team! Their professionalism and creativity stood out, and the custom wellness alternative medicine platform exceeded our expectations. The platform loading speeds are incredibly fast!',
      videos: [
        {
          videoUrl: 'https://amaravathinaturotech.com/',
          title: 'Amaravathi Naturo Tech E-Commerce Web Portal'
        }
      ]
    },
    {
      name: 'Pranav Bonigi',
      role: 'CEO & Brand Architect',
      avatar: 'PB',
      category: 'Enterprise SaaS & E-Commerce Platforms',
      rating: 5,
      comment: 'We’re very happy with the web architectures and digital products delivered. The team was highly professional, creative, and easy to work with. AI Marketing Lab has incredible interactivity and B Organics loads seamlessly!',
      videos: [
        {
          videoUrl: 'https://aimarketinglab.in/',
          title: 'AI Marketing Lab Growth Agency Portal'
        },
        {
          videoUrl: 'https://www.borganics.in/',
          title: 'B Organics Clean E-Commerce Web Portal'
        }
      ]
    }
  ];

  const creatorDesigns = selectedCreator ? selectedCreator.videos : [];
  const activeDesign = creatorDesigns[currentDesignIndex] || null;

  return (
    <div className="platforms-page-container">
      {/* Background glow orbs */}
      <div className="platforms-bg-orb platforms-orb-pink"></div>
      <div className="platforms-bg-orb platforms-orb-blue"></div>

      <div className="platforms-content-wrapper">
        <Link to="/" className="platforms-back-btn">
          <FaArrowLeft /> Back to Home
        </Link>

        {/* Hero Section */}
        <div className="platforms-hero-section">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="platforms-hero-text"
          >
            <div className="platforms-badge">High-Performance Engineering</div>
            <h1>Technical Business <span className="gradient-text-pink">Platforms</span></h1>
            <p>
              We engineer enterprise-grade digital products. From blazing-fast frontend frameworks to highly secure APIs and database schemas, we build technical infrastructure that scales alongside your company's growth.
            </p>
            <a href="tel:9701866602" className="platforms-cta-btn">
              Consult an Architect <FaPhoneAlt />
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="platforms-hero-visual"
          >
            <div className="platforms-glass-card">
              <div className="platforms-code-header">
                <span className="platforms-circle red"></span>
                <span className="platforms-circle yellow"></span>
                <span className="platforms-circle green"></span>
              </div>
              <div className="platforms-code-body">
                <p className="code-line"><span className="token-keyword">import</span> &#123; <span className="token-def">NXOR</span> &#125; <span className="token-keyword">from</span> <span className="token-string">'@nxor/core'</span>;</p>
                <p className="code-line"><span className="token-keyword">const</span> app = <span className="token-keyword">new</span> <span className="token-def">NXOR</span>(&#123; speed: <span className="token-string">'max'</span> &#125;);</p>
                <p className="code-line">app.<span className="token-def">deploy</span>(&#123; cloud: <span className="token-string">'secure'</span> &#125;);</p>
              </div>
              <div className="platforms-card-footer">
                <h3>Build Status: Successful</h3>
                <p>99.9% Uptime SLA Guarantee</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Capabilities Grid */}
        <div className="platforms-features-section">
          <h2>Our Technology Stack</h2>
          <div className="platforms-features-grid">
            {capabilities.map((cap, index) => (
              <motion.div 
                className="platforms-feature-card"
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="platforms-feat-icon-wrap">
                  <cap.icon />
                </div>
                <h3>{cap.title}</h3>
                <p>{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Client Success Stories Section */}
        <div className="platforms-feedback-section">
          <h2>Client Success Stories</h2>
          <div className="platforms-feedback-grid">
            {feedbacks.map((item, index) => (
              <motion.div 
                className="platforms-feedback-card"
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="platforms-feedback-header">
                  <div className="platforms-feedback-avatar">{item.avatar}</div>
                  <div className="platforms-feedback-meta">
                    <span className="platforms-feedback-name">{item.name}</span>
                    {item.category && (
                      <span className="platforms-feedback-category-badge">
                        {item.category}
                      </span>
                    )}
                    <span className="platforms-feedback-role">{item.role}</span>
                  </div>
                </div>

                <div className="platforms-rating-stars">
                  {[...Array(item.rating)].map((_, si) => (
                    <FaStar key={si} className="star-active" />
                  ))}
                </div>

                <p className="platforms-feedback-comment">"{item.comment}"</p>

                <button 
                  className="platforms-watch-btn" 
                  onClick={() => handleOpenModal(item)}
                >
                  <FaPlay className="watch-icon" /> View Platform
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <motion.div 
          className="platforms-footer-banner"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Need a custom solution?</h2>
          <p>Schedule an architecture alignment call to discuss integrations, migration, and development scopes.</p>
          <button onClick={() => setIsModalOpen(true)} className="platforms-banner-btn" style={{ border: 'none', cursor: 'pointer' }}>
            Contact Architects
          </button>
        </motion.div>
      </div>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} category="platforms" />

      {/* IMMERSIVE PLATFORM WEB MODAL */}
      <AnimatePresence>
        {selectedCreator && activeDesign && (
          <motion.div 
            className="platforms-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCreator(null)}
          >
            <div className="platforms-modal-backdrop"></div>
            
            <motion.div 
              className="platforms-modal-content-wrapper"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button className="platforms-modal-close-btn" onClick={() => setSelectedCreator(null)} aria-label="Close Modal">
                <FaTimes />
              </button>

              {/* Secure Web Laptop/Monitor Mockup */}
              <div className="platforms-laptop-frame">
                <div className="platforms-laptop-screen">
                  <SecurePlatformViewer 
                    key={activeDesign.videoUrl} 
                    url={activeDesign.videoUrl} 
                    title={activeDesign.title} 
                  />
                  
                  {/* Navigation Arrows for Multiple Projects */}
                  {creatorDesigns.length > 1 && (
                    <>
                      <button 
                        className="platforms-nav-arrow platforms-arrow-prev"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentDesignIndex((prev) => (prev === 0 ? creatorDesigns.length - 1 : prev - 1));
                        }}
                        aria-label="Previous Project"
                      >
                        <FaChevronLeft />
                      </button>
                      <button 
                        className="platforms-nav-arrow platforms-arrow-next"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentDesignIndex((prev) => (prev === creatorDesigns.length - 1 ? 0 : prev + 1));
                        }}
                        aria-label="Next Project"
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  )}
                  
                  {/* Floating overlay details */}
                  <div className="platforms-video-floating-overlay">
                    <span className="floating-client-name">{selectedCreator.name}</span>
                    <span className="floating-reel-title">{activeDesign.title}</span>
                    
                    {/* Pagination Dots at bottom if multiple exist */}
                    {creatorDesigns.length > 1 && (
                      <div className="platforms-video-dots">
                        {creatorDesigns.map((_, idx) => (
                          <span 
                            key={idx} 
                            className={`platforms-dot ${idx === currentDesignIndex ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentDesignIndex(idx);
                            }}
                          ></span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TechnicalPlatforms;
