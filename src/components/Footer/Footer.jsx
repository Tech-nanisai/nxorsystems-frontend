import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedinIn, FaTwitter, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import nxorLogoDark from '../../assets/logos/nxor-logo-dark.png';
import './Footer.css';

const FooterNXOR = () => {
  return (
    <footer className="footer-container">
      <div className="footer-glow-orb footer-orb-1"></div>
      <div className="footer-glow-orb footer-orb-2"></div>

      <div className="footer-content-grid">
        {/* Brand Block */}
        <div className="footer-brand-block">
          <div className="footer-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px', marginBottom: '24px' }}>
            <img src={nxorLogoDark} alt="NXOR Logo" style={{ height: '36px', objectFit: 'contain' }} />
            <span style={{ fontSize: '9px', fontWeight: 600, color: '#94a3b8', letterSpacing: '5.5px', marginRight: '-5.5px', textTransform: 'uppercase', marginTop: '4px' }}>SYSTEMS</span>
          </div>
          <p className="footer-brand-desc">
            A premium creative digital & technical agency engineering modern interfaces, design systems, and viral short-form media campaigns.
          </p>
          <div className="footer-social-links">
            <a href="https://wa.me/919701866602" target="_blank" rel="noopener noreferrer" className="footer-social-icon whatsapp" title="WhatsApp">
              <FaWhatsapp />
            </a>
            <a href="https://www.instagram.com/nxor_systems/" target="_blank" rel="noopener noreferrer" className="footer-social-icon insta" title="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/company/nxor-systems" target="_blank" rel="noopener noreferrer" className="footer-social-icon linkedin" title="LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href="https://x.com/nxor_systems" target="_blank" rel="noopener noreferrer" className="footer-social-icon twitter" title="X (Twitter)">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links-column">
          <h3>Quick Links</h3>
          <ul className="footer-links-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/portfolio">Portfolio</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Services Links */}
        <div className="footer-links-column">
          <h3>Services</h3>
          <ul className="footer-links-list">
            <li><Link to="/services/entertainment">Entertainment Reels</Link></li>
            <li><Link to="/services/designs">Creative Designs & Posters</Link></li>
            <li><Link to="/services/platforms">Technical Platforms</Link></li>
          </ul>
        </div>

        {/* Contact info Block */}
        <div className="footer-links-column">
          <h3>Connect</h3>
          <ul className="footer-contact-list">
            <li>
              <FaEnvelope className="contact-icon" />
              <a href="mailto:support@nxorsystems.com">support@nxorsystems.com</a>
            </li>
            <li>
              <FaPhoneAlt className="contact-icon" />
              <a href="tel:+919701866602">+91 97018 66602</a>
            </li>
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <span>Hyderabad, Telangana, India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p>&copy; {new Date().getFullYear()} NXOR. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default FooterNXOR;
