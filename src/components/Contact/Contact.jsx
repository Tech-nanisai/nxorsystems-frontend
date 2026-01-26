import React, { useState } from 'react';
import './contact.css';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa'; // Import the check icon

const ConnectUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(''); // State to hold error messages

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Reset error on change
  };

  const isValidPhoneNumber = (number) => {
    const regex = /^[0-9]{10}$/; // Adjust regex based on your requirements
    return regex.test(number);
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmitted(false); // Reset submission state

    // Validate inputs
    if (!isValidPhoneNumber(formData.contact)) {
      setError('Please enter a valid 10-digit mobile number.');
      setLoading(false);
      return;
    }

    if (formData.email && !isValidEmail(formData.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:1992/sendMail', formData);
      setIsSubmitted(true);
      setFormData({
        name: '',
        contact: '',
        email: '',
        message: '',
      });
    } catch (error) {
      alert('Contacting service very soon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="conneus-iner55">
        <div className='form-main-container'>
        <h2 className='contactUs-titile'>Contact Us</h2>
      <form onSubmit={handleSubmit} className="connectus-form">
        <label htmlFor="name" className="connectus-label">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="connectus-input"
        />

        <label htmlFor="contact" className="connectus-label">Contact</label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          required
          className="connectus-input"
        />
        {error && <span className="error-message">{error}</span>} {/* Display error message */}

        <label htmlFor="email" className="connectus-label">Email (Optional)</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="connectus-input"
        />

        <label htmlFor="message" className="connectus-label">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          className="connectus-textarea"
        ></textarea>

        <button type="submit" className="connectus-button">
          {loading ? (
            <span className="spinner"></span> // Display spinner when loading
          ) : (
            'Submit'
          )}
        </button>
      </form>
      {isSubmitted && (
        <div className="success-message">
          <FaCheckCircle style={{ color: 'green', fontSize: '24px' }} />
          <span> Message sent successfully!</span>
          {/* <Confirmation/> */}
        </div>
      )}
        </div>      
    </div>
  );
};

export default ConnectUs;
