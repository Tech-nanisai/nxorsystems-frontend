import React, { useState } from "react";
import axios from "axios";
import "./AssignProject.css";

const AssignProject = ({ isModal = false, onSuccess }) => {
  const [formData, setFormData] = useState({
    clientID: "",
    title: "",
    description: "",
    status: "Pending",
    deadline: "",
    progress: 0,
  });
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: "", text: "" });
    setIsGenerating(true); // Start Loader

    try {
      const res = await axios.post("https://nxorsystems-backend-xglw.onrender.com/api/superadmin/data/create-project", formData);
      if (res.data.success) {
        // Enforce 5 second delay for "Generating" effect
        setTimeout(() => {
          setIsGenerating(false); // Stop Loader
          setStatusMsg({ type: "success", text: "Project assigned to client successfully!" });
          setFormData({ clientID: "", title: "", description: "", status: "Pending", deadline: "", progress: 0 });

          if (isModal && onSuccess) {
            onSuccess();
          }
        }, 5000);
      } else {
        setIsGenerating(false);
        setStatusMsg({ type: "error", text: "Failed to create project." });
      }
    } catch (err) {
      setIsGenerating(false);
      setStatusMsg({ type: "error", text: err.response?.data?.message || "Failed to assign project." });
    }
  };

  if (isGenerating) {
    return (
      <div className="modal-loader-container">
        <div className="modal-loader"></div>
        <p className="modal-loader-text">Generating Project...</p>
      </div>
    );
  }

  const containerClass = isModal ? "AssignProject-modal-wrapper" : "AssignProject-container";
  const cardClass = isModal ? "" : "AssignProject-card";

  return (
    <div className={containerClass}>
      {!isModal && (
        <div className="AssignProject-header">
          <h2 className="AssignProject-title">Generate Project</h2>
          <p className="AssignProject-subtitle">CM {'>'} Projects {'>'} Generate Project</p>
        </div>
      )}

      <div className={cardClass}>
        {isModal && <h2 className="AssignProject-section-heading" style={{ textAlign: 'center', marginBottom: '2rem' }}>Assign New Project</h2>}
        {!isModal && <h2 className="AssignProject-section-heading">Assign Project</h2>}

        <form className="AssignProject-form" onSubmit={handleSubmit}>

          <div className="input-group">
            <label className="field-label">Client ID (Target)</label>
            <input
              type="text"
              name="clientID"
              className="text-input-field"
              value={formData.clientID}
              onChange={handleChange}
              required
              placeholder="e.g. CL10003"
            />
          </div>

          <div className="input-group">
            <label className="field-label">Project Title</label>
            <input
              type="text"
              name="title"
              className="text-input-field"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. E-Commerce Website Redesign"
            />
          </div>

          <div className="input-group">
            <label className="field-label">Description</label>
            <textarea
              name="description"
              className="textarea-field"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="form-row-split">
            <div className="input-group">
              <label className="field-label">Current Status</label>
              <select name="status" className="select-dropdown" value={formData.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="input-group">
              <label className="field-label">Deadline</label>
              <input
                type="date"
                name="deadline"
                className="text-input-field"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="field-label">Completion ({formData.progress}%)</label>
            <input
              type="range"
              name="progress"
              className="range-slider"
              min="0" max="100"
              value={formData.progress}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-action-btn">Confirm Assignment</button>

          {statusMsg.text && !isModal && (
            <div className={`status-message ${statusMsg.type}`}>
              {statusMsg.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AssignProject;
