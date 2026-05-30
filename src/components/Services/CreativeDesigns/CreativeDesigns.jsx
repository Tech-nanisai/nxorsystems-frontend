import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPalette, FaImage, FaEdit, FaEye, FaArrowLeft, FaPhoneAlt, 
  FaStar, FaPlay, FaTimes, FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ContactModal from '../../Home/ContactModal';
import './CreativeDesigns.css';

// --- SECURE IMAGE PLAYER SUB-COMPONENT (Screenshot / download protected) ---
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
        className="SecureImagePlayer-img"
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
        <div className="SecureImagePlayer-shield" style={{
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
        <div className="SecureImagePlayer-toast" style={{
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

const CreativeDesigns = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [currentDesignIndex, setCurrentDesignIndex] = useState(0);

  const handleOpenModal = (item) => {
    setCurrentDesignIndex(0);
    setSelectedCreator(item);
  };

  const capabilities = [
    { icon: FaImage, title: 'Modern Event Posters', desc: 'Bespoke event posters designed to draw crowds, combining spatial balance with striking visual highlights.' },
    { icon: FaEye, title: 'High-CTR Thumbnails', desc: 'Psychology-focused layouts and extreme color contrast that command clicks in busy recommendation feeds.' },
    { icon: FaPalette, title: 'Brand Campaign Visuals', desc: 'Premium, consistent social assets built around custom palettes that cement your brand image.' },
    { icon: FaEdit, title: 'Custom Composites', desc: 'Multi-layer photo manipulations, digital enhancements, and vector branding layouts.' },
  ];

  const feedbacks = [
    {
      name: 'Kiran Kumar',
      role: 'Vibrant Events (Hyderabad)',
      avatar: 'KK',
      category: 'Music Festivals & College Celebrations',
      rating: 5,
      comment: 'The music festival event posters and college celebration visual designs completely sold out our tickets! The extreme color contrast and bold typography created a massive hype. Our absolute go-to agency for creative fests!',
      videos: [
        {
          videoUrl: 'https://res.cloudinary.com/dexueorjm/image/upload/v1779278566/3547973_qe7dds.jpg',
          title: 'Vibe Music Festival Poster'
        },
        {
          videoUrl: 'https://res.cloudinary.com/dexueorjm/image/upload/v1779278244/9877972_4297769_eowzbh.jpg',
          title: 'Vibrant College Celebration Keynote'
        }
      ]
    },
    {
      name: 'Rajesh & Priya',
      role: 'Family Events Curator',
      avatar: 'RP',
      category: 'Birthdays & Anniversaries',
      rating: 5,
      comment: 'We got custom marriage anniversary layouts and family birthday celebration invites. The layout design was incredibly elegant, with soft premium gradients and gorgeous lettering. It made our personal milestone look absolutely premium!',
      videos: [
        {
          videoUrl: 'https://res.cloudinary.com/dexueorjm/image/upload/v1779278252/30124113_7622855_hcaemu.jpg',
          title: 'Silver Marriage Anniversary Poster'
        },
        {
          videoUrl: 'https://res.cloudinary.com/dexueorjm/image/upload/v1779278565/5704179_oqxqnk.jpg',
          title: 'Premium Birthday Celebration Visual'
        }
      ]
    },
    {
      name: 'Sneha Reddy',
      role: 'Aura Product Advertising',
      avatar: 'SR',
      category: 'Product Advertising Posts',
      rating: 5,
      comment: 'Outstanding product advertising posts and high-contrast campaign layouts! The digital campaign assets look extremely modern and premium. They literally doubled our click-through rate on our recent launch!',
      videos: [
        {
          videoUrl: 'https://res.cloudinary.com/dexueorjm/image/upload/v1773997904/naswa_logo_fwgaye.png',
          title: 'Naswa Product Advertising Post'
        },
        {
          videoUrl: 'https://res.cloudinary.com/dexueorjm/image/upload/v1779277913/ChatGPT_Image_May_16_2026_10_22_33_PM_bnwyar.png',
          title: 'Modern AI Product Advertising Banner'
        }
      ]
    }
  ];

  const creatorDesigns = selectedCreator ? selectedCreator.videos : [];
  const activeDesign = creatorDesigns[currentDesignIndex] || null;

  return (
    <div className="designs-page-container">
      {/* Background glow orbs */}
      <div className="designs-bg-orb designs-orb-pink"></div>
      <div className="designs-bg-orb designs-orb-purple"></div>

      <div className="designs-content-wrapper">
        <Link to="/" className="designs-back-btn">
          <FaArrowLeft /> Back to Home
        </Link>

        {/* Hero Section */}
        <div className="designs-hero-section">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="designs-hero-text"
          >
            <div className="designs-badge">Luxury Branding & Layouts</div>
            <h1>Creative Designs <span className="gradient-text-purple">& Posters</span></h1>
            <p>
              Where aesthetic brilliance meets conversion strategy. We create elite, modern visual assets that do not just look pretty, but command attention, build engagement, and multiply CTR.
            </p>
            <a 
              href="https://api.whatsapp.com/send?phone=919701866602&text=Hello%20NXOR%2C%20I'm%20interested%20in%20your%20Creative%20Designs%20%26%20Posters%20pricing." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="designs-cta-btn"
            >
              Explore Pricing <FaPhoneAlt />
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="designs-hero-visual"
          >
            <div className="designs-glass-card">
              <div className="designs-canvas-header">
                <span className="designs-tool-indicator">NXOR Engine v2.0</span>
                <span className="designs-status-dot"></span>
              </div>
              <div className="designs-swatches">
                <div className="designs-swatch color-indigo"></div>
                <div className="designs-swatch color-pink"></div>
                <div className="designs-swatch color-gold"></div>
                <div className="designs-swatch color-dark"></div>
              </div>
              <div className="designs-canvas-footer">
                <h3>High-Contrast Palette Loaded</h3>
                <p>300 DPI ready for Print & Digital</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Capabilities Grid */}
        <div className="designs-features-section">
          <h2>Our Design Ecosystem</h2>
          <div className="designs-features-grid">
            {capabilities.map((cap, index) => (
              <motion.div 
                className="designs-feature-card"
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="designs-feat-icon-wrap">
                  <cap.icon />
                </div>
                <h3>{cap.title}</h3>
                <p>{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Client Success Stories Section */}
        <div className="designs-feedback-section">
          <h2>Client Success Stories</h2>
          <div className="designs-feedback-grid">
            {feedbacks.map((item, index) => (
              <motion.div 
                className="designs-feedback-card"
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="designs-feedback-header">
                  <div className="designs-feedback-avatar">{item.avatar}</div>
                  <div className="designs-feedback-meta">
                    <span className="designs-feedback-name">{item.name}</span>
                    {item.category && (
                      <span className="designs-feedback-category-badge">
                        {item.category}
                      </span>
                    )}
                    <span className="designs-feedback-role">{item.role}</span>
                  </div>
                </div>

                <div className="designs-rating-stars">
                  {[...Array(item.rating)].map((_, si) => (
                    <FaStar key={si} className="star-active" />
                  ))}
                </div>

                <p className="designs-feedback-comment">"{item.comment}"</p>

                <button 
                  className="designs-watch-btn" 
                  onClick={() => handleOpenModal(item)}
                >
                  <FaPlay className="watch-icon" /> View Designs
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <motion.div 
          className="designs-footer-banner"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Have a project in mind?</h2>
          <p>Let's collaborate on high-conversion designs that make your marketing campaigns convert.</p>
          <button onClick={() => setIsModalOpen(true)} className="designs-banner-btn" style={{ border: 'none', cursor: 'pointer' }}>
            Get Started
          </button>
        </motion.div>
      </div>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} category="designs" />

      {/* IMMERSIVE DESIGN POSTER MODAL */}
      <AnimatePresence>
        {selectedCreator && activeDesign && (
          <motion.div 
            className="designs-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCreator(null)}
          >
            <div className="designs-modal-backdrop"></div>
            
            <motion.div 
              className="designs-modal-content-wrapper"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button className="designs-modal-close-btn" onClick={() => setSelectedCreator(null)} aria-label="Close Modal">
                <FaTimes />
              </button>

              {/* Secure Poster Frame Mockup */}
              <div className="designs-poster-frame">
                <div className="designs-poster-screen">
                  <SecureImagePlayer 
                    key={activeDesign.videoUrl} 
                    imageUrl={activeDesign.videoUrl} 
                    title={activeDesign.title} 
                  />
                  
                  {/* Navigation Arrows for Multiple Designs */}
                  {creatorDesigns.length > 1 && (
                    <>
                      <button 
                        className="designs-nav-arrow designs-arrow-prev"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentDesignIndex((prev) => (prev === 0 ? creatorDesigns.length - 1 : prev - 1));
                        }}
                        aria-label="Previous Design"
                      >
                        <FaChevronLeft />
                      </button>
                      <button 
                        className="designs-nav-arrow designs-arrow-next"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentDesignIndex((prev) => (prev === creatorDesigns.length - 1 ? 0 : prev + 1));
                        }}
                        aria-label="Next Design"
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  )}
                  
                  {/* Floating overlay details */}
                  <div className="designs-video-floating-overlay">
                    <span className="floating-client-name">{selectedCreator.name}</span>
                    <span className="floating-reel-title">{activeDesign.title}</span>
                    
                    {/* Pagination Dots at bottom if multiple exist */}
                    {creatorDesigns.length > 1 && (
                      <div className="designs-video-dots">
                        {creatorDesigns.map((_, idx) => (
                          <span 
                            key={idx} 
                            className={`designs-dot ${idx === currentDesignIndex ? 'active' : ''}`}
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

export default CreativeDesigns;
