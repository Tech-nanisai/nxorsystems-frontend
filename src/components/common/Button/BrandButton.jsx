import React from "react";
import "./BrandButton.css";

const BrandButton = ({ label, onClick, type = "button" }) => {
  return (
    <button className="brand-button" onClick={onClick} type={type}>
      {label}button
    </button>
  );
};

export default BrandButton;
