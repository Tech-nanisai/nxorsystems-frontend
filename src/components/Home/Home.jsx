// frontend/src/components/Home/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaLaptopCode, FaCogs, FaChartLine, FaBullhorn,
  FaHandshake, FaClock, FaGlobe, FaThumbsUp
} from 'react-icons/fa';
import SubmitForm from "@components/SubmitForm/SubmitForm";
import BrandButton from '../common/Button/BrandButton';
import './home.css';

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
  { icon: FaHandshake, title: "Trust & Reliability", text: "Building strong partnerships based on trust and transparent communication." },
  { icon: FaClock, title: "On-Time Delivery", text: "Commitment to delivering high-quality projects within your timeline." },
  { icon: FaGlobe, title: "Global Reach", text: "Providing solutions for a global audience with cutting-edge digital strategies." },
  { icon: FaThumbsUp, title: "Quality Assurance", text: "Ensuring every project meets our high standards of excellence." },
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

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
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
    transition: { staggerChildren: 0.2 }
  }
};

const Home = () => {
  return (
    <div className="Home-container">

      {/* 1. HERO SECTION */}
      <section className="Home-hero-section">
        <div className="Home-hero-bg-overlay"></div>
        <div className="Home-hero-content">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="Home-hero-text-block"
          >
            <h1 className="Home-hero-title">
              Make perfect <span className="Home-highlight-text">business</span>
            </h1>
            <p className="Home-hero-description">
              In the modern digital era, your online presence defines your success. At Tech Nanisai,
              we bring your vision to life with innovative websites and dynamic applications,
              tailored to elevate your business and set you apart from the competition.
            </p>
            <div className="Home-hero-cta">
              <BrandButton />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="Home-hero-image-block"
          >
            <div className="Home-tech-visual">
              <div className="Home-tech-circle-outer"></div>
              <div className="Home-tech-circle-middle"></div>
              <div className="Home-tech-circle-inner"></div>
              <div className="Home-tech-core"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES PREVIEW (Cards) */}
      <section className="Home-services-preview">
        <motion.div
          className="Home-section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2>Our Core Expertise</h2>
          <p>Delivering excellence across every digital touchpoint.</p>
        </motion.div>

        <motion.div
          className="Home-cards-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Link to="/web-services" className="Home-service-card">
            <div className="Home-icon-circle"><FaLaptopCode /></div>
            <h3>Web Applications</h3>
            <p>Scalable, robust, and modern web solutions.</p>
          </Link>
          <Link to="/api-services" className="Home-service-card">
            <div className="Home-icon-circle"><FaCogs /></div>
            <h3>API Development</h3>
            <p>Seamless integration and powerful backend logic.</p>
          </Link>
          <Link to="/maintenance-support-services" className="Home-service-card">
            <div className="Home-icon-circle"><FaChartLine /></div>
            <h3>Maintenance</h3>
            <p>24/7 support to keep your business running smooth.</p>
          </Link>
          <Link to="/digital-marketing-services" className="Home-service-card">
            <div className="Home-icon-circle"><FaBullhorn /></div>
            <h3>Digital Marketing</h3>
            <p>Strategies that drive growth and visibility.</p>
          </Link>
        </motion.div>
      </section>

      {/* 3. ABOUT US SECTION */}
      <section className="Home-about-section">
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
            At Tech NaniSai, we specialize in crafting top-notch web applications and end-to-end digital solutions tailored to the unique needs of our clients.
            Our team is driven by the pursuit of quality and the promise to deliver projects on time, every time.
          </p>

          <div className="Home-values-grid">
            {values.map((v, i) => (
              <div className="Home-value-item" key={i}>
                <v.icon className="Home-value-icon" />
                <h4>{v.title}</h4>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 4. FIXED IMAGE PARALLAX BANNER */}
      <section className="Home-parallax-banner">
        <div className="Home-parallax-content">
          <h2>INNOVATE | CREATE | SCALE | SUCCEED</h2>
          <p>Empowering your vision with precision and innovation.</p>
          <Link to="/learn-more" className="Home-btn-outline">Learn More</Link>
        </div>
      </section>

      {/* 5. WORKFLOW PROCESS */}
      <section className="Home-process-section">
        <motion.div
          className="Home-section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2>Our Workflow</h2>
          <p>A seamless approach from concept to launch.</p>
        </motion.div>

        <div className="Home-workflow-grid">
          {steps.map((step, index) => (
            <motion.div
              className="Home-workflow-step"
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="Home-workflow-icon">
                <img src={step.icon} alt={step.title} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. CONTACT / SUBMIT FORM */}
      <section className="Home-submit-section">
        <div className="Home-submit-overlay">
          <SubmitForm />
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="Home-testimonials-section">
        <h2 className="Home-section-title">Client Success Stories</h2>
        <div className="Home-testimonials-grid">
          {clients.map((client, idx) => (
            <motion.div
              className="Home-testimonial-card"
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
            >
              <div className="Home-testimonial-content">
                <h3>{client.name}</h3>
                <p>{client.fb}</p>
                <span className="Home-client-author">{client.person}</span>
              </div>
              <a href={client.link} target="_blank" rel="noopener noreferrer" className="Home-visit-link">
                Visit Website
              </a>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
