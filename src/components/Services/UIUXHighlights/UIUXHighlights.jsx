import React from 'react';
import './UIUXHighlights.css';

const data = [
  {
    img: "https://res.cloudinary.com/drevfgyks/image/upload/v1730053460/2947988_yroq2u.jpg",
    title: "Smart UI Design",
    desc: "Crafted for intuitive navigation and aesthetic appeal for modern apps."
  },
  {
    img: "https://res.cloudinary.com/drevfgyks/image/upload/v1730053468/10590_jycywy.jpg",
    title: "UX Optimized",
    desc: "Enhanced user experiences that increase retention and engagement."
  },
  {
    img: "https://res.cloudinary.com/drevfgyks/image/upload/v1740229754/tech%20nanisai/shield_jj7zqn.jpg",
    title: "Security Focused",
    desc: "Built with user data protection and privacy as a top priority."
  },
  {
    img: "https://res.cloudinary.com/drevfgyks/image/upload/v1735913454/tech%20nanisai/rb_2148663017_ojmcai.png",
    title: "Performance Ready",
    desc: "Lightweight components for fast loading and responsive behavior."
  }
];

const UIUXHighlights = () => {
  return (
    <div className="UIUX-container">
      <h2 className="UIUX-heading">Why Choose Our UI/UX?</h2>
      <div className="UIUX-grid">
        {data.map((item, index) => (
          <div className="UIUX-card" key={index}>
            <img src={item.img} alt={item.title} className="UIUX-img" />
            <h3 className="UIUX-title">{item.title}</h3>
            <p className="UIUX-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UIUXHighlights;
