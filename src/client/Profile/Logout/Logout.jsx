// frontend/src/components/client/Profile/Logout/Logout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // 📌 Import context

const Logout = ({ setProfileOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // 📌 Use logout from context

  const handleLogout = () => {
    logout(); // Clears cookie + context

    if (setProfileOpen) {
      setProfileOpen(false); // Close dropdown if exists
    }

    navigate("/client/signIn"); // Redirect
  };

  return (
    <p className="profile-item logout" onClick={handleLogout}>
      Logout
    </p>
  );
};

export default Logout;
