// frontend/src/components/Loader/Loader.jsx
import React from 'react';
import './Loader.css';

const Loader = () => {
  // This path describes your Logo's "O" perfectly:
  // It's a circle that breaks at the top-right to form a rounded handle loop.
  const brandPath = "M 73, 27 A 32,32 0 1,0 76,32 M 73, 27 Q 82, 18 88, 24 A 4.5,4.5 0 1,1 81, 30 Q 77, 26 76, 32";

  return (
    <div className="loader-container">
      <svg
        className="brand-loader"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Layer 1: The Dim Track (Always visible) */}
        <path
          className="loader-track"
          d={brandPath}
        />

        {/* Layer 2: The Moving Light (Animation) */}
        <path
          className="loader-fill"
          d={brandPath}
        />
        
        {/* Layer 3: The Center Dot */}
        <circle 
          className="loader-dot" 
          cx="50" 
          cy="50" 
          r="11" 
        />
      </svg>
    </div>
  );
};

export default Loader;