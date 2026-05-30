// frontend/src/superadmin/UserManagement/CreativeDesignEditor.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaSync, FaRegImages, FaImage } from "react-icons/fa";
import { API_BASE_URL } from "../../config";
import Loader from "../../components/Loader/Loader";
import "./CreativeDesignEditor.css";

const CreativeDesignEditor = () => {
  const [loading, setLoading] = useState(true);
  const [designs, setDesigns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Event Poster",
    audience: "registered",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [sourceType, setSourceType] = useState("file"); // "file" or "link"

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/superadmin/creative-designs/all`);
      if (res.data.success) {
        setDesigns(res.data.designs);
      }
    } catch (error) {
      console.error("Error fetching designs:", error);
      const isNetworkError = !error.response;
      const errMsg = isNetworkError
        ? "Network Error: Backend server may not be running on port 1981"
        : `Server Error (${error.response.status}): ${error.response.data?.message || error.message}`;
      alert(`Failed to load designs: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "Event Poster",
      audience: "registered",
      imageUrl: "",
    });
    setImageFile(null);
    setImagePreview("");
    setSourceType("file");
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditDesign = (design) => {
    setFormData({
      title: design.title,
      category: design.category,
      audience: design.audience || "registered",
      imageUrl: design.url.startsWith("http") ? design.url : "",
    });
    setEditingId(design._id);
    setShowForm(true);

    if (design.url.startsWith("http")) {
      setSourceType("link");
      setImagePreview(design.url);
    } else {
      setSourceType("file");
      setImagePreview(`${API_BASE_URL}/${design.url}`);
    }
    setImageFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDesign = async () => {
    if (!formData.title.trim() || !formData.category.trim()) {
      alert("Title and Category are required");
      return;
    }

    if (sourceType === "file" && !imageFile && !editingId) {
      alert("Please upload an image file");
      return;
    }

    if (sourceType === "link" && !formData.imageUrl.trim()) {
      alert("Please provide an image link URL");
      return;
    }

    setSubmitting(true);
    try {
      const token = sessionStorage.getItem("TOKEN");
      const formDataObj = new FormData();

      formDataObj.append("title", formData.title.trim());
      formDataObj.append("category", formData.category.trim());
      formDataObj.append("audience", formData.audience);

      if (sourceType === "file" && imageFile) {
        formDataObj.append("image", imageFile);
      } else if (sourceType === "link") {
        formDataObj.append("imageUrl", formData.imageUrl.trim());
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      let res;
      if (editingId) {
        res = await axios.put(
          `${API_BASE_URL}/api/superadmin/creative-designs/update/${editingId}`,
          formDataObj,
          config
        );
      } else {
        res = await axios.post(
          `${API_BASE_URL}/api/superadmin/creative-designs/create`,
          formDataObj,
          config
        );
      }

      if (res.data.success) {
        alert(editingId ? "Creative design updated successfully!" : "Creative design created successfully!");
        fetchDesigns();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving design:", error);
      alert(error.response?.data?.message || "Failed to save design");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDesign = async (id) => {
    if (!window.confirm("Are you sure you want to delete this creative design?")) return;

    try {
      const token = sessionStorage.getItem("TOKEN");
      const res = await axios.delete(
        `${API_BASE_URL}/api/superadmin/creative-designs/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert("Design deleted successfully!");
        fetchDesigns();
      }
    } catch (error) {
      console.error("Error deleting design:", error);
      alert(error.response?.data?.message || "Failed to delete design");
    }
  };

  const getDesignImage = (url) => {
    if (url.startsWith("http")) {
      return url;
    }
    return `${API_BASE_URL}/${url}`;
  };

  return (
    <div className="CreativeDesignEditor-container">
      <div className="CreativeDesignEditor-header">
        <div className="CreativeDesignEditor-title-section">
          <p className="CreativeDesignEditor-subtitle">User Management &gt; Creative Designs</p>
          <h1 className="CreativeDesignEditor-title">Creative Designs &amp; Posters Editor</h1>
          <p className="CreativeDesignEditor-description-text">
            Publish event posters, milestone cards, music covers, and brand graphics to the landing showrooms.
          </p>
        </div>
        <button onClick={fetchDesigns} className="CreativeDesignEditor-refresh-btn">
          <FaSync className="CreativeDesignEditor-icon-spin" /> Refresh Data
        </button>
      </div>

      <div className="CreativeDesignEditor-workspace">
        {/* Left Control Panel */}
        <div className="CreativeDesignEditor-left-panel">
          <Link to="/superadmin/user-management" className="CreativeDesignEditor-back-btn">
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <button onClick={() => setShowForm(true)} className="CreativeDesignEditor-add-btn">
            <FaPlus /> Add New Design
          </button>
        </div>

        {/* Right Container Panel */}
        <div className="CreativeDesignEditor-right-panel">
          {loading ? (
            <div className="CreativeDesignEditor-loader-wrapper">
              <Loader />
            </div>
          ) : (
            <div className="CreativeDesignEditor-designs-grid">
              {designs.length === 0 ? (
                <div className="CreativeDesignEditor-empty-state">
                  <p className="CreativeDesignEditor-empty-text">
                    No creative designs found. Add a design to display beautiful branding assets.
                  </p>
                </div>
              ) : (
                designs.map((design) => (
                  <div key={design._id} className="CreativeDesignEditor-design-card">
                    {/* Red Circular Edit badge in top-right of card */}
                    <button
                      onClick={() => handleEditDesign(design)}
                      className="CreativeDesignEditor-edit-badge"
                      title="Edit Design"
                    >
                      <FaEdit />
                    </button>

                    <div className="CreativeDesignEditor-image-wrap">
                      <img src={getDesignImage(design.url)} alt={design.title} />
                      <div className="CreativeDesignEditor-audience-badge">
                        {design.audience === "public" ? "🌍 Public" : "🔒 Registered"}
                      </div>
                    </div>

                    <div className="CreativeDesignEditor-design-info">
                      <h3 className="CreativeDesignEditor-card-title">{design.title}</h3>
                      <p className="CreativeDesignEditor-card-category">{design.category}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Popup Overlay for Creating/Editing Designs */}
      {showForm && (
        <div className="CreativeDesignEditor-modal-overlay" onClick={resetForm}>
          <div className="CreativeDesignEditor-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="CreativeDesignEditor-modal-header">
              <h2 className="CreativeDesignEditor-modal-title">
                {editingId ? "Edit Creative Design Details" : "Publish New Creative Design"}
              </h2>
              <button onClick={resetForm} className="CreativeDesignEditor-close-btn">
                <FaTimes />
              </button>
            </div>

            <div className="CreativeDesignEditor-modal-body">
              <div className="CreativeDesignEditor-form-group">
                <label className="CreativeDesignEditor-form-label">Design / Poster Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Vibrant College Celebration"
                  maxLength="80"
                  className="CreativeDesignEditor-form-input"
                />
              </div>

              <div className="CreativeDesignEditor-form-group">
                <label className="CreativeDesignEditor-form-label">Graphic Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="CreativeDesignEditor-form-select"
                >
                  <option value="Event Poster">Event Poster</option>
                  <option value="Music Event">Music Event</option>
                  <option value="Milestone Invite">Milestone Invite</option>
                  <option value="Digital Ad">Digital Ad</option>
                  <option value="Social Media">Social Media</option>
                </select>
              </div>

              <div className="CreativeDesignEditor-form-group">
                <label className="CreativeDesignEditor-form-label">Visibility Status *</label>
                <select
                  name="audience"
                  value={formData.audience}
                  onChange={handleInputChange}
                  className="CreativeDesignEditor-form-select"
                >
                  <option value="registered">Registered Users Only</option>
                  <option value="public">Public Showcase (Flagship Showroom)</option>
                </select>
              </div>

              <div className="CreativeDesignEditor-image-section">
                <h3 className="CreativeDesignEditor-image-section-title">Design Image Asset *</h3>

                <div className="CreativeDesignEditor-radio-group">
                  <label className="CreativeDesignEditor-radio-label">
                    <input
                      type="radio"
                      name="sourceType"
                      checked={sourceType === "file"}
                      onChange={() => {
                        setSourceType("file");
                        setImagePreview("");
                      }}
                      className="CreativeDesignEditor-radio-input"
                    />
                    <span>Upload Image File</span>
                  </label>
                  <label className="CreativeDesignEditor-radio-label">
                    <input
                      type="radio"
                      name="sourceType"
                      checked={sourceType === "link"}
                      onChange={() => {
                        setSourceType("link");
                        setImagePreview(formData.imageUrl);
                      }}
                      className="CreativeDesignEditor-radio-input"
                    />
                    <span>Provided Image Link URL</span>
                  </label>
                </div>

                {sourceType === "file" ? (
                  <div className="CreativeDesignEditor-upload-zone">
                    <label className="CreativeDesignEditor-upload-label">
                      <FaImage className="CreativeDesignEditor-upload-icon" />
                      <span>Select Asset Image File (PNG, JPG, WEBP)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileSelect}
                        style={{ display: "none" }}
                      />
                    </label>
                    {imageFile && (
                      <p className="CreativeDesignEditor-upload-filename">
                        File chosen: <strong>{imageFile.name}</strong> ({(imageFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="CreativeDesignEditor-form-group">
                    <label className="CreativeDesignEditor-form-label">Direct Asset Image URL Link</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => {
                        handleInputChange(e);
                        setImagePreview(e.target.value);
                      }}
                      placeholder="e.g., https://res.cloudinary.com/..."
                      className="CreativeDesignEditor-form-input"
                    />
                  </div>
                )}

                {imagePreview && (
                  <div className="CreativeDesignEditor-preview-container">
                    <img src={imagePreview} alt="Design Preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="CreativeDesignEditor-modal-footer">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteDesign(editingId);
                    resetForm();
                  }}
                  className="CreativeDesignEditor-delete-btn"
                >
                  <FaTrash /> Remove Graphic Design
                </button>
              )}
              <button
                onClick={handleSaveDesign}
                className="CreativeDesignEditor-save-btn"
                disabled={submitting}
              >
                <FaSave /> {submitting ? "Publishing..." : "Commit Graphic Design"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativeDesignEditor;
