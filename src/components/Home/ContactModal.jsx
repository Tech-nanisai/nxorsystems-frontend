import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { API_BASE_URL } from '../../config';
import './ContactModal.css';

const ContactModal = ({ isOpen, onClose, category }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
    // Reels fields
    reelsStyle: '',
    reelsDuration: '',
    // Design fields
    designType: '',
    designQuantity: '',
    // Platforms fields
    platformType: '',
    platformTech: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Get dynamic header and copy based on category
  const getHeaderInfo = () => {
    switch (category) {
      case 'reels':
        return {
          title: 'Entertainment Reels Editing',
          subtitle: 'Tell us about your short-form video goals and editing requirements.'
        };
      case 'designs':
        return {
          title: 'Creative Designs & Posters',
          subtitle: 'Provide details about your poster, thumbnail, or branding graphic needs.'
        };
      case 'platforms':
        return {
          title: 'Technical Business Platforms',
          subtitle: 'Share your web portal, mobile app specs, or database requirements.'
        };
      default:
        return {
          title: 'Start Your Journey',
          subtitle: 'Fill out the details below and our experts will get back to you shortly.'
        };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Build specific category fields string
    let detailsStr = '';
    if (category === 'reels') {
      detailsStr = `\n🎬 *Video Style*: ${formData.reelsStyle || 'Not specified'}\n⏱️ *Duration*: ${formData.reelsDuration || 'Not specified'}`;
    } else if (category === 'designs') {
      detailsStr = `\n🎨 *Design Type*: ${formData.designType || 'Not specified'}\n📦 *Quantity*: ${formData.designQuantity || 'Not specified'}`;
    } else if (category === 'platforms') {
      detailsStr = `\n💻 *Platform Type*: ${formData.platformType || 'Not specified'}\n🛠️ *Preferred Stack*: ${formData.platformTech || 'Not specified'}`;
    }

    // Formulate pre-formatted WhatsApp message for instant double-delivery
    const formattedMessage = `*New Inquiry from NXOR Systems*\n--------------------------------\n👤 *Name*: ${formData.fullName}\n📧 *Email*: ${formData.email}\n📞 *Phone*: ${formData.phone}\n🏷️ *Category*: ${category ? category.toUpperCase() : 'General'}${detailsStr}\n💬 *Message*: ${formData.message}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=919701866602&text=${encodeURIComponent(formattedMessage)}`;

    try {
      // 1. Dispatch background email via Nodemailer on the backend
      await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.fullName,
          contact: formData.phone,
          email: formData.email,
          message: `${formData.message}${detailsStr ? '\n\nAdditional Details:' + detailsStr.replace(/\*/g, '') : ''}`
        })
      });
    } catch (error) {
      console.error("Failed to send email inquiry:", error);
    }

    // 2. Trigger the premium checkmark animation state
    setIsSubmitting(false);
    setIsSubmitted(true);

    // 3. Clear data
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      message: '',
      reelsStyle: '',
      reelsDuration: '',
      designType: '',
      designQuantity: '',
      platformType: '',
      platformTech: ''
    });

    // 4. Trigger auto-redirect to WhatsApp and close modal
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      onClose();
      setTimeout(() => {
        setIsSubmitted(false);
      }, 500);
    }, 2800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="ContactModal-overlay">
          <motion.div
            className="ContactModal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="ContactModal-content"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <button className="ContactModal-close" onClick={onClose} aria-label="Close modal">
              <FaTimes />
            </button>

            {isSubmitted ? (
              <div className="ContactModal-success-container">
                <div className="ContactModal-success-icon-wrap">
                  <svg className="ContactModal-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="ContactModal-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="ContactModal-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
                <h3>Thank You!</h3>
                <p className="ContactModal-success-msg">Thank you! Your message has been sent successfully.</p>
                <div className="ContactModal-success-subtext">Connecting you to our experts on WhatsApp...</div>
              </div>
            ) : (
              <>
                <div className="ContactModal-header">
                  <h2>{title}</h2>
                  <p>{subtitle}</p>
                </div>
                <form onSubmit={handleSubmit} className="ContactModal-form">
                  <div className="ContactModal-form-group">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="ContactModal-form-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="ContactModal-form-group">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Valid Phone Number"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* 1. Reels Tailored Fields */}
                  {category === 'reels' && (
                    <>
                      <div className="ContactModal-form-group">
                        <select
                          name="reelsStyle"
                          required
                          value={formData.reelsStyle}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        >
                          <option value="">Select Video Editing Type...</option>
                          <option value="Instagram Reels">Instagram Reels</option>
                          <option value="YouTube Shorts">YouTube Shorts</option>
                          <option value="Video Shoots">Video Shoots</option>
                          <option value="Social Media Editing Requirements">Social Media Editing Requirements</option>
                        </select>
                      </div>
                      <div className="ContactModal-form-group">
                        <input
                          type="text"
                          name="reelsDuration"
                          placeholder="Estimated raw footage duration (e.g. 5m, 30m)"
                          required
                          value={formData.reelsDuration}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                      </div>
                    </>
                  )}

                  {/* 2. Designs Tailored Fields */}
                  {category === 'designs' && (
                    <>
                      <div className="ContactModal-form-group">
                        <select
                          name="designType"
                          required
                          value={formData.designType}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        >
                          <option value="">Select Design Type...</option>
                          <option value="Event Poster">Event Poster</option>
                          <option value="YouTube Thumbnail">YouTube Thumbnail</option>
                          <option value="Branding Graphic / Asset Pack">Branding Graphic / Asset Pack</option>
                          <option value="Digital Ad Visual / Banner">Digital Ad Visual / Banner</option>
                          <option value="Other">Other / Custom Art</option>
                        </select>
                      </div>
                      <div className="ContactModal-form-group">
                        <input
                          type="text"
                          name="designQuantity"
                          placeholder="Number of assets needed (e.g. 1 poster, 10 thumbnails)"
                          required
                          value={formData.designQuantity}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                      </div>
                    </>
                  )}

                  {/* 3. Platforms Tailored Fields */}
                  {category === 'platforms' && (
                    <>
                      <div className="ContactModal-form-group">
                        <select
                          name="platformType"
                          required
                          value={formData.platformType}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        >
                          <option value="">Select Platform Type...</option>
                          <option value="Full-Scale Next.js/Vite Web Portal">Full-Scale Next.js/Vite Web Portal</option>
                          <option value="iOS / Android Mobile App">iOS / Android Mobile App</option>
                          <option value="API Integration / Backend System">API Integration / Backend System</option>
                          <option value="E-Commerce Storefront">E-Commerce Storefront</option>
                          <option value="Other">Other / Custom Architecture</option>
                        </select>
                      </div>
                      <div className="ContactModal-form-group">
                        <input
                          type="text"
                          name="platformTech"
                          placeholder="Preferred tech stack/specs (e.g. React, Flutter, Node)"
                          required
                          value={formData.platformTech}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                      </div>
                    </>
                  )}

                  <div className="ContactModal-form-group">
                    <textarea
                      name="message"
                      placeholder="Tell us about your project or needs..."
                      required
                      rows="3"
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    ></textarea>
                  </div>
                  <button type="submit" className="ContactModal-submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
