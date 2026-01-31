import React from "react";
import { Link } from "react-router-dom";
import { FaFileInvoiceDollar, FaProjectDiagram, FaShieldAlt, FaFolderOpen, FaBullhorn } from "react-icons/fa";
import "./ClientManagementDashboard.css";
import Loader from "../../components/Loader/Loader";
import { useState, useEffect } from "react";

const ClientManagementDashboard = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading for premium feel
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loader />
            </div>
        );
    }
    const cards = [
        {
            title: "Billing",
            description: "Generate Invoice, manage payments & history.",
            icon: <FaFileInvoiceDollar />,
            link: "/superadmin/client-management/billing",
            actionText: "View More →",
            colorClass: "card-green"
        },
        {
            title: "Projects",
            description: "Generate Project, assign tasks & track progress.",
            icon: <FaProjectDiagram />,
            link: "/superadmin/client-management/projects",
            actionText: "View More →",
            colorClass: "" // Default blue
        },
        {
            title: "Documents",
            description: "Send agreements, policies & promotional materials.",
            icon: <FaFolderOpen />,
            link: "/superadmin/client-management/documents",
            actionText: "View More →",
            colorClass: "card-orange"
        },
        {
            title: "Security",
            description: "Manage security protocols and access control.",
            icon: <FaShieldAlt />,
            link: "/superadmin/client-management/security",
            actionText: "View More →",
            colorClass: "card-red"
        },
        {
            title: "Updates",
            description: "Broadcast new features, offers & announcements.",
            icon: <FaBullhorn />,
            link: "/superadmin/client-management/updates",
            actionText: "Manage Updates →",
            colorClass: "card-purple"
        },
    ];

    return (
        <div className="ClientManagementDashboard-container">
            <div className="ClientManagementDashboard-header">
                {/* <h2 className="ClientManagementDashboard-title">Client Management</h2> */}
                <p className="ClientManagementDashboard-breadcrumb">Client Management {'/'} Dashboard</p>
            </div>

            <div className="ClientManagementDashboard-grid">
                {cards.map((card, index) => (
                    <Link to={card.link} key={index} className={`ClientManagementDashboard-card ${card.colorClass || ''}`}>
                        <div className="ClientManagementDashboard-icon-wrapper">
                            {card.icon}
                        </div>
                        <h3 className="ClientManagementDashboard-card-title">{card.title}</h3>
                        <p className="ClientManagementDashboard-card-desc">{card.description}</p>
                        <span className="ClientManagementDashboard-view-more">{card.actionText}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ClientManagementDashboard;
