import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaVideo, FaMusic, FaBolt, FaMagic, FaArrowLeft, FaPhoneAlt, FaStar, FaPlay, FaTimes, FaInstagram, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ContactModal from '../../Home/ContactModal';
import SecureReelPlayer from '../../common/SecureReelPlayer/SecureReelPlayer';
import { API_BASE_URL } from '../../../config';
import './EntertainmentReels.css';

const EntertainmentReels = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/superadmin/entertainment-reels/all`);
      if (res.data.success && res.data.reels) {
        setFeedbacks(res.data.reels);
      }
    } catch (error) {
      console.error("Error fetching reels:", error);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item) => {
    setCurrentVideoIndex(0);
    setSelectedCreator(item);
  };

  const features = [
    { icon: FaBolt, title: 'Hook-Driven Pacing', desc: 'Capture attention in the critical first 3 seconds with high-retention editing techniques.' },
    { icon: FaMusic, title: 'SFX & Beat Syncing', desc: 'Precise beat-matching and sound effects synchronization that elevate the visual flow of your footage.' },
    { icon: FaMagic, title: 'Subtitles & Motion Graphics', desc: 'Custom, eye-catching animated captions and kinetic text styled for high readability.' },
    { icon: FaVideo, title: 'Cinematic Color Grading', desc: 'Tailored LUTs and color correction that give your footage a premium, high-production look.' },
  ];

  const creatorVideos = selectedCreator ? selectedCreator.videos : [];
  const activeVideo = creatorVideos[currentVideoIndex] || null;

  return (
    <div className="reels-page-container">
      {/* Background glow orbs */}
      <div className="reels-bg-orb reels-orb-blue"></div>
      <div className="reels-bg-orb reels-orb-purple"></div>

      <div className="reels-content-wrapper">
        <Link to="/" className="reels-back-btn">
          <FaArrowLeft /> Back to Home
        </Link>

        {/* Hero Section */}
        <div className="reels-hero-section">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="reels-hero-text"
          >
            <div className="reels-badge">Premium Post-Production</div>
            <h1>Entertainment <span className="gradient-text-blue">Reels Editing</span></h1>
            <p>
              We transform raw footage into viral-ready masterpiece edits. Our professional workflows are optimized to maximize audience retention, boost click-through rates, and define your digital identity on Instagram, TikTok, and YouTube Shorts.
            </p>
            <a href="tel:9701866602" className="reels-cta-btn">
              Get Started <FaPhoneAlt />
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="reels-hero-visual"
          >
            <div className="reels-glass-card">
              <div className="reels-wave-container">
                <span className="reels-wave-bar bar-1"></span>
                <span className="reels-wave-bar bar-2"></span>
                <span className="reels-wave-bar bar-3"></span>
                <span className="reels-wave-bar bar-4"></span>
                <span className="reels-wave-bar bar-5"></span>
              </div>
              <div className="reels-card-overlay">
                <h3>Vibe & Audio Beat Match</h3>
                <p>120 BPM Sync active</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Core Expertise Grid */}
        <div className="reels-features-section">
          <h2>Core Expertise</h2>
          <div className="reels-features-grid">
            {features.map((feat, index) => (
              <motion.div 
                className="reels-feature-card"
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="reels-feat-icon-wrap">
                  <feat.icon />
                </div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Immersive Client Success Stories (Feedbacks & Ratings) */}
        <div className="reels-feedback-section">
          <h2>Client Success Stories</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <p>Loading success stories...</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <p>No client success stories available yet.</p>
            </div>
          ) : (
            <div className="reels-feedback-grid">
              {feedbacks.map((item, index) => (
                <motion.div
                  className="reels-feedback-card"
                  key={item._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="reels-feedback-header">
                    <div className="reels-feedback-avatar">{item.avatar}</div>
                    <div className="reels-feedback-meta">
                      <span className="reels-feedback-name">{item.name}</span>
                      {item.instagram && (
                        <span className="reels-feedback-instagram">
                          <FaInstagram className="reels-instagram-icon" /> {item.instagram}
                        </span>
                      )}
                      <span className="reels-feedback-role">{item.role}</span>
                    </div>
                  </div>

                  <div className="reels-rating-stars">
                    {[...Array(item.rating)].map((_, si) => (
                      <FaStar key={si} className="star-active" />
                    ))}
                  </div>

                  <p className="reels-feedback-comment">"{item.comment}"</p>

                  <button
                    className="reels-watch-btn"
                    onClick={() => handleOpenModal(item)}
                    disabled={!item.videos || item.videos.length === 0}
                  >
                    <FaPlay className="watch-icon" /> View Reel
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Banner */}
        <motion.div 
          className="reels-footer-banner"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to transform your content?</h2>
          <p>Book a strategy session with our creative leads and elevate your watch time today.</p>
          <button onClick={() => setIsModalOpen(true)} className="reels-banner-btn" style={{ border: 'none', cursor: 'pointer' }}>
            Book Consultation
          </button>
        </motion.div>
      </div>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} category="reels" />

      {/* IMMERSIVE VIDEO POPUP MODAL */}
      <AnimatePresence>
        {selectedCreator && activeVideo && (
          <motion.div 
            className="reels-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCreator(null)}
          >
            <div className="reels-modal-backdrop"></div>
            
            <motion.div 
              className="reels-modal-content-wrapper"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button className="reels-modal-close-btn" onClick={() => setSelectedCreator(null)} aria-label="Close Video">
                <FaTimes />
              </button>

              {/* Vertical Phone Bezel Mockup for Vertical Reels */}
              <div className="reels-phone-bezel">
                <div className="reels-phone-screen">
                  {/* SecureReelPlayer: fully disables screenshots, screen recording and downloads */}
                  <SecureReelPlayer 
                    key={activeVideo.videoUrl} 
                    video={{ videoUrl: activeVideo.videoUrl }} 
                    isActive={true} 
                  />
                  
                  {/* Navigation Arrows for Multiple Videos */}
                  {creatorVideos.length > 1 && (
                    <>
                      <button 
                        className="reels-nav-arrow reels-arrow-prev"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentVideoIndex((prev) => (prev === 0 ? creatorVideos.length - 1 : prev - 1));
                        }}
                        aria-label="Previous Video"
                      >
                        <FaChevronLeft />
                      </button>
                      <button 
                        className="reels-nav-arrow reels-arrow-next"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentVideoIndex((prev) => (prev === creatorVideos.length - 1 ? 0 : prev + 1));
                        }}
                        aria-label="Next Video"
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  )}
                  
                  {/* Subtle Floating overlay in vertical reel */}
                  <div className="reels-video-floating-overlay">
                    <span className="floating-client-name">{selectedCreator.instagram}</span>
                    <span className="floating-reel-title">{activeVideo.title}</span>
                    
                    {/* Pagination Dots at bottom if multiple videos exist */}
                    {creatorVideos.length > 1 && (
                      <div className="reels-video-dots">
                        {creatorVideos.map((_, idx) => (
                          <span 
                            key={idx} 
                            className={`reels-dot ${idx === currentVideoIndex ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentVideoIndex(idx);
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

export default EntertainmentReels;
