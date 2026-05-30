import React, { useState } from "react";
import "./UserProfileCard.css";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle, FaSignOutAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserProfileCard = () => {
  const { userRole, getActiveUser, logout } = useAuth();
  const navigate = useNavigate();

  const [showOrgMenu, setShowOrgMenu] = useState(false);

  if (!userRole) return null;

  // 👉 Fetch user directly from AuthContext (which fetches from MongoDB)
  const user = getActiveUser();
  if (!user) return null;

  // 👉 Always correct fields coming from DB API
  const name = user.fullName || "User";
  const email = user.email || "No Email";
  const profilePic = user.profilePicture || null;

  // -------------------------
  // MENUS FOR OTHER ROLES
  // -------------------------
  const ROLE_LINKS = {
    client: [
      { label: "Dashboard", path: "/client/dashboard" },
      { label: "Projects", path: "/client/projects" },
      { label: "Messages", path: "/client/messages" },
    ],
    admin: [
      { label: "Dashboard", path: "/admin/dashboard" },
      { label: "Manage Clients", path: "/admin/clients" },
    ],
    user: [
      { label: "Dashboard", path: "/user?tab=overview" },
      { label: "Profile", path: "/user?tab=profile" },
      { label: "Settings", path: "/user?tab=settings" },
      { label: "My Orders", path: "/user?tab=orders" },
    ],
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
  };

  // -------------------------
  // SUPER ADMIN MENUS
  // -------------------------
  const renderSuperAdminMainMenu = () => (
    <>
      <div
        className="profilecard-menu-item"
        onClick={() => handleNavigate("/superadmin/profile")}
      >
        My Profile
      </div>

      <div
        className="profilecard-menu-item"
        onClick={() => handleNavigate("/superadmin/account-settings")}
      >
        Account Settings
      </div>

      <div
        className="profilecard-menu-item"
        onClick={() => handleNavigate("/superadmin/security-settings")}
      >
        Security Settings
      </div>

      <div
        className="profilecard-menu-item"
        onClick={() => setShowOrgMenu(true)}
      >
        Org Settings
      </div>
    </>
  );

  const renderSuperAdminOrgMenu = () => (
    <div className="profilecard-org-wrapper">
      <div className="profilecard-org-header">
        <button
          type="button"
          className="profilecard-org-back"
          onClick={() => setShowOrgMenu(false)}
        >
          <FaArrowLeft />
        </button>
        <span>Org Settings</span>
      </div>

      <div
        className="profilecard-menu-item"
        onClick={() => handleNavigate("/superadmin/org/hyderabad")}
      >
        Hyderabad
      </div>

      <div
        className="profilecard-menu-item"
        onClick={() => handleNavigate("/superadmin/org/bangalore")}
      >
        Bangalore
      </div>
    </div>
  );

  return (
    <div className="profilecard-wrapper">
      {/* Avatar */}
      <div className="profilecard-avatar">
        {profilePic ? (
          <img src={profilePic} alt="Profile" />
        ) : (
          <FaUserCircle className="profile-default-icon" />
        )}
      </div>

      {/* Name + Email */}
      <h3 className="profilecard-name">{name}</h3>
      <p className="profilecard-email">{email}</p>

      <hr className="profilecard-divider" />

      {/* Menu */}
      <div className="profilecard-menu">
        {userRole === "superadmin" ? (
          showOrgMenu ? (
            renderSuperAdminOrgMenu()
          ) : (
            renderSuperAdminMainMenu()
          )
        ) : (
          (ROLE_LINKS[userRole] || []).map((item, index) => (
            <div
              key={index}
              className="profilecard-menu-item"
              onClick={() => handleNavigate(item.path)}
            >
              {item.label}
            </div>
          ))
        )}
      </div>

      {/* Logout */}
      <button className="profilecard-logout" onClick={handleLogout}>
        <FaSignOutAlt className="profilecard-logout-icon" />
        Logout
      </button>
    </div>
  );
};

export default UserProfileCard;
