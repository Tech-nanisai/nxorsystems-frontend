import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaImage, FaSave, FaSync } from "react-icons/fa";
import { API_BASE_URL } from "../../config";
import Loader from "../../components/Loader/Loader";
import "./FlagshipOfferingCustomizer.css";

const FlagshipOfferingCustomizer = () => {
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState([]);
  const [saveLoading, setSaveLoading] = useState({ 0: false, 1: false, 2: false });

  // Separate local states for modifications
  const [slideData, setSlideData] = useState({
    0: { title: "", subtitle: "", category: "reels", imageFile: null, previewUrl: "" },
    1: { title: "", subtitle: "", category: "designs", imageFile: null, previewUrl: "" },
    2: { title: "", subtitle: "", category: "reels", imageFile: null, previewUrl: "" },
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/global/flagship-offerings/all`);
      if (res.data.success && res.data.slides) {
        setSlides(res.data.slides);
        
        // Map backend slides into form state
        const initialFormState = {};
        res.data.slides.forEach((slide) => {
          initialFormState[slide.slideIndex] = {
            title: slide.title,
            subtitle: slide.subtitle,
            category: slide.category,
            imageFile: null,
            previewUrl: getSlideImage(slide.image),
          };
        });
        setSlideData(initialFormState);
      }
    } catch (error) {
      console.error("Error fetching flagship slides:", error);
      const isNetworkError = !error.response;
      const errMsg = isNetworkError 
        ? "Network Connection Error: Please make sure your local backend server is running on port 1981 (npm run dev inside /backend) and MongoDB has connected."
        : `Server Error (Status ${error.response.status}): ${error.response.data?.message || error.message}. If this is production, please ensure your backend flagship routes have been pushed/deployed to Render.`;
      alert(`Failed to load slides: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const getSlideImage = (img) => {
    if (!img) return "";
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }
    return `${API_BASE_URL}/${img}`;
  };

  const handleInputChange = (slideIndex, field, value) => {
    setSlideData((prev) => ({
      ...prev,
      [slideIndex]: {
        ...prev[slideIndex],
        [field]: value,
      },
    }));
  };

  const handleFileChange = (slideIndex, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSlideData((prev) => ({
        ...prev,
        [slideIndex]: {
          ...prev[slideIndex],
          imageFile: file,
          previewUrl: URL.createObjectURL(file),
        },
      }));
    }
  };

  const handleSaveSlide = async (slideIndex) => {
    const data = slideData[slideIndex];
    if (!data.title.trim() || !data.subtitle.trim()) {
      alert("Title and Subtitle are required.");
      return;
    }

    setSaveLoading((prev) => ({ ...prev, [slideIndex]: true }));
    try {
      const token = sessionStorage.getItem("TOKEN");
      const formData = new FormData();
      formData.append("slideIndex", slideIndex);
      formData.append("title", data.title.trim());
      formData.append("subtitle", data.subtitle.trim());
      formData.append("category", data.category);
      
      if (data.imageFile) {
        formData.append("image", data.imageFile);
      }

      const res = await axios.put(
        `${API_BASE_URL}/api/global/flagship-offerings/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        alert(`Slide ${parseInt(slideIndex) + 1} updated successfully!`);
        // Refresh slides data
        fetchSlides();
      }
    } catch (error) {
      console.error("Error saving flagship slide:", error);
      const isNetworkError = !error.response;
      const errMsg = isNetworkError 
        ? "Network Connection Error: Please make sure your local backend server is running on port 1981 (npm run dev inside /backend) and MongoDB has connected."
        : `Server Error (Status ${error.response.status}): ${error.response.data?.message || error.message}. If this is production, please ensure your backend flagship routes have been pushed/deployed to Render.`;
      alert(`Error updating slide: ${errMsg}`);
    } finally {
      setSaveLoading((prev) => ({ ...prev, [slideIndex]: false }));
    }
  };

  return (
    <div className="FlagshipOfferingCustomizer-container">
      {/* Header */}
      <div className="FlagshipOfferingCustomizer-header">
        <p className="FlagshipOfferingCustomizer-subtitle">User Management {">"} Offering Customizer</p>
        <h1 className="FlagshipOfferingCustomizer-title">Flagship Offering Slides</h1>
        
        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          <Link to="/superadmin/user-management" className="FlagshipOfferingCustomizer-back-btn">
            <FaArrowLeft /> User Management Dashboard
          </Link>
          <button onClick={fetchSlides} className="FlagshipOfferingCustomizer-back-btn" style={{ background: "transparent", color: "#64748b", cursor: "pointer" }}>
            <FaSync /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="FlagshipOfferingCustomizer-loading-wrapper">
          <Loader />
        </div>
      ) : (
        <div className="FlagshipOfferingCustomizer-grid">
          {[0, 1, 2].map((slideIndex) => {
            const data = slideData[slideIndex] || { title: "", subtitle: "", category: "reels", previewUrl: "" };
            const isSaving = saveLoading[slideIndex];

            return (
              <div key={slideIndex} className="FlagshipOfferingCustomizer-card">
                <span className="FlagshipOfferingCustomizer-slide-badge">Slide #{slideIndex + 1}</span>
                <h3 className="FlagshipOfferingCustomizer-card-title">Configure Slide Content</h3>

                {/* Image Preview Container */}
                <div className="FlagshipOfferingCustomizer-image-preview-wrapper">
                  {data.previewUrl ? (
                    <img
                      src={data.previewUrl}
                      alt={`Slide ${slideIndex + 1} Preview`}
                      className="FlagshipOfferingCustomizer-preview-img"
                    />
                  ) : (
                    <div className="FlagshipOfferingCustomizer-placeholder-img">
                      <FaImage size={32} />
                      <span>No image selected</span>
                    </div>
                  )}
                </div>

                {/* Form controls */}
                <div className="FlagshipOfferingCustomizer-form-group">
                  <label className="FlagshipOfferingCustomizer-label">Replace Slide Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="FlagshipOfferingCustomizer-input"
                    onChange={(e) => handleFileChange(slideIndex, e)}
                  />
                </div>

                <div className="FlagshipOfferingCustomizer-form-group">
                  <label className="FlagshipOfferingCustomizer-label">Slide Campaign Title</label>
                  <input
                    type="text"
                    className="FlagshipOfferingCustomizer-input"
                    placeholder="Enter slide campaign title..."
                    value={data.title}
                    onChange={(e) => handleInputChange(slideIndex, "title", e.target.value)}
                  />
                </div>

                <div className="FlagshipOfferingCustomizer-form-group">
                  <label className="FlagshipOfferingCustomizer-label">Slide Campaign Description</label>
                  <textarea
                    className="FlagshipOfferingCustomizer-textarea"
                    placeholder="Enter slide campaign description..."
                    value={data.subtitle}
                    onChange={(e) => handleInputChange(slideIndex, "subtitle", e.target.value)}
                  />
                </div>

                <div className="FlagshipOfferingCustomizer-form-group">
                  <label className="FlagshipOfferingCustomizer-label">Redirect Category Tab</label>
                  <select
                    className="FlagshipOfferingCustomizer-select"
                    value={data.category}
                    onChange={(e) => handleInputChange(slideIndex, "category", e.target.value)}
                  >
                    <option value="reels">Entertainment Reels</option>
                    <option value="designs">Creative Designs & Posters</option>
                  </select>
                </div>

                <button
                  onClick={() => handleSaveSlide(slideIndex)}
                  className="FlagshipOfferingCustomizer-submit-btn"
                  disabled={isSaving}
                >
                  <FaSave /> {isSaving ? "Saving slide..." : "Save Slide Configurations"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FlagshipOfferingCustomizer;
