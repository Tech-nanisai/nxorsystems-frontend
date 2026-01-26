import React from 'react';
import './footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-about">
          <img src="https://res.cloudinary.com/drevfgyks/image/upload/v1694333811/20230213_232002_p6djmh.png" alt="Company Logo" className="footer-logo" />
          <h2 className="footer-company-name">Tech nanisai</h2>
          <p className="footer-description">
            Providing quality products and services to meet your needs. Your satisfaction is our priority.
          </p>
        </div>

        <div className="footer-section footer-links">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-list">
            <li className="footer-list-item">Home</li>
            <li className="footer-list-item">Services</li>
            {/* <ul className="footer-submenu">
              <li className="footer-submenu-item">Product 1</li>
              <li className="footer-submenu-item">Product 2</li>
              <li className="footer-submenu-item">Product 3</li>
              <li className="footer-submenu-item">Product 4</li>
            </ul> */}
            <li className="footer-list-item">Portfolio</li>
            <li className="footer-list-item">Testimonials</li>
            <li className="footer-list-item">Contact</li>
          </ul>
        </div>

        <div className="footer-section footer-social">
          <h3 className="footer-title">Connect with Us</h3>
          <p className="footer-copy"><FaEnvelope/>  support@nanisai.com</p>
          <div className="footer-icons">
            <FaFacebook className="footer-icon" />
            <FaTwitter className="footer-icon" />
            {/* <FaWhatsapp className="footer-icon" /> */}
            <a 
              href="https://wa.me/9948946658" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-link"
            ><FaWhatsapp className="footer-icon" />
            </a>
            <a 
              href="https://www.instagram.com/technanisai/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-link"
            ><FaInstagram className="footer-icon" />
            </a>
            {/* <FaInstagram className="footer-icon" /> */}
          </div>
        </div>

        <div className="footer-section footer-info">
          <h3 className="footer-title">Important Info</h3>
          <ul className="footer-list">
            <li className="footer-list-item">Terms & Conditions</li>
            <li className="footer-list-item">Cancellation Policy</li>
            <li className="footer-list-item">Quality Work</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">© 2024 Tech nanisai. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
