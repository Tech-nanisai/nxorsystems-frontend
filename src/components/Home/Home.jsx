// frontend/src/components/Home/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { motion, AnimatePresence } from 'framer-motion';
import {
  FaLaptopCode, FaMobileAlt, FaVideo, FaPalette, FaPlay, FaRegEye,
  FaChevronLeft, FaChevronRight, FaTimes, FaCogs, FaChartLine,
  FaBullhorn, FaHandshake, FaClock, FaGlobe, FaThumbsUp,
  FaArrowRight, FaExternalLinkAlt
} from 'react-icons/fa';

import nxorLogo from '../../assets/logos/nxor-logo.png';
import nxorLogoDark from '../../assets/logos/nxor-logo-dark.png';
import BrandButton from '../common/Button/BrandButton';
import ContactModal from './ContactModal';
import SecureReelPlayer from '../common/SecureReelPlayer/SecureReelPlayer';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import './Home.css';

// --- DATA ---
const steps = [
  {
    icon: 'https://img.icons8.com/ios-glyphs/90/FFC107/search.png',
    title: 'Discovery',
    description: 'We start with an in-depth consultation to understand your goals, needs, and vision for the project.',
  },
  {
    icon: 'https://img.icons8.com/ios-glyphs/90/FFC107/design.png',
    title: 'Design',
    description: 'Our team creates a unique design that combines functionality with aesthetics, tailored to your brand.',
  },
  {
    icon: 'https://img.icons8.com/ios-glyphs/90/FFC107/code.png',
    title: 'Development',
    description: 'We turn the design into a fully functional product using robust and scalable technologies.',
  },
  {
    icon: 'https://img.icons8.com/ios-glyphs/90/FFC107/settings.png',
    title: 'Testing',
    description: 'Every feature is rigorously tested to ensure optimal performance and a smooth user experience.',
  },
  {
    icon: 'https://img.icons8.com/ios-glyphs/90/FFC107/rocket.png',
    title: 'Launch',
    description: 'After final approvals, we launch the project, ensuring a smooth transition to your audience.',
  },
  {
    icon: 'https://img.icons8.com/ios-glyphs/90/FFC107/growth.png',
    title: 'Support & Growth',
    description: 'We provide ongoing support to help your project evolve and reach new heights.',
  },
];

const values = [
  { icon: FaHandshake, title: "Trust & Reliability", text: "Building strong partnerships based on trust and transparent communication.", borderClass: "Home-border-blue" },
  { icon: FaClock, title: "On-Time Delivery", text: "Commitment to delivering high-quality projects within your timeline.", borderClass: "Home-border-purple" },
  { icon: FaGlobe, title: "Global Reach", text: "Providing solutions for a global audience with cutting-edge digital strategies.", borderClass: "Home-border-pink" },
  { icon: FaThumbsUp, title: "Quality Assurance", text: "Ensuring every project meets our high standards of excellence.", borderClass: "Home-border-gold" },
];

const clients = [
  {
    name: "Amaravathi Naturo Tech",
    fb: "\"We had a great experience with the team! Their professionalism and creativity stood out, and the results exceeded our expectations. Highly recommended!\"",
    person: "- Madhav",
    link: "https://amaravathinaturotech.com/"
  },
  {
    name: "B Organics",
    fb: "\"We’re very happy with the work delivered. The team was professional, creative, and easy to work with. Would definitely recommend them!\"",
    person: "- Pranav B",
    link: "https://www.borganics.in/"
  }
];

// --- SERVICES DATA ---
const nxorServices = [
  {
    icon: FaVideo,
    title: 'Entertainment Reels',
    description: 'Hook your audience in the first 3 seconds. High-pacing cinematic editing, trending dynamic subtitles, and flawless color grading tailored specifically for Instagram Reels, YouTube Shorts, and TikTok.',
    features: ['Hook-Focused Editing', 'Dynamic Caption & Subtitle Effects', 'SFX & Audio Synchronization', 'Cinematic Color Grading'],
    path: '/services/entertainment',
    borderClass: 'Home-border-blue'
  },
  {
    icon: FaPalette,
    title: 'Creative Designs & Posters',
    description: 'Bespoke event posters, YouTube thumbnails, and digital campaign visuals designed to command attention. Combining premium color palettes, bold typography layouts, and psychological contrast to maximize click-through rates.',
    features: ['Modern Event Posters', 'High-CTR Thumbnails', 'Social Media Compositing', 'Custom Brand Visuals'],
    path: '/services/designs',
    borderClass: 'Home-border-purple'
  },
  {
    icon: FaLaptopCode,
    title: 'Technical Business Platforms',
    description: 'Custom web architectures and native-like mobile applications. We build lightning-fast React, Vite, Next.js web portals and React Native/Flutter mobile apps with production-grade APIs, databases, and SEO.',
    features: ['Next.js / Vite Stack', 'React Native Mobile Apps', 'Scalable Backend & APIs', 'SEO & Performance Optimizations'],
    path: '/services/platforms',
    borderClass: 'Home-border-pink'
  }
];

// --- PORTFOLIO DATA ---
const portfolioReels = [
  {
    id: 'reel-rupavathi',
    title: 'Rupavathi Cinematic Portrait',
    videoUrl: 'https://res.cloudinary.com/dexueorjm/video/upload/v1779453023/Rupavathi_Gari_reel._vlz4nf.mp4'
  },
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

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// --- DYNAMIC DRAG SCROLL HOOK ---
const useDragScroll = () => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false;

    // Touch swipe detection variables
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchSwiping = false;

    const handleMouseDown = (e) => {
      // Allow scroll interaction but avoid text highlight or default image drags
      isDown = true;
      el.style.scrollBehavior = 'auto'; // Instant response
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      isDragging = false;
    };

    const handleMouseLeave = () => {
      isDown = false;
      el.style.scrollBehavior = '';
    };

    const handleMouseUp = () => {
      isDown = false;
      el.style.scrollBehavior = '';
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault(); // Prevent text dragging / highlighting
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5; // Drag speed multiplier

      if (Math.abs(walk) > 5) {
        isDragging = true;
      }

      el.scrollLeft = scrollLeft - walk;
    };

    // Touch event handlers for mobile/tablet swipe detection
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      isTouchSwiping = false;
    };

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;

      // If horizontal movement is greater than vertical movement and more than 10px, mark as swiping
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
        isTouchSwiping = true;
      }
    };

    const handleCaptureClick = (e) => {
      if (isDragging || isTouchSwiping) {
        e.stopPropagation();
        e.preventDefault();
        isDragging = false;

        // Reset touch swiping flag in a timeout so that the click event is fully blocked
        setTimeout(() => {
          isTouchSwiping = false;
        }, 50);
      }
    };

    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mousemove', handleMouseMove);

    // Add touch listeners with passive option for optimal scroll performance
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: true });

    el.addEventListener('click', handleCaptureClick, true); // Capture phase block

    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mousemove', handleMouseMove);

      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);

      el.removeEventListener('click', handleCaptureClick, true);
    };
  }, []);

  return ref;
};

const Home = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === "user") {
      navigate("/user", { replace: true });
    }
  }, [userRole, navigate]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activePortfolioTab, setActivePortfolioTab] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

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

  // Initialize drag scroll refs
  const reelsGridRef = useDragScroll();
  const postersGridRef = useDragScroll();
  const businessGridRef = useDragScroll();
  const servicesGridRef = useDragScroll();
  const valuesGridRef = useDragScroll();

  const handleReelsScroll = (e) => {
    if (isDesktop) return;
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const cards = container.querySelectorAll('.Home-reel-card');
    if (!cards || cards.length === 0) return;

    let closestIndex = activeReelIndex;
    let minDistance = Infinity;
    const containerCenter = scrollLeft + containerWidth / 2;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(cardCenter - containerCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeReelIndex) {
      setActiveReelIndex(closestIndex);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollReelsLeft = () => {
    const container = reelsGridRef.current;
    if (container) {
      const cardWidth = container.querySelector('.Home-reel-card')?.clientWidth || 280;
      const scrollAmount = cardWidth + 24; // Card width + gap
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollReelsRight = () => {
    const container = reelsGridRef.current;
    if (container) {
      const cardWidth = container.querySelector('.Home-reel-card')?.clientWidth || 280;
      const scrollAmount = cardWidth + 24; // Card width + gap
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
    <div className="Home-container">

      {/* 1. HERO SECTION */}
      <section className="Home-hero-section">
        <div className="Home-hero-background">
          <div className="Home-hero-glow-1"></div>
          <div className="Home-hero-glow-2"></div>
        </div>

        <div className="Home-hero-content">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="Home-hero-text-block"
          >
            <div className="Home-hero-badge">
              <span className="Home-hero-badge-dot"></span>
              Creative Digital & Technical Agency
            </div>
            <h1 className="Home-hero-title">
              Elevate Your Vision With <span className="Home-highlight-text">Premium Agency Solutions</span>
            </h1>
            <p className="Home-hero-description">
              Transforming your ideas into real-world impact. At NXOR, we engineer high-performance web applications, beautiful creative designs, and custom short-form content that drive real brand growth.
            </p>
            <div className="Home-hero-cta">
              <BrandButton label="Start Your Journey" onClick={() => setIsModalOpen(true)} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="Home-hero-image-block"
          >
            <div className="Home-hero-visual-container">
              {/* Dynamic Floating Glass Cards */}
              <motion.div
                className="Home-floating-card Home-card-code"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.05, rotate: -2 }}
              >
                <div className="Home-card-glow-effect"></div>
                <div className="Home-card-header">
                  <FaLaptopCode className="Home-card-icon code-color" />
                  <span>Web Architect</span>
                </div>
                <div className="Home-card-body-code">
                  <span className="code-tag">&lt;div class="premium"&gt;</span>
                  <span className="code-line">  const agency = "NXOR";</span>
                  <span className="code-line">  creativeDesign.elevate();</span>
                  <span className="code-tag">&lt;/div&gt;</span>
                </div>
              </motion.div>

              <motion.div
                className="Home-floating-card Home-card-media"
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                <div className="Home-card-glow-effect"></div>
                <div className="Home-card-header">
                  <FaVideo className="Home-card-icon media-color" />
                  <span>Cinematic Reels</span>
                </div>
                <div className="Home-media-wave">
                  <span className="wave-bar bar-1"></span>
                  <span className="wave-bar bar-2"></span>
                  <span className="wave-bar bar-3"></span>
                  <span className="wave-bar bar-4"></span>
                  <span className="wave-bar bar-5"></span>
                </div>
                <div className="Home-card-badge-premium">4K HDR</div>
              </motion.div>

              <motion.div
                className="Home-floating-card Home-card-design"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                whileHover={{ scale: 1.05, rotate: -1 }}
              >
                <div className="Home-card-glow-effect"></div>
                <div className="Home-card-header">
                  <FaPalette className="Home-card-icon design-color" />
                  <span>Visual Art</span>
                </div>
                <div className="Home-design-palette">
                  <span className="color-dot color-1"></span>
                  <span className="color-dot color-2"></span>
                  <span className="color-dot color-3"></span>
                  <span className="color-dot color-4"></span>
                </div>
              </motion.div>

              {/* Glowing main ambient orbs */}
              <div className="Home-hero-orb Home-orb-indigo"></div>
              <div className="Home-hero-orb Home-orb-gold"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES PREVIEW */}
      <section className="Home-services-preview">
        <div className="Home-services-glow-1"></div>
        <div className="Home-services-glow-2"></div>
        <motion.div
          className="Home-section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2>Our Core Expertise</h2>
          <p>Delivering high-end solutions at the intersection of creativity and technology.</p>
        </motion.div>

        <motion.div
          className="Home-services-new-grid"
          ref={servicesGridRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {nxorServices.map((service, index) => (
            <motion.div
              className={`Home-service-new-card ${service.borderClass}`}
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="Home-service-card-glow"></div>
              <div className="Home-service-icon-wrap">
                <service.icon />
              </div>
              <h3 className="Home-service-card-title">{service.title}</h3>
              <p className="Home-service-card-desc">{service.description}</p>
              <ul className="Home-service-features-list">
                {service.features.map((feat, fi) => (
                  <li key={fi} className="Home-feature-item">
                    <span className="Home-feature-bullet"></span>
                    {feat}
                  </li>
                ))}
              </ul>
              <div className="Home-service-card-footer">
                <Link to={service.path} className="Home-service-cta-btn">
                  Explore Service <FaArrowRight />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. ABOUT US SECTION */}
      <section className="Home-about-section">
        <div className="Home-about-glow-1"></div>
        <div className="Home-about-glow-2"></div>
        <div className="Home-about-watermark">
          <img src={nxorLogoDark} alt="NXOR Background" />
        </div>
        <motion.div
          className="Home-about-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="Home-section-title">About Us</h2>
          <p className="Home-about-quote">
            "Our commitment is to transform visions into reality, delivering excellence and innovation every step of the way."
          </p>
          <p className="Home-about-desc">
            At NXOR, we specialize in crafting top-notch applications, creative media campaigns, and custom high-converting visual architectures. Our team combines premium technical engineering with master-level creative design to launch products that inspire.
          </p>

          <div className="Home-values-grid" ref={valuesGridRef}>
            {values.map((v, i) => (
              <motion.div
                className={`Home-value-item ${v.borderClass || ""}`}
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="Home-value-icon-wrapper">
                  <v.icon className="Home-value-icon" />
                </div>
                <h4>{v.title}</h4>
                <p>{v.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 4. FIXED IMAGE PARALLAX BANNER */}
      <section className="Home-parallax-banner">
        <div className="Home-parallax-content">
          <h2>INNOVATE | CREATE | SCALE | SUCCEED</h2>
          <p>Empowering your vision with precision and innovation.</p>
          <button onClick={() => setIsModalOpen(true)} className="Home-btn-outline">Consult With Us</button>
        </div>
      </section>

      {/* 5. WORKFLOW PROCESS */}
      <section className="Home-process-section">
        <div className="Home-workflow-bg-glow"></div>
        <div className="Home-workflow-bg-glow-2"></div>
        <motion.div
          className="Home-section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="Home-section-subtitle-tag">Our Method</span>
          <h2>Our Workflow</h2>
          <p>A seamless, high-end approach from discovery to scaling.</p>
        </motion.div>

        <div className="Home-workflow-timeline-container">
          <div className="Home-workflow-connector-line"></div>

          <div className="Home-workflow-grid">
            {steps.map((step, index) => (
              <motion.div
                className={`Home-workflow-step ${['Home-step-blue', 'Home-step-purple', 'Home-step-pink', 'Home-step-cyan', 'Home-step-orange', 'Home-step-gold'][index % 6]
                  }`}
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -8 }}
              >
                <div className="Home-workflow-glow-overlay"></div>
                <div className="Home-workflow-card-glow"></div>
                <span className="Home-workflow-number">0{index + 1}</span>
                <div className="Home-workflow-icon-wrap">
                  <div className="Home-workflow-icon">
                    <img src={step.icon} alt={step.title} />
                  </div>
                  <div className="Home-workflow-icon-ring"></div>
                </div>
                <div className="Home-workflow-content-wrap">
                  <h3>
                    {step.title}
                    <span className="Home-workflow-title-accent"></span>
                  </h3>
                  <p>{step.description}</p>
                </div>
                <div className="Home-workflow-node-dot"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. IMMERSIVE DARK PORTFOLIO THEATER SHOWCASE */}
      <section className={`Home-portfolio-section portfolio-tab-${activePortfolioTab}`}>
        <div className="Home-portfolio-glow-1"></div>
        <div className="Home-portfolio-glow-2"></div>

        <div className="Home-portfolio-container">
          <motion.div
            className="Home-portfolio-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="Home-portfolio-title">Flagship Showroom</h2>
            <p className="Home-portfolio-subtitle">Exploring our latest technical masterclasses and high-end creative productions.</p>
          </motion.div>

          {/* Portfolio Tab filters */}
          <div className="Home-portfolio-tabs">
            {['all', 'reels', 'posters', 'business'].map((tab) => (
              <button
                key={tab}
                className={`Home-portfolio-tab-btn ${activePortfolioTab === tab ? 'active' : ''}`}
                onClick={() => setActivePortfolioTab(tab)}
              >
                {tab === 'all' && 'All Showcases'}
                {tab === 'reels' && 'Cinematic Reels'}
                {tab === 'posters' && 'Event & Social Posters'}
                {tab === 'business' && 'Websites & Apps'}
              </button>
            ))}
          </div>

          <div className="Home-portfolio-content-grid">
            {/* Reels Row/Grid */}
            {(activePortfolioTab === 'all' || activePortfolioTab === 'reels') && (
              <div className="Home-portfolio-subsection">
                <h3 className="Home-portfolio-sub-title">Entertainment Reels</h3>
                <div className="Home-reels-carousel-wrapper">
                  <button
                    className="Home-reels-arrow prev"
                    onClick={scrollReelsLeft}
                    aria-label="Scroll Left"
                  >
                    <FaChevronLeft />
                  </button>

                  <div
                    className="Home-reels-grid"
                    ref={reelsGridRef}
                    onScroll={handleReelsScroll}
                  >
                    {reels.map((reel, index) => {
                      const isActive = index === activeReelIndex;

                      return (
                        <div
                          key={reel.id}
                          className={`Home-reel-card ${isActive ? 'active' : 'inactive'}`}
                          onClick={() => {
                            if (!isActive && !isDesktop) {
                              setActiveReelIndex(index);
                              const container = reelsGridRef.current;
                              if (container) {
                                const cards = container.querySelectorAll('.Home-reel-card');
                                const targetCard = cards[index];
                                if (targetCard) {
                                  const containerWidth = container.clientWidth;
                                  const targetScrollLeft = targetCard.offsetLeft - (containerWidth / 2) + (targetCard.clientWidth / 2);
                                  container.scrollTo({
                                    left: targetScrollLeft,
                                    behavior: 'smooth'
                                  });
                                }
                              }
                            }
                          }}
                        >
                          {/* Animated Glare Sheen Sweep */}
                          <div className="Home-reel-card-glare"></div>

                          {/* Full card Video Viewport */}
                          <div className="Home-reel-viewport-bezel">
                            <SecureReelPlayer video={reel} isActive={isDesktop || isActive} />
                          </div>

                          {/* Minimalist overlay over the video */}
                          <div className="Home-reel-overlay-info">
                            <div className="Home-reel-overlay-meta">
                              <span className="Home-reel-overlay-index">#0{index + 1}</span>
                              <span className="Home-reel-overlay-tag">9:16 Edit</span>
                            </div>
                            <h4 className="Home-reel-overlay-title">{reel.title}</h4>
                          </div>

                          {/* Minimalist floating audio soundwave visualizer */}
                          <div className="Home-reel-audio-wave-floating">
                            <span className="wave-bar bar-1"></span>
                            <span className="wave-bar bar-2"></span>
                            <span className="wave-bar bar-3"></span>
                            <span className="wave-bar bar-4"></span>
                            <span className="wave-bar bar-5"></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    className="Home-reels-arrow next"
                    onClick={scrollReelsRight}
                    aria-label="Scroll Right"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}

            {/* Poster Grid */}
            {(activePortfolioTab === 'all' || activePortfolioTab === 'posters') && (
              <div className="Home-portfolio-subsection">
                <h3 className="Home-portfolio-sub-title">Creative Designs & Posters</h3>
                <div className="Home-posters-grid" ref={postersGridRef}>
                  {posters.map((poster, index) => {
                    if (isDesktop && index >= 3) return null; // Show first three cards on desktop/laptop/TV

                    return (
                      <div
                        key={index}
                        className="Home-poster-card"
                        onClick={() => openLightbox(index)}
                      >
                        <div className="Home-poster-image-wrap">
                          <img src={poster.url} alt={poster.title} loading="lazy" />
                          <div className="Home-poster-overlay">
                            <FaRegEye className="Home-poster-zoom-icon" />
                            <span className="Home-zoom-text">View Design</span>
                          </div>
                        </div>
                        <div className="Home-poster-info">
                          <h4>{poster.title}</h4>
                          <span className="Home-poster-tag">{poster.category}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Business Platforms */}
            {(activePortfolioTab === 'all' || activePortfolioTab === 'business') && (
              <div className="Home-portfolio-subsection">
                <h3 className="Home-portfolio-sub-title">Technical Business Platforms</h3>
                <div className="Home-business-grid" ref={businessGridRef}>
                  {portfolioWebsites.map((web, index) => (
                    <div className="Home-web-card" key={index}>
                      <div className="Home-web-card-glare"></div>
                      <div className="Home-web-header">
                        <div className="Home-web-browser-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <span className="Home-web-domain">{web.name.toLowerCase().replace(/\s/g, '')}.com</span>
                      </div>
                      <div className="Home-web-body">
                        <h4 className="Home-web-title">{web.name}</h4>
                        <p className="Home-web-desc">{web.desc}</p>
                        <div className="Home-web-tags">
                          {web.tech.map((t, ti) => (
                            <span key={ti} className="Home-web-tag">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="Home-web-footer">
                        <a href={web.url} target="_blank" rel="noopener noreferrer" className="Home-web-visit-btn">
                          Explore Live Site <FaExternalLinkAlt />
                        </a>
                      </div>
                    </div>
                  ))}

                  {/* App Development Placeholder */}
                  <div className="Home-web-card Home-app-card-placeholder">
                    <div className="Home-web-header">
                      <div className="Home-web-browser-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="Home-web-domain">mobileapps.nxor</span>
                    </div>
                    <div className="Home-web-body Home-app-placeholder-body">
                      <div className="Home-app-badge">In Production</div>
                      <h4 className="Home-web-title">Custom iOS & Android Apps</h4>
                      <p className="Home-web-desc">
                        Engineering cutting-edge mobile apps with React Native, Flutter, and serverless architectures. High-fidelity UX animations and custom builds in production.
                      </p>
                      <div className="Home-web-tags">
                        <span className="Home-web-tag">React Native</span>
                        <span className="Home-web-tag">Flutter</span>
                        <span className="Home-web-tag">UX Flow</span>
                      </div>
                    </div>
                    <div className="Home-web-footer">
                      <button className="Home-app-notify-btn" onClick={() => setIsModalOpen(true)}>
                        Request App Proposal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>



      {/* 8. PREMIUM CONTACT MODAL */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* 9. LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="Home-lightbox-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="Home-lightbox-backdrop" onClick={closeLightbox}></div>

            <button className="Home-lightbox-close" onClick={closeLightbox}>
              <FaTimes />
            </button>

            <button className="Home-lightbox-nav prev" onClick={prevLightboxImage}>
              <FaChevronLeft />
            </button>

            <motion.div
              className="Home-lightbox-content"
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
                className="Home-lightbox-image"
              />
              <div className="Home-lightbox-info">
                <h3>{posters[lightboxIndex].title}</h3>
                <p>{posters[lightboxIndex].category}</p>
              </div>
            </motion.div>

            <button className="Home-lightbox-nav next" onClick={nextLightboxImage}>
              <FaChevronRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;
