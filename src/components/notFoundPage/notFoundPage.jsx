// frontend/src/components/NotFoundPage/NotFoundPage.jsx
import './NotFoundPage.css';
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
      <div className="misty-container">
        <div className="mist-layer" />
  
        <motion.h1
          className="misty-title"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          404
        </motion.h1>
  
        <motion.p
          className="misty-subtext"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Oops! The page you're looking for is lost in the mist...
        </motion.p>
  
        <motion.button
          className="misty-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
        >
          Take Me Home
        </motion.button>
      </div>
    );
  };

export default NotFoundPage;

