import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaProjectDiagram, FaTasks, FaChartLine, FaTimes } from "react-icons/fa";
import "../ClientManagementDashboard.css";
import "../Billing/BillingModal.css"; // Reusing modal styles including the loader
import AssignProject from "../AssignProject";

const ProjectDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const openModal = () => {
        setShowSuccess(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setShowSuccess(false), 300);
    };

    const handleSuccess = () => {
        setShowSuccess(true);
        // Auto close after showing success animation
        setTimeout(() => {
            closeModal();
        }, 2500);
    };

    const cards = [
        {
            title: "Generate Project",
            description: "Assign new projects to clients.",
            icon: <FaProjectDiagram />,
            link: "#",
            actionText: "Create Now →",
            onClick: openModal
        },
        {
            title: "All Projects",
            description: "Search by Project ID or Client ID.",
            icon: <FaChartLine />, // Using ChartLine or similar as distinct icon
            link: "/superadmin/client-management/projects/all",
            actionText: "View List →",
        },
        {
            title: "Project Status",
            description: "Track the progress of ongoing projects.",
            icon: <FaTasks />,
            link: "/superadmin/client-management/projects/status", // Placeholder
            actionText: "View Status →",
        },
    ];

    return (
        <div className="ClientManagementDashboard-container">
            <div className="ClientManagementDashboard-header">
                {/* <h2 className="ClientManagementDashboard-title">Project Management</h2> */}
                <p className="ClientManagementDashboard-breadcrumb">Client Management {'/'} Projects</p>
                <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                    <Link to="/superadmin/client-management" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', background: 'white' }}>
                        ← Back to Management
                    </Link>
                </div>
            </div>

            <div className="ClientManagementDashboard-grid">
                {cards.map((card, index) => (
                    card.onClick ? (
                        <div key={index} className="ClientManagementDashboard-card" onClick={card.onClick}>
                            <div className="ClientManagementDashboard-icon-wrapper">
                                {card.icon}
                            </div>
                            <h3 className="ClientManagementDashboard-card-title">{card.title}</h3>
                            <p className="ClientManagementDashboard-card-desc">{card.description}</p>
                            <span className="ClientManagementDashboard-view-more">{card.actionText}</span>
                        </div>
                    ) : (
                        <Link to={card.link} key={index} className="ClientManagementDashboard-card">
                            <div className="ClientManagementDashboard-icon-wrapper">
                                {card.icon}
                            </div>
                            <h3 className="ClientManagementDashboard-card-title">{card.title}</h3>
                            <p className="ClientManagementDashboard-card-desc">{card.description}</p>
                            <span className="ClientManagementDashboard-view-more">{card.actionText}</span>
                        </Link>
                    )
                ))}
            </div>

            {/* MODAL OVERLAY */}
            {isModalOpen && (
                <div className="billing-modal-overlay">
                    <div className="billing-modal-content">
                        {!showSuccess && ( /* Hide close button if success animation is playing for cleaner look? Or keep it. Keeping it is safer. */
                            <button className="billing-modal-close" onClick={closeModal}>
                                <FaTimes />
                            </button>
                        )}

                        {showSuccess ? (
                            <div className="billing-success-container">
                                <div className="success-jagged-circle">
                                    <div className="success-check-mark-white"></div>
                                </div>
                                <h3 className="success-text">Project Assigned Successfully!</h3>
                            </div>
                        ) : (
                            <AssignProject isModal={true} onSuccess={handleSuccess} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDashboard;
