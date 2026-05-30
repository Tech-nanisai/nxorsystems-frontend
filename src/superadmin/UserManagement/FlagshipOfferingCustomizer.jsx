// frontend/src/superadmin/UserManagement/FlagshipOfferingCustomizer.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPlus, FaSave, FaSync, FaTimes, FaImage, FaEdit } from "react-icons/fa";
import { API_BASE_URL } from "../../config";
import Loader from "../../components/Loader/Loader";
import "./FlagshipOfferingCustomizer.css";

const FlagshipOfferingCustomizer = () => {
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSlideIndex, setEditingSlideIndex] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    category: "reels",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [sourceType, setSourceType] = useState("file"); // "file" or "link"

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/global/flagship-offerings/all`);
      if (res.data.success && res.data.slides) {
        // Sort slides by slideIndex ascending
        const sorted = res.data.slides.sort((a, b) => a.slideIndex - b.slideIndex);
        setSlides(sorted);
      }
    } catch (error) {
      console.error("Error fetching flagship slides:", error);
      const isNetworkError = !error.response;
      const errMsg = isNetworkError
        ? "Network Connection Error: Please make sure your local backend server is running on port 1981."
        : `Server Error (${error.response.status}): ${error.response.data?.message || error.message}`;
      alert(`Failed to load slides: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      category: "reels",
      imageUrl: "",
    });
    setImageFile(null);
    setImagePreview("");
    setSourceType("file");
    setEditingSlideIndex(null);
    setShowForm(false);
  };

  const handleEditSlide = (slide) => {
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      category: slide.category || "reels",
      imageUrl: slide.image.startsWith("http") ? slide.image : "",
    });
    setEditingSlideIndex(slide.slideIndex);
    setShowForm(true);

    if (slide.image.startsWith("http")) {
      setSourceType("link");
      setImagePreview(slide.image);
    } else {
      setSourceType("file");
      setImagePreview(`${API_BASE_URL}/${slide.image}`);
    }
    setImageFile(null);
  };

  const handleCreateNewSlide = () => {
    setFormData({
      title: "",
      subtitle: "",
      category: "reels",
      imageUrl: "",
    });
    setEditingSlideIndex(slides.length);
    setShowForm(true);
    setSourceType("file");
    setImagePreview("");
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

  const handleSaveSlide = async () => {
    if (!formData.title.trim() || !formData.subtitle.trim()) {
      alert("Title and Description are required");
      return;
    }

    const isExisting = slides.some((s) => s.slideIndex === editingSlideIndex);

    if (sourceType === "file" && !imageFile && !isExisting) {
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
      formDataObj.append("slideIndex", editingSlideIndex);
      formDataObj.append("title", formData.title.trim());
      formDataObj.append("subtitle", formData.subtitle.trim());
      formDataObj.append("category", formData.category);

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
        withCredentials: true,
      };

      const res = await axios.put(
        `${API_BASE_URL}/api/global/flagship-offerings/update`,
        formDataObj,
        config
      );

      if (res.data.success) {
        alert(isExisting ? `Slide #${parseInt(editingSlideIndex) + 1} updated successfully!` : "New Flagship Slide created successfully!");
        fetchSlides();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving flagship slide:", error);
      alert(error.response?.data?.message || "Failed to save slide configurations");
    } finally {
      setSubmitting(false);
    }
  };

  const getSlideImage = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) {
      return img;
    }
    return `${API_BASE_URL}/${img}`;
  };

  return (
    <div className="FlagshipOfferingCustomizer-container">
      <div className="FlagshipOfferingCustomizer-header">
        <div className="FlagshipOfferingCustomizer-title-section">
          <p className="FlagshipOfferingCustomizer-subtitle">User Management &gt; Offering Customizer</p>
          <h1 className="FlagshipOfferingCustomizer-title">Flagship Offering Customizer</h1>
          <p className="FlagshipOfferingCustomizer-description-text">
            Configure dynamic brand campaign slides highlighted on the public landing page showroom.
          </p>
        </div>
        <button onClick={fetchSlides} className="FlagshipOfferingCustomizer-refresh-btn">
          <FaSync className="FlagshipOfferingCustomizer-icon-spin" /> Refresh Data
        </button>
      </div>

      <div className="FlagshipOfferingCustomizer-workspace">
        {/* Left Control Panel */}
        <div className="FlagshipOfferingCustomizer-left-panel">
          <Link to="/superadmin/user-management" className="FlagshipOfferingCustomizer-back-btn">
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <button onClick={handleCreateNewSlide} className="FlagshipOfferingCustomizer-add-btn">
            <FaPlus /> Add Flagship Slide
          </button>
        </div>

        {/* Right Container Panel */}
        <div className="FlagshipOfferingCustomizer-right-panel">
          {loading ? (
            <div className="FlagshipOfferingCustomizer-loader-wrapper">
              <Loader />
            </div>
          ) : (
            <div className="FlagshipOfferingCustomizer-slides-grid">
              {slides.length === 0 ? (
                <div className="FlagshipOfferingCustomizer-empty-state">
                  <p className="FlagshipOfferingCustomizer-empty-text">
                    No flagship offering slides found. Create a new slide to begin showcasing.
                  </p>
                </div>
              ) : (
                slides.map((slide) => (
                  <div key={slide._id || slide.slideIndex} className="FlagshipOfferingCustomizer-slide-card">
                    {/* Red Circular Edit badge in top-right of card */}
                    <button
                      onClick={() => handleEditSlide(slide)}
                      className="FlagshipOfferingCustomizer-edit-badge"
                      title="Edit Slide Content"
                    >
                      <FaEdit />
                    </button>

                    <div className="FlagshipOfferingCustomizer-image-wrap">
                      <img src={getSlideImage(slide.image)} alt={slide.title} />
                      <div className="FlagshipOfferingCustomizer-badge-index">
                        Slide #{slide.slideIndex + 1}
                      </div>
                    </div>

                    <div className="FlagshipOfferingCustomizer-slide-info">
                      <h3 className="FlagshipOfferingCustomizer-card-title">{slide.title}</h3>
                      <p className="FlagshipOfferingCustomizer-card-desc">{slide.subtitle}</p>
                      <div className="FlagshipOfferingCustomizer-card-category-wrapper">
                        <span className="FlagshipOfferingCustomizer-card-category-label">Target View:</span>
                        <span className="FlagshipOfferingCustomizer-card-category-value">
                          {slide.category === "reels" ? "Entertainment Reels" : "Creative Designs"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Popup Overlay for Editing Slides */}
      {showForm && (
        <div className="FlagshipOfferingCustomizer-modal-overlay" onClick={resetForm}>
          <div className="FlagshipOfferingCustomizer-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="FlagshipOfferingCustomizer-modal-header">
              <h2 className="FlagshipOfferingCustomizer-modal-title">
                {slides.some((s) => s.slideIndex === editingSlideIndex)
                  ? `Modify Slide Slot #${editingSlideIndex + 1}`
                  : `Configure Slide Slot #${editingSlideIndex + 1}`}
              </h2>
              <button onClick={resetForm} className="FlagshipOfferingCustomizer-close-btn">
                <FaTimes />
              </button>
            </div>

            <div className="FlagshipOfferingCustomizer-modal-body">
              <div className="FlagshipOfferingCustomizer-form-group">
                <label className="FlagshipOfferingCustomizer-form-label">Campaign Headline *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., HOOK YOUR AUDIENCE INSTANTLY"
                  maxLength="80"
                  className="FlagshipOfferingCustomizer-form-input"
                />
              </div>

              <div className="FlagshipOfferingCustomizer-form-group">
                <label className="FlagshipOfferingCustomizer-form-label">Campaign Description *</label>
                <textarea
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  placeholder="e.g., Premium Cinematic Reels Editing optimized for maximum audience retention and high-tempo beat syncing..."
                  rows="4"
                  className="FlagshipOfferingCustomizer-form-textarea"
                />
              </div>

              <div className="FlagshipOfferingCustomizer-form-group">
                <label className="FlagshipOfferingCustomizer-form-label">Redirect Tab Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="FlagshipOfferingCustomizer-form-select"
                >
                  <option value="reels">Entertainment Reels</option>
                  <option value="designs">Creative Designs & Posters</option>
                </select>
              </div>

              <div className="FlagshipOfferingCustomizer-image-section">
                <h3 className="FlagshipOfferingCustomizer-image-section-title">Slide Visual Asset *</h3>

                <div className="FlagshipOfferingCustomizer-radio-group">
                  <label className="FlagshipOfferingCustomizer-radio-label">
                    <input
                      type="radio"
                      name="sourceType"
                      checked={sourceType === "file"}
                      onChange={() => {
                        setSourceType("file");
                        setImagePreview("");
                      }}
                      className="FlagshipOfferingCustomizer-radio-input"
                    />
                    <span>Upload Local File</span>
                  </label>
                  <label className="FlagshipOfferingCustomizer-radio-label">
                    <input
                      type="radio"
                      name="sourceType"
                      checked={sourceType === "link"}
                      onChange={() => {
                        setSourceType("link");
                        setImagePreview(formData.imageUrl);
                      }}
                      className="FlagshipOfferingCustomizer-radio-input"
                    />
                    <span>Cloudinary / External Link</span>
                  </label>
                </div>

                {sourceType === "file" ? (
                  <div className="FlagshipOfferingCustomizer-upload-zone">
                    <label className="FlagshipOfferingCustomizer-upload-label">
                      <FaImage className="FlagshipOfferingCustomizer-upload-icon" />
                      <span>Select Asset Image (PNG, JPG, WEBP)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileSelect}
                        style={{ display: "none" }}
                      />
                    </label>
                    {imageFile && (
                      <p className="FlagshipOfferingCustomizer-upload-filename">
                        File selected: <strong>{imageFile.name}</strong> ({(imageFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="FlagshipOfferingCustomizer-form-group">
                    <label className="FlagshipOfferingCustomizer-form-label">Direct Asset Link URL</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => {
                        handleInputChange(e);
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://res.cloudinary.com/..."
                      className="FlagshipOfferingCustomizer-form-input"
                    />
                  </div>
                )}

                {imagePreview && (
                  <div className="FlagshipOfferingCustomizer-preview-container">
                    <img src={imagePreview} alt="Campaign Preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="FlagshipOfferingCustomizer-modal-footer">
              <button onClick={resetForm} className="FlagshipOfferingCustomizer-cancel-btn">
                Cancel
              </button>
              <button
                onClick={handleSaveSlide}
                className="FlagshipOfferingCustomizer-save-btn"
                disabled={submitting}
              >
                <FaSave /> {submitting ? "Saving Config..." : "Commit Slide Configuration"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlagshipOfferingCustomizer;
