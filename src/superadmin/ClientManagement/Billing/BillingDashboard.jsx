import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFileInvoiceDollar, FaHistory, FaPlusCircle, FaTimes } from "react-icons/fa";
import "../ClientManagementDashboard.css"; // Reusing the main dashboard styles for consistency
import "./BillingModal.css";
import GenerateInvoice from "../GenerateInvoice";

const BillingDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const openModal = () => {
        setShowSuccess(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setShowSuccess(false), 300); // Reset success after close transition
    };

    const handleSuccess = () => {
        setShowSuccess(true);
        // Auto close after showing success animation
        setTimeout(() => {
            closeModal();
        }, 2200);
    };

    const cards = [
        {
            title: "Generate Invoice",
            description: "Create and assign new bills to clients.",
            icon: <FaPlusCircle />,
            link: "#", // Changed to hash as we are using onClick
            actionText: "Create Now →",
            onClick: openModal
        },
        {
            title: "Invoice History",
            description: "View past invoices and payment status.",
            icon: <FaHistory />,
            link: "/superadmin/client-management/billing/history",
            actionText: "View History →",
        },
        // Future cards can be added here
    ];

    return (
        <div className="ClientManagementDashboard-container">
            <div className="ClientManagementDashboard-header">
                {/* <h2 className="ClientManagementDashboard-title">Billing Management</h2> */}
                <p className="ClientManagementDashboard-breadcrumb">Client Management {'/'} Billing</p>
                <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                    <Link to="/superadmin/client-management" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', background: 'white' }}>
                        ← Back to Management
                    </Link>
                </div>
            </div>

            <div className="ClientManagementDashboard-grid">
                {cards.map((card, index) => (
                    card.onClick ? (
                        <div key={index} className="ClientManagementDashboard-card card-green" onClick={card.onClick}>
                            <div className="ClientManagementDashboard-icon-wrapper">
                                {card.icon}
                            </div>
                            <h3 className="ClientManagementDashboard-card-title">{card.title}</h3>
                            <p className="ClientManagementDashboard-card-desc">{card.description}</p>
                            <span className="ClientManagementDashboard-view-more">{card.actionText}</span>
                        </div>
                    ) : (
                        <Link to={card.link} key={index} className="ClientManagementDashboard-card card-green">
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
                        <button className="billing-modal-close" onClick={closeModal}>
                            <FaTimes />
                        </button>

                        {showSuccess ? (
                            <div className="billing-success-container">
                                <div className="success-jagged-circle">
                                    <div className="success-check-mark-white"></div>
                                </div>
                                <h3 className="success-text">Invoice Generated Successfully!</h3>
                            </div>
                        ) : (
                            <GenerateInvoice isModal={true} onSuccess={handleSuccess} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingDashboard;
