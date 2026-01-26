// frontend/src/components/SubmitForm/SubmitForm.jxs
import React, { useState } from 'react';
import './Submitform.css';

const SubmitForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    projectType: 'website',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        alert('Form submitted successfully!');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          projectType: 'website',
          description: '',
        });
      } else {
        alert('Error submitting form.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error, please try again later.');
    }
  };

  return (
    <section className='Main-submitform-containe'>
      {/* <div>
        <img
          src="https://res.cloudinary.com/drevfgyks/image/upload/v1731062148/tech%20nanisai/A_beautiful_girl_with_good_hair_and_a_good_saree_dress_taking_a_call_on_a_landline_in_an_office_setting_against_a_white_background_5_oglsfp.jpg"
          alt="Logo"
          className="submitform-image"
        />
      </div> */}
      <div className='FormContainer'>
        <form className="submitform-form-container" onSubmit={handleSubmit}>
          <h2 className="submitform-title">Submit Your Project</h2>

          <label className="submitform-label">
           <span className="submitform-required"></span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="submitform-input"
            placeholder=' Full Name '
            required
          />

          <label className="submitform-label"></label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="submitform-input"
            placeholder='Email'
          />

          <label className="submitform-label">
            <span className="submitform-required"></span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="submitform-input"
            placeholder=' Phone Number'
            required
          />

          <label className="submitform-label"></label>
          <select
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className="submitform-select"
          >
            <option value="website">Website</option>
            <option value="data analysis">Data Analysis</option>
            <option value="digital marketing">Digital Marketing</option>
            <option value="maintenance support">Maintenance Support</option>
          </select>

          <label className="submitform-label"></label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="submitform-textarea"
            placeholder='Description'
          />

          <button type="submit" className="submitform-button">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default SubmitForm;
