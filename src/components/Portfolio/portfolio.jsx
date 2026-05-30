// frontend/src/components/Portfolio/portfolio.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaRegEye, FaChevronLeft, FaChevronRight, FaTimes, 
  FaExternalLinkAlt, FaVideo, FaPalette, FaLaptopCode
} from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

import nxorLogo from '../../assets/logos/nxor-logo.png';
import ContactModal from '../Home/ContactModal';
import SecureReelPlayer from '../common/SecureReelPlayer/SecureReelPlayer';
import './portfolio.css';


// --- DATA ---
const portfolioReels = [
  {
    id: 'reel-1',
    title: 'Creative Cinematic Showcase',
    videoUrl: 'https://res.cloudinary.com/dexueorjm/video/upload/v1779280450/Ruthvika_project_htimbd.mp4'
  },
  {
    id: 'reel-2',
    title: 'High-Energy Promo Edit',
    videoUrl: 'https://res.cloudinary.com/dexueorjm/video/upload/v1779280429/VN20260331_020852_nqam16.mp4'
  }
];

const portfolioPosters = [
  {
    url: 'https://res.cloudinary.com/dexueorjm/image/upload/v1773997904/naswa_logo_fwgaye.png',
    title: 'Naswa Brand Identity Poster',
    category: 'Event Poster'
  },
  {
    url: 'https://res.cloudinary.com/dexueorjm/image/upload/v1779278244/9877972_4297769_eowzbh.jpg',
    title: 'Tech Summit & Startup Keynote',
    category: 'Event Poster'
  },
  {
    url: 'https://res.cloudinary.com/dexueorjm/image/upload/v1779278566/3547973_qe7dds.jpg',
    title: 'Electro Music Festival Visual',
    category: 'Event Poster'
  },
  {
    url: 'https://res.cloudinary.com/dexueorjm/image/upload/v1779277913/ChatGPT_Image_May_16_2026_10_22_33_PM_bnwyar.png',
    title: 'AI Branding & Tech Design',
    category: 'Social Media'
  },
  {
    url: 'https://res.cloudinary.com/dexueorjm/image/upload/v1779278565/5704179_oqxqnk.jpg',
    title: 'Corporate Identity Campaign',
    category: 'Social Media'
  },
  {
    url: 'https://res.cloudinary.com/dexueorjm/image/upload/v1779278252/30124113_7622855_hcaemu.jpg',
    title: 'Modern Geometric Promotion',
    category: 'Social Media'
  }
];

const portfolioWebsites = [
  {
    name: 'Amaravathi Naturo Tech',
    url: 'https://amaravathinaturotech.com/',
    tech: ['React.js', 'Vite', 'Organic CSS', 'Speed Pro'],
    desc: 'High-end alternative medicine & digital wellness consultation platform, optimized for lightning speed, mobile compatibility, and seamless navigation.'
  },
  {
    name: 'AI Marketing Lab',
    url: 'https://aimarketinglab.in/',
    tech: ['Next.js', 'Tailwind', 'AI Integrations', 'Interactive UI'],
    desc: 'A premium, forward-looking AI growth agency and landing experience engineered with interactive elements and high conversion frameworks.'
  }
];

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const [reels, setReels] = useState(portfolioReels);
  const [posters, setPosters] = useState(portfolioPosters);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const reelsRes = await axios.get(`${API_BASE_URL}/api/superadmin/entertainment-reels/all?audience=public`);
        if (reelsRes.data.success && reelsRes.data.reels && reelsRes.data.reels.length > 0) {
          const flattenedReels = reelsRes.data.reels.flatMap(reel =>
            reel.videos.map((vid, idx) => ({
              id: `${reel._id}-${idx}`,
              title: vid.title,
              videoUrl: vid.videoUrl.startsWith("http") ? vid.videoUrl : `${API_BASE_URL}/${vid.videoUrl}`
            }))
          );
          if (flattenedReels.length > 0) {
            setReels(flattenedReels);
          }
        }
      } catch (err) {
        console.error("Error fetching public reels:", err);
      }

      try {
        const designsRes = await axios.get(`${API_BASE_URL}/api/superadmin/creative-designs/all?audience=public`);
        if (designsRes.data.success && designsRes.data.designs && designsRes.data.designs.length > 0) {
          const formattedPosters = designsRes.data.designs.map(design => ({
            url: design.url.startsWith("http") ? design.url : `${API_BASE_URL}/${design.url}`,
            title: design.title,
            category: design.category
          }));
          setPosters(formattedPosters);
        }
      } catch (err) {
        console.error("Error fetching public designs:", err);
      }
    };

    fetchPublicData();
  }, []);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextLightboxImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % posters.length);
  };
  const prevLightboxImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + posters.length) % posters.length);
  };

  return (
    <div className="Portfolio-page">
      
      {/* Background Ambience */}
      <div className="Portfolio-glow-1"></div>
      <div className="Portfolio-glow-2"></div>
      <div className="Portfolio-glow-3"></div>

      <div className="Portfolio-container">
        
        {/* Header Hero Title */}
        <motion.div 
          className="Portfolio-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="Portfolio-badge">
            <span className="Portfolio-badge-dot"></span>
            Creative & Tech Gallery
          </div>
          <h1 className="Portfolio-title">Selected Works</h1>
          <p className="Portfolio-subtitle">
            Exploring the boundary of artistic entertainment production and state-of-the-art business application development.
          </p>
        </motion.div>

        {/* Dynamic Category Switcher */}
        <div className="Portfolio-tabs">
          {['all', 'reels', 'posters', 'business'].map((tab) => (
            <button
              key={tab}
              className={`Portfolio-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'all' && 'All Showcases'}
              {tab === 'reels' && 'Cinematic Reels'}
              {tab === 'posters' && 'Event & Social Posters'}
              {tab === 'business' && 'Websites & Apps'}
            </button>
          ))}
        </div>

        {/* Showcases Grid */}
        <div className="Portfolio-content-grid">
          
          {/* A. REELS */}
          {(activeTab === 'all' || activeTab === 'reels') && (
            <motion.div 
              className="Portfolio-subsection"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="Portfolio-subsection-title-wrap">
                <FaVideo className="Portfolio-sub-icon" />
                <h3 className="Portfolio-subsection-title">Cinematic Reels (9:16)</h3>
              </div>
              <div className="Portfolio-reels-grid">
                {reels.map((reel) => (
                  <div className="Portfolio-reel-card" key={reel.id}>
                    <SecureReelPlayer video={reel} />
                    <div className="Portfolio-reel-info">
                      <h4>{reel.title}</h4>
                      <span className="Portfolio-tag">Entertainment Production</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* B. POSTERS */}
          {(activeTab === 'all' || activeTab === 'posters') && (
            <motion.div 
              className="Portfolio-subsection"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="Portfolio-subsection-title-wrap">
                <FaPalette className="Portfolio-sub-icon" />
                <h3 className="Portfolio-subsection-title">Creative Designs & Posters</h3>
              </div>
              <div className="Portfolio-posters-grid">
                {posters.map((poster, index) => (
                  <div
                    className="Portfolio-poster-card"
                    key={index}
                    onClick={() => openLightbox(index)}
                  >
                    <div className="Portfolio-poster-image-wrap">
                      <img src={poster.url} alt={poster.title} loading="lazy" />
                      <div className="Portfolio-poster-overlay">
                        <FaRegEye className="Portfolio-poster-zoom-icon" />
                        <span className="Portfolio-zoom-text">Zoom View</span>
                      </div>
                    </div>
                    <div className="Portfolio-poster-info">
                      <h4>{poster.title}</h4>
                      <span className="Portfolio-tag">{poster.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* C. BUSINESS PROJECTS */}
          {(activeTab === 'all' || activeTab === 'business') && (
            <motion.div 
              className="Portfolio-subsection"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="Portfolio-subsection-title-wrap">
                <FaLaptopCode className="Portfolio-sub-icon" />
                <h3 className="Portfolio-subsection-title">Technical Business Platforms</h3>
              </div>
              <div className="Portfolio-business-grid">
                {portfolioWebsites.map((web, index) => (
                  <div className="Portfolio-web-card" key={index}>
                    <div className="Portfolio-web-card-glare"></div>
                    <div className="Portfolio-web-header">
                      <div className="Portfolio-web-browser-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="Portfolio-web-domain">{web.name.toLowerCase().replace(/\s/g, '')}.com</span>
                    </div>
                    <div className="Portfolio-web-body">
                      <h4 className="Portfolio-web-title">{web.name}</h4>
                      <p className="Portfolio-web-desc">{web.desc}</p>
                      <div className="Portfolio-web-tags">
                        {web.tech.map((t, ti) => (
                          <span key={ti} className="Portfolio-web-tag">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="Portfolio-web-footer">
                      <a href={web.url} target="_blank" rel="noopener noreferrer" className="Portfolio-web-visit-btn">
                        Explore Live Site <FaExternalLinkAlt />
                      </a>
                    </div>
                  </div>
                ))}

                {/* Mobile App Custom Placeholder */}
                <div className="Portfolio-web-card Portfolio-app-card-placeholder">
                  <div className="Portfolio-web-header">
                    <div className="Portfolio-web-browser-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="Portfolio-web-domain">mobileapps.nxor</span>
                  </div>
                  <div className="Portfolio-web-body Portfolio-app-placeholder-body">
                    <div className="Portfolio-app-badge">In Production</div>
                    <h4 className="Portfolio-web-title">Custom iOS & Android Apps</h4>
                    <p className="Portfolio-web-desc">
                      Engineering high-performance native apps for iOS and Android platforms. Built with Flutter, React Native, custom animations, and fully secure backend services.
                    </p>
                    <div className="Portfolio-web-tags">
                      <span className="Portfolio-web-tag">React Native</span>
                      <span className="Portfolio-web-tag">Flutter</span>
                      <span className="Portfolio-web-tag">UX flow</span>
                    </div>
                  </div>
                  <div className="Portfolio-web-footer">
                    <button className="Portfolio-app-notify-btn" onClick={() => setIsModalOpen(true)}>
                      Request Custom App Proposal
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>

      </div>

      {/* Lightbox Zoom Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="Portfolio-lightbox-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="Portfolio-lightbox-backdrop" onClick={closeLightbox}></div>
            
            <button className="Portfolio-lightbox-close" onClick={closeLightbox}>
              <FaTimes />
            </button>

            <button className="Portfolio-lightbox-nav prev" onClick={prevLightboxImage}>
              <FaChevronLeft />
            </button>

            <motion.div
              className="Portfolio-lightbox-content"
              key={lightboxIndex}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={posters[lightboxIndex].url}
                alt={posters[lightboxIndex].title}
                className="Portfolio-lightbox-image"
              />
              <div className="Portfolio-lightbox-info">
                <h3>{posters[lightboxIndex].title}</h3>
                <p>{posters[lightboxIndex].category}</p>
              </div>
            </motion.div>

            <button className="Portfolio-lightbox-nav next" onClick={nextLightboxImage}>
              <FaChevronRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Generation Contact Modal */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
  );
};

export default Portfolio;