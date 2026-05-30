import React from 'react';
import './Testimonials.css';

const testimonialsData = {
  clients: [
    {
      projectName: "Maithri Organics",
      experience: "Working with this team was amazing. They delivered a beautiful and functional website on time.",
      photo: "https://res.cloudinary.com/drevfgyks/image/upload/v1683714910/People/WhatsApp_Image_2023-05-10_at_15.31.36_lapuw3.jpg",
      website: "https://maithri.com",
      youtubeLink: "https://www.youtube.com/embed/YOUR_VIDEO_ID"
    },
    {
      projectName: "Maithri Organics",
      experience: "Working with this team was amazing. They delivered a beautiful and functional website on time.",
      photo: "https://res.cloudinary.com/drevfgyks/image/upload/v1683714910/People/WhatsApp_Image_2023-05-10_at_15.30.24_vppxmb.jpg",
      website: "https://maithri.com",
      youtubeLink: "https://www.youtube.com/embed/YOUR_VIDEO_ID"
    },
    {
      projectName: "Maithri Organics",
      experience: "Working with this team was amazing. They delivered a beautiful and functional website on time.",
      photo: "https://res.cloudinary.com/drevfgyks/image/upload/v1683714935/People/20210426012321_IMG_7245_2_1_nymbjo.jpg",
      website: "https://maithri.com",
      youtubeLink: "https://www.youtube.com/embed/YOUR_VIDEO_ID"
    }
  ]
};

const TestimonialCard = ({ testimonial }) => (
  <div className="testimonial-card">
    <img src={testimonial.photo} alt="person" className="testimonial-photo" />
    <h3 className="testimonial-project">{testimonial.projectName}</h3>
    <p className="testimonial-description">{testimonial.experience}</p>
    <a href={testimonial.website} target="_blank" rel="noopener noreferrer" className="testimonial-link">
      Visit Website
    </a>
    <div className="testimonial-video">
      <iframe
        width="100%"
        height="200"
        src={testimonial.youtubeLink}
        title="YouTube Video"
        allowFullScreen
      ></iframe>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <div className="testimonials-container">
      <h1 className="testimonials-heading">Testimonials</h1>

      <section className="testimonial-section">
        <h2>Client Side</h2>
        <div className="testimonial-grid">
          {testimonialsData.clients.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
