//frontend/src/client/Projects/ProjectDetails.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaFileAlt, FaCheckCircle, FaClock } from "react-icons/fa";
import "./ProjectDetails.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // MOCK DATA - In real app, fetch based on 'id'
  const project = {
    id: id,
    title: "E-Commerce Website Revamp",
    description: "Complete redesign of the main online store, including new UI/UX, checkout flow optimization, and mobile responsiveness upgrades.",
    status: "In Progress",
    deadline: "Dec 30, 2025",
    milestones: [
      { title: "Requirements Gathering", completed: true },
      { title: "UI/UX Design Mockups", completed: true },
      { title: "Frontend Development", completed: false },
      { title: "Backend Integration", completed: false },
      { title: "Final Testing", completed: false },
    ]
  };

  return (
    <div className="project-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back to Projects
      </button>

      <div className="details-header">
        <div className="header-info">
          <h1>{project.title}</h1>
          <span className="details-id">{project.id}</span>
        </div>
        <div className={`details-status ${project.status.toLowerCase().replace(" ", "-")}`}>
          {project.status}
        </div>
      </div>

      <div className="details-grid">
        {/* Left: Info */}
        <div className="details-main">
          <div className="details-section">
            <h3>Description</h3>
            <p>{project.description}</p>
          </div>
          
          <div className="details-section">
            <h3>Project Milestones</h3>
            <div className="milestone-list">
              {project.milestones.map((ms, index) => (
                <div key={index} className={`milestone-item ${ms.completed ? "done" : "pending"}`}>
                  {ms.completed ? <FaCheckCircle className="ms-icon" /> : <FaClock className="ms-icon" />}
                  <span>{ms.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Meta & Files */}
        <div className="details-sidebar">
          <div className="sidebar-box">
            <h4>Deadline</h4>
            <p className="deadline-date">{project.deadline}</p>
          </div>
          
          <div className="sidebar-box">
            <h4>Documents</h4>
            <div className="file-link">
              <FaFileAlt /> <span>Project_Scope.pdf</span>
            </div>
            <div className="file-link">
              <FaFileAlt /> <span>Design_v2.fig</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;