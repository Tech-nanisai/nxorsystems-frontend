// frontend/src/client/Settings/Settings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useClientAuth } from "../../context/ClientAuthContext";
import { FaUser, FaLock, FaBell, FaCamera, FaSave } from "react-icons/fa";
// 1. IMPORT YOUR LOADER HERE (Adjust path if needed)
import Loader from "../../components/NXORLoader/Loader"; 
import "./Settings.css";

const ClientSettings = () => {
  const { client, clientToken, updateClientProfile } = useClientAuth();
  const [activeTab, setActiveTab] = useState("profile"); // profile | security | preferences
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // --- FORM STATES ---
  const [profileData, setProfileData] = useState({
    fullName: "",
    phone: "",
    email: "",
    clientID: "",
    profilePicture: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false
  });

  // Load initial data
  useEffect(() => {
    if (client) {
      setProfileData({
        fullName: client.fullName || "",
        phone: client.phone || "",
        email: client.email || "", // Read only
        clientID: client.clientID || "", // Read only
        profilePicture: client.profilePicture || ""
      });
      if (client.preferences) setPreferences(client.preferences);
    }
  }, [client]);

  // --- HANDLERS ---

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (file.size > 800 * 1024) { 
        setMessage({ type: "error", text: "File is too large! Max size is 800KB." });
        return;
      }
      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: "Please upload a valid image file." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, profilePicture: reader.result }));
        setMessage({ type: "", text: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true); // Loader appears
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.put(
        "http://localhost:1981/api/client/auth/update-profile",
        {
          fullName: profileData.fullName,
          phone: profileData.phone,
          profilePicture: profileData.profilePicture,
          preferences: preferences
        },
        { headers: { Authorization: `Bearer ${clientToken}` } }
      );

      if (res.data.success) {
        updateClientProfile(res.data.client);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setLoading(false); // Loader disappears
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setLoading(true); // Loader appears
    try {
      const res = await axios.put(
        "http://localhost:1981/api/client/auth/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { headers: { Authorization: `Bearer ${clientToken}` } }
      );

      if (res.data.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to change password." });
    } finally {
      setLoading(false); // Loader disappears
    }
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">Account Settings</h2>
      
      <div className="settings-layout">
        
        {/* --- LEFT: SIDEBAR TABS --- */}
        <div className="settings-sidebar">
          <button 
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser /> Edit Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <FaLock /> Security
          </button>
          <button 
            className={`tab-btn ${activeTab === "preferences" ? "active" : ""}`}
            onClick={() => setActiveTab("preferences")}
          >
            <FaBell /> Preferences
          </button>
        </div>

        {/* --- RIGHT: CONTENT AREA --- */}
        <div className="settings-content">
          
          {/* 2. CONDITIONAL RENDERING: LOADER VS FORMS */}
          {loading ? (
            // If loading is true, show ONLY the Loader
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
              <Loader />
            </div>
          ) : (
            // If loading is false, show the forms (Original Code)
            <>
              {/* Message Alert */}
              {message.text && (
                <div className={`settings-alert ${message.type}`}>
                  {message.text}
                </div>
              )}

              {/* TAB 1: PROFILE */}
              {activeTab === "profile" && (
                <form onSubmit={handleProfileSubmit} className="settings-form fade-in">
                  <h3 className="section-header">General Information</h3>
                  
                  {/* Profile Picture Upload */}
                  <div className="profile-upload-section">
                    <div className="settings-avatar">
                      <img 
                        src={profileData.profilePicture || "https://via.placeholder.com/150"} 
                        alt="Profile" 
                      />
                      <label htmlFor="file-upload" className="upload-overlay">
                        <FaCamera />
                      </label>
                      <input 
                        id="file-upload" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        hidden 
                      />
                    </div>
                    <div className="upload-text">
                      <p>Allowed: JPG, PNG. Max size of 800K</p>
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label>Client ID (Read Only)</label>
                      <input type="text" value={profileData.clientID} disabled className="input-disabled" />
                    </div>
                    <div className="form-group">
                      <label>Email Address (Read Only)</label>
                      <input type="email" value={profileData.email} disabled className="input-disabled" />
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input 
                        type="text" 
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})} 
                      />
                    </div>
                  </div>

                  <button type="submit" className="save-btn">
                    <FaSave /> Save Changes
                  </button>
                </form>
              )}

              {/* TAB 2: SECURITY */}
              {activeTab === "security" && (
                <form onSubmit={handlePasswordSubmit} className="settings-form fade-in">
                  <h3 className="section-header">Change Password</h3>
                  
                  <div className="form-group">
                    <label>Current Password</label>
                    <input 
                      type="password" 
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label>New Password</label>
                      <input 
                        type="password" 
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input 
                        type="password" 
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="save-btn">
                    Update Password
                  </button>
                </form>
              )}

              {/* TAB 3: PREFERENCES */}
              {activeTab === "preferences" && (
                <div className="settings-form fade-in">
                  <h3 className="section-header">Notification Preferences</h3>
                  
                  <div className="pref-item">
                    <div className="pref-info">
                      <h4>Email Notifications</h4>
                      <p>Receive emails about project updates and invoice statuses.</p>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={preferences.emailNotifications}
                        onChange={() => setPreferences({...preferences, emailNotifications: !preferences.emailNotifications})}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="pref-item">
                    <div className="pref-info">
                      <h4>SMS Notifications</h4>
                      <p>Get text messages for urgent alerts.</p>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={preferences.smsNotifications}
                        onChange={() => setPreferences({...preferences, smsNotifications: !preferences.smsNotifications})}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <button className="save-btn" onClick={handleProfileSubmit}>
                    Save Preferences
                  </button>
                </div>
              )}
            </>
          )} 
        </div>
      </div>
    </div>
  );
};

export default ClientSettings;