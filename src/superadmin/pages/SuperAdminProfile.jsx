// frontend/src/superadmin/pages/SuperAdminProfile.jsx
import React, { useState, useCallback } from "react";
import { FaEdit } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import AvatarCropper from "../../components/AvatarUpload/AvatarCropper";
import "./SuperAdminProfile.css";

const API = "https://nxorsystems-backend-xglw.onrender.com";

const SuperAdminProfile = () => {
  const { superAdmin, token, updateSuperAdminProfile } = useAuth();

  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Cropper States
  const [tempImage, setTempImage] = useState(null); // raw selected image
  const [showCropper, setShowCropper] = useState(false);

  // ----- PROFILE DETAILS EDIT STATE -----
  const [isEditing, setIsEditing] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: superAdmin?.fullName || "",
    email: superAdmin?.email || "",
    phone: superAdmin?.phone || "",
    address: superAdmin?.address || "",
  });

  // keep local form in sync when superAdmin changes (e.g. after refresh)
  React.useEffect(() => {
    if (!superAdmin) return;
    setForm({
      fullName: superAdmin.fullName || "",
      email: superAdmin.email || "",
      phone: superAdmin.phone || "",
      address: superAdmin.address || "",
    });
  }, [superAdmin]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEditing = () => {
    if (!superAdmin) return;
    setForm({
      fullName: superAdmin.fullName || "",
      email: superAdmin.email || "",
      phone: superAdmin.phone || "",
      address: superAdmin.address || "",
    });
    setErrorMsg("");
    setSuccessMsg("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (!superAdmin) {
      setIsEditing(false);
      return;
    }
    setForm({
      fullName: superAdmin.fullName || "",
      email: superAdmin.email || "",
      phone: superAdmin.phone || "",
      address: superAdmin.address || "",
    });
    setIsEditing(false);
  };

  const saveProfileDetails = async () => {
    if (!token) return;

    try {
      setDetailsLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await fetch(`${API}/api/superadmin/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          address: form.address,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg =
          data?.message || "Failed to update profile. Please try again.";
        setErrorMsg(msg);
        return;
      }

      // update global context
      if (data.superAdmin) {
        updateSuperAdminProfile({
          fullName: data.superAdmin.fullName,
          phone: data.superAdmin.phone,
          address: data.superAdmin.address,
        });
      }

      setSuccessMsg("Profile details updated successfully.");
      setIsEditing(false);
    } catch (err) {
      console.error("Profile details update error:", err);
      setErrorMsg("Failed to update profile due to server error.");
    } finally {
      setDetailsLoading(false);
    }
  };

  // -----------------------------------------
  // HANDLE FILE SELECTION (Before Upload)
  // -----------------------------------------
  const handleFiles = useCallback((files) => {
    const file = files[0];
    if (!file) return;

    setErrorMsg("");
    setSuccessMsg("");

    // Validate type
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file (JPG, PNG, etc).");
      return;
    }

    // Validate size
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMsg("File is too large. Max allowed size is 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTempImage(reader.result); // base64
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  }, []);

  // -----------------------------------------
  // UPLOAD CROPPED IMAGE TO BACKEND
  // -----------------------------------------
  const uploadCroppedImage = async (croppedBase64) => {
    try {
      setUploading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await fetch(`${API}/api/superadmin/auth/profile-picture`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageBase64: croppedBase64 }),
      });

      if (!res.ok) {
        let errorText = "Upload failed. Server error.";
        try {
          const errData = await res.json();
          if (errData?.message) {
            errorText = `Upload failed: ${errData.message}`;
          }
        } catch (_) {}
        setErrorMsg(errorText);
        return;
      }

      let data = {};
      try {
        data = await res.json();
      } catch (_) {
        data = {};
      }

      const serverImage =
        data?.superAdmin?.profilePicture ||
        data?.profilePicture ||
        croppedBase64;

      const updatedImage = `${serverImage}?t=${Date.now()}`;

      updateSuperAdminProfile({
        profilePicture: updatedImage,
      });

      setSuccessMsg("Profile picture updated successfully.");
      setShowCropper(false);
      setTempImage(null);
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg("Upload failed due to server error.");
    } finally {
      setUploading(false);
    }
  };

  // -----------------------------------------
  // Drag & Drop
  // -----------------------------------------
  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  if (!superAdmin) {
    return (
      <div className="saprof-page saprof-page-loading">
        <div className="saprof-loading-spinner" />
      </div>
    );
  }

  return (
    <div className="saprof-page">
      <div className="saprof-header-row">
        <h2 className="saprof-title">My Profile</h2>

        <button
          type="button"
          className="saprof-edit-toggle-btn"
          onClick={isEditing ? cancelEditing : startEditing}
        >
          <FaEdit className="saprof-edit-icon" />
          <span>{isEditing ? "Cancel" : "Edit"}</span>
        </button>
      </div>

      <div className="saprof-grid">
        {/* LEFT: AVATAR + UPLOAD */}
        <div className="saprof-card saprof-card-avatar">
          <div className="saprof-info">
            <div className="saprof-avatar-wrapper">
              {superAdmin?.profilePicture ? (
                <img
                  src={superAdmin.profilePicture}
                  alt="Avatar"
                  className="saprof-avatar-img"
                />
              ) : (
                <span className="saprof-avatar-placeholder">SA</span>
              )}
            </div>

            <div className="saprof-texts">
              <h3 className="saprof-name">
                {superAdmin?.fullName || "Super Admin"}
              </h3>
              <p className="saprof-email">{superAdmin?.email || "No email"}</p>
            </div>
          </div>

          <div
            className={`saprof-upload-zone ${
              dragActive ? "saprof-upload-zone-dragging" : ""
            }`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            <p className="saprof-upload-title">
              Drag &amp; drop an image here, or click to upload
            </p>

            <p className="saprof-upload-sub">
              JPG / PNG up to <strong>2 MB</strong>.
            </p>

            <label className="saprof-upload-btn">
              <input
                type="file"
                className="saprof-upload-input"
                accept="image/*"
                onChange={onFileInputChange}
                disabled={uploading}
              />
              {uploading ? "Uploading..." : "Choose Image"}
            </label>
          </div>
        </div>

        {/* RIGHT: PROFILE DETAILS FORM */}
        <div className="saprof-card saprof-card-details">
          <h3 className="saprof-section-title">Profile Details</h3>

          <div className="saprof-form-grid">
            {/* Full Name */}
            <div className="saprof-form-field">
              <label className="saprof-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="saprof-input"
                value={form.fullName}
                onChange={handleFormChange}
                disabled={!isEditing}
                placeholder="Enter full name"
              />
            </div>

            {/* Email (read-only) */}
            <div className="saprof-form-field">
              <label className="saprof-label">Email</label>
              <input
                type="email"
                name="email"
                className="saprof-input saprof-input-readonly"
                value={form.email}
                disabled={true}
                readOnly
              />
            </div>

            {/* Phone */}
            <div className="saprof-form-field">
              <label className="saprof-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="saprof-input"
                value={form.phone}
                onChange={handleFormChange}
                disabled={!isEditing}
                placeholder="Enter phone number"
              />
            </div>

            {/* Address */}
            <div className="saprof-form-field saprof-form-field-full">
              <label className="saprof-label">Address</label>
              <textarea
                name="address"
                className="saprof-textarea"
                rows={3}
                value={form.address}
                onChange={handleFormChange}
                disabled={!isEditing}
                placeholder="Enter address"
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          {isEditing && (
            <div className="saprof-actions-row">
              <button
                type="button"
                className="saprof-btn saprof-btn-secondary"
                onClick={cancelEditing}
                disabled={detailsLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="saprof-btn saprof-btn-primary"
                onClick={saveProfileDetails}
                disabled={detailsLoading}
              >
                {detailsLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {/* STATUS MESSAGES (details + avatar share same area) */}
          {errorMsg && (
            <p className="saprof-msg saprof-msg-error">{errorMsg}</p>
          )}

          {successMsg && (
            <div className="saprof-msg saprof-msg-success">
              <span className="saprof-success-icon">âœ”</span>
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* ------------------ CROP POPUP ------------------ */}
      {showCropper && tempImage && (
        <AvatarCropper
          image={tempImage}
          onCancel={() => {
            setShowCropper(false);
            setTempImage(null);
          }}
          onSave={(cropped) => uploadCroppedImage(cropped)}
        />
      )}
    </div>
  );
};

export default SuperAdminProfile;

