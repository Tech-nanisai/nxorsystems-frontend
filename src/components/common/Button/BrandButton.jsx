// frontend/src/components/common/Button/BrandButton.jsx
import React from "react";
import "./BrandButton.css";

const BrandButton = ({ label, onClick, type = "button" }) => {
  return (
    <button className="BrandButton-root" onClick={onClick} type={type}>
      <span className="BrandButton-text">{label || "Launch Now"}</span>
      <span className="BrandButton-glow"></span>
    </button>
  );
};

export default BrandButton;
