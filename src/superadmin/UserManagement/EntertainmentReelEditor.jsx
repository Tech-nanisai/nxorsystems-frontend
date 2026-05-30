import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaSync, FaVideo, FaFileVideo } from "react-icons/fa";
import { API_BASE_URL } from "../../config";
import Loader from "../../components/Loader/Loader";
import "./EntertainmentReelEditor.css";

const EntertainmentReelEditor = () => {
  const [loading, setLoading] = useState(true);
  const [reels, setReels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    avatar: "",
    instagram: "",
    rating: 5,
    comment: "",
    videos: [],
    audience: "registered",
  });

  const [newVideoFiles, setNewVideoFiles] = useState([]);
  const [newVideoLinks, setNewVideoLinks] = useState([]);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/superadmin/entertainment-reels/all`);
      if (res.data.success) {
        setReels(res.data.reels);
      }
    } catch (error) {
      console.error("Error fetching reels:", error);
      const isNetworkError = !error.response;
      const errMsg = isNetworkError
        ? "Network Error: Backend server may not be running on port 1981"
        : `Server Error (${error.response.status}): ${error.response.data?.message || error.message}`;
      alert(`Failed to load reels: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      avatar: "",
      instagram: "",
      rating: 5,
      comment: "",
      videos: [],
      audience: "registered",
    });
    setNewVideoFiles([]);
    setNewVideoLinks([]);
    setLinkTitle("");
    setLinkUrl("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditReel = (reel) => {
    setFormData({ audience: "registered", ...reel });
    setEditingId(reel._id);
    setShowForm(true);
    setNewVideoFiles([]);
    setNewVideoLinks([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleVideoFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setNewVideoFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveNewVideo = (index) => {
    setNewVideoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingVideo = (index) => {
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const handleAddVideoLink = () => {
    if (!linkTitle.trim() || !linkUrl.trim()) {
      alert("Both Video Title and Video URL are required.");
      return;
    }
    setNewVideoLinks((prev) => [...prev, { title: linkTitle.trim(), videoUrl: linkUrl.trim() }]);
    setLinkTitle("");
    setLinkUrl("");
  };

  const handleRemoveVideoLink = (index) => {
    setNewVideoLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveReel = async () => {
    if (!formData.name.trim() || !formData.role.trim() || !formData.avatar.trim() || !formData.comment.trim()) {
      alert("Name, Role, Avatar, and Comment are required");
      return;
    }

    const totalVideos = (formData.videos?.length || 0) + newVideoFiles.length + newVideoLinks.length;
    if (totalVideos === 0) {
      alert("Please add at least one video (file or link)");
      return;
    }

    setSubmitting(true);
    try {
      const token = sessionStorage.getItem("TOKEN");
      const formDataObj = new FormData();

      formDataObj.append("name", formData.name.trim());
      formDataObj.append("role", formData.role.trim());
      formDataObj.append("avatar", formData.avatar.trim());
      formDataObj.append("instagram", formData.instagram ? formData.instagram.trim() : "");
      formDataObj.append("rating", formData.rating);
      formDataObj.append("comment", formData.comment.trim());
      formDataObj.append("audience", formData.audience || "registered");
      formDataObj.append("existingVideos", JSON.stringify(formData.videos || []));
      formDataObj.append("videoLinks", JSON.stringify(newVideoLinks));

      // Add new video files
      newVideoFiles.forEach((file) => {
        formDataObj.append("videos", file);
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      let res;
      if (editingId) {
        res = await axios.put(
          `${API_BASE_URL}/api/superadmin/entertainment-reels/update/${editingId}`,
          formDataObj,
          config
        );
      } else {
        res = await axios.post(
          `${API_BASE_URL}/api/superadmin/entertainment-reels/create`,
          formDataObj,
          config
        );
      }

      if (res.data.success) {
        alert(editingId ? "Reel updated successfully!" : "Reel created successfully!");
        fetchReels();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving reel:", error);
      alert(error.response?.data?.message || "Failed to save reel");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReel = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reel? This will also delete all videos.")) return;

    try {
      const token = sessionStorage.getItem("TOKEN");
      const res = await axios.delete(
        `${API_BASE_URL}/api/superadmin/entertainment-reels/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert("Reel deleted successfully!");
        fetchReels();
      }
    } catch (error) {
      console.error("Error deleting reel:", error);
      alert(error.response?.data?.message || "Failed to delete reel");
    }
  };

  const handleDeleteVideo = async (reelId, videoIndex) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      const token = sessionStorage.getItem("TOKEN");
      const res = await axios.delete(
        `${API_BASE_URL}/api/superadmin/entertainment-reels/${reelId}/delete-video/${videoIndex}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert("Video deleted successfully!");
        fetchReels();
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      alert(error.response?.data?.message || "Failed to delete video");
    }
  };

  const getVideoThumbnail = (videoUrl) => {
    if (videoUrl.startsWith("http")) {
      return videoUrl;
    }
    return `${API_BASE_URL}/${videoUrl}`;
  };

  return (
    <div className="EntertainmentReelEditor-container">
      <div className="EntertainmentReelEditor-header">
        <div className="EntertainmentReelEditor-title-section">
          <p className="EntertainmentReelEditor-subtitle">User Management &gt; Entertainment Reels</p>
          <h1 className="EntertainmentReelEditor-title">Entertainment Reels Editor</h1>
          <p className="EntertainmentReelEditor-description-text">
            Manage high-tempo cinematic video reels, ratings, and testimonies displayed across customer portals.
          </p>
        </div>
        <button onClick={fetchReels} className="EntertainmentReelEditor-refresh-btn">
          <FaSync className="EntertainmentReelEditor-icon-spin" /> Refresh Data
        </button>
      </div>

      <div className="EntertainmentReelEditor-workspace">
        {/* Left Control Panel */}
        <div className="EntertainmentReelEditor-left-panel">
          <Link to="/superadmin/user-management" className="EntertainmentReelEditor-back-btn">
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <button onClick={() => setShowForm(true)} className="EntertainmentReelEditor-add-btn">
            <FaPlus /> Add New Reel
          </button>
        </div>

        {/* Right Container Panel */}
        <div className="EntertainmentReelEditor-right-panel">
          {loading ? (
            <div className="EntertainmentReelEditor-loader-wrapper">
              <Loader />
            </div>
          ) : (
            <div className="EntertainmentReelEditor-reels-grid">
              {reels.length === 0 ? (
                <div className="EntertainmentReelEditor-empty-state">
                  <p className="EntertainmentReelEditor-empty-text">
                    No entertainment reels found. Create a new reel card to begin showcasing cinematic content.
                  </p>
                </div>
              ) : (
                reels.map((reel) => (
                  <div key={reel._id} className="EntertainmentReelEditor-reel-card">
                    {/* Red Circular Edit badge in top-right of card */}
                    <button
                      onClick={() => handleEditReel(reel)}
                      className="EntertainmentReelEditor-edit-badge"
                      title="Edit Reel"
                    >
                      <FaEdit />
                    </button>

                    <div className="EntertainmentReelEditor-reel-header">
                      <div className="EntertainmentReelEditor-avatar-circle">{reel.avatar}</div>
                      <div className="EntertainmentReelEditor-creator-details">
                        <h3 className="EntertainmentReelEditor-name">{reel.name}</h3>
                        <p className="EntertainmentReelEditor-role">{reel.role}</p>
                        {reel.instagram && (
                          <p className="EntertainmentReelEditor-instagram">
                            <span className="EntertainmentReelEditor-ig-icon">📱</span> {reel.instagram}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="EntertainmentReelEditor-rating">
                      {"★".repeat(reel.rating)}{"☆".repeat(5 - reel.rating)}
                    </div>

                    <p className="EntertainmentReelEditor-comment">"{reel.comment}"</p>

                    {/* Auto-playing video preview on hover */}
                    {reel.videos && reel.videos.length > 0 && (
                      <div className="EntertainmentReelEditor-preview-wrapper">
                        <video
                          src={getVideoThumbnail(reel.videos[0].videoUrl)}
                          muted
                          playsInline
                          loop
                          onMouseEnter={(e) => e.target.play().catch(() => {})}
                          onMouseLeave={(e) => e.target.pause()}
                          className="EntertainmentReelEditor-video-thumbnail"
                        />
                        <div className="EntertainmentReelEditor-video-info">
                          Hover to play video • {reel.videos.length} Clip(s)
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Popup Overlay for Creating/Editing Reels */}
      {showForm && (
        <div className="EntertainmentReelEditor-modal-overlay" onClick={resetForm}>
          <div className="EntertainmentReelEditor-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="EntertainmentReelEditor-modal-header">
              <h2 className="EntertainmentReelEditor-modal-title">
                {editingId ? "Edit Reel Specifications" : "Configure New Cinematic Reel"}
              </h2>
              <button onClick={resetForm} className="EntertainmentReelEditor-close-btn">
                <FaTimes />
              </button>
            </div>

            <div className="EntertainmentReelEditor-modal-body">
              <div className="EntertainmentReelEditor-form-group">
                <label className="EntertainmentReelEditor-form-label">Creator / Customer Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Rupa"
                  maxLength="50"
                  className="EntertainmentReelEditor-form-input"
                />
              </div>

              <div className="EntertainmentReelEditor-form-group">
                <label className="EntertainmentReelEditor-form-label">Creator Role / Niche *</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="e.g., Travel & Lifestyle Vlog"
                  maxLength="50"
                  className="EntertainmentReelEditor-form-input"
                />
              </div>

              <div className="EntertainmentReelEditor-form-row">
                <div className="EntertainmentReelEditor-form-group">
                  <label className="EntertainmentReelEditor-form-label">Avatar Initials (2 Chars) *</label>
                  <input
                    type="text"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="e.g., RU"
                    maxLength="2"
                    className="EntertainmentReelEditor-form-input"
                  />
                </div>

                <div className="EntertainmentReelEditor-form-group">
                  <label className="EntertainmentReelEditor-form-label">Rating Score</label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="EntertainmentReelEditor-form-select"
                  >
                    <option value="5">★★★★★ 5 Stars</option>
                    <option value="4">★★★★☆ 4 Stars</option>
                    <option value="3">★★★☆☆ 3 Stars</option>
                    <option value="2">★★☆☆☆ 2 Stars</option>
                    <option value="1">★☆☆☆☆ 1 Star</option>
                  </select>
                </div>
              </div>

              <div className="EntertainmentReelEditor-form-group">
                <label className="EntertainmentReelEditor-form-label">Instagram Handle</label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  placeholder="@username"
                  maxLength="50"
                  className="EntertainmentReelEditor-form-input"
                />
              </div>

              <div className="EntertainmentReelEditor-form-group">
                <label className="EntertainmentReelEditor-form-label">Visibility Status *</label>
                <select
                  name="audience"
                  value={formData.audience || "registered"}
                  onChange={handleInputChange}
                  className="EntertainmentReelEditor-form-select"
                >
                  <option value="registered">Registered Users Only</option>
                  <option value="public">Public Showcase (Flagship Showroom)</option>
                </select>
              </div>

              <div className="EntertainmentReelEditor-form-group">
                <label className="EntertainmentReelEditor-form-label">Testimonial Comment *</label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  placeholder="Share the testimonial critique..."
                  rows="4"
                  className="EntertainmentReelEditor-form-textarea"
                />
              </div>

              <div className="EntertainmentReelEditor-video-section">
                <h3 className="EntertainmentReelEditor-video-section-title">Video Assets Curation</h3>

                {/* Existing Videos (for editing) */}
                {formData.videos && formData.videos.length > 0 && (
                  <div className="EntertainmentReelEditor-existing-videos">
                    <p className="EntertainmentReelEditor-existing-videos-title">
                      Currently Attached Video Clips:
                    </p>
                    {formData.videos.map((video, idx) => (
                      <div key={idx} className="EntertainmentReelEditor-video-item">
                        <div>
                          <p className="EntertainmentReelEditor-video-title">{video.title}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingVideo(idx)}
                          className="EntertainmentReelEditor-remove-video-btn"
                          title="Remove this video clip"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Video File Upload */}
                <div className="EntertainmentReelEditor-video-upload-section">
                  <label className="EntertainmentReelEditor-upload-label">
                    <FaFileVideo className="EntertainmentReelEditor-upload-icon" />
                    <span>Choose Video Asset Files (MP4, WebM, MOV)</span>
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={handleVideoFileSelect}
                      style={{ display: "none" }}
                    />
                  </label>
                  <p className="EntertainmentReelEditor-upload-help">
                    You can multi-select video files for batch attachments.
                  </p>
                </div>

                {/* External Video Links section */}
                <div className="EntertainmentReelEditor-link-section">
                  <h4 className="EntertainmentReelEditor-link-section-title">Add Cloud Asset Links (Cloudinary/External CDN)</h4>
                  <div className="EntertainmentReelEditor-link-form">
                    <input
                      type="text"
                      placeholder="Asset Title (e.g., Intro High Tempo)"
                      value={linkTitle}
                      onChange={(e) => setLinkTitle(e.target.value)}
                      className="EntertainmentReelEditor-link-title-input"
                    />
                    <input
                      type="url"
                      placeholder="Asset URL (https://res.cloudinary.com/...)"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="EntertainmentReelEditor-link-url-input"
                    />
                    <button
                      type="button"
                      onClick={handleAddVideoLink}
                      className="EntertainmentReelEditor-add-link-btn"
                    >
                      Attach Link
                    </button>
                  </div>
                </div>

                {/* Display Newly Added Video Links */}
                {newVideoLinks.length > 0 && (
                  <div className="EntertainmentReelEditor-links-list">
                    <p className="EntertainmentReelEditor-links-list-title">
                      Staged Video Links to Add:
                    </p>
                    {newVideoLinks.map((link, idx) => (
                      <div key={idx} className="EntertainmentReelEditor-link-item">
                        <div className="EntertainmentReelEditor-link-details">
                          <p className="EntertainmentReelEditor-link-title">{link.title}</p>
                          <p className="EntertainmentReelEditor-link-url">🔗 {link.videoUrl}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVideoLink(idx)}
                          className="EntertainmentReelEditor-remove-video-btn"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Videos Preview */}
                {newVideoFiles.length > 0 && (
                  <div className="EntertainmentReelEditor-new-uploads-list">
                    <p className="EntertainmentReelEditor-new-uploads-title">
                      Staged Video Files to Upload:
                    </p>
                    {newVideoFiles.map((file, idx) => (
                      <div key={idx} className="EntertainmentReelEditor-new-upload-item">
                        <div className="EntertainmentReelEditor-new-upload-details">
                          <p className="EntertainmentReelEditor-new-upload-title">{file.name}</p>
                          <p className="EntertainmentReelEditor-new-upload-size">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveNewVideo(idx)}
                          className="EntertainmentReelEditor-remove-video-btn"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="EntertainmentReelEditor-modal-footer">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteReel(editingId);
                    resetForm();
                  }}
                  className="EntertainmentReelEditor-delete-btn"
                >
                  <FaTrash /> Remove Reel Card
                </button>
              )}
              <button
                onClick={handleSaveReel}
                className="EntertainmentReelEditor-save-btn"
                disabled={submitting}
              >
                <FaSave /> {submitting ? "Processing..." : "Commit Reel Card"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntertainmentReelEditor;
