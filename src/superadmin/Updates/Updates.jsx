import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaClipboardList, FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaBolt, FaInbox } from "react-icons/fa";
import { motion } from "framer-motion";
import "./Updates.css";

const Updates = () => {
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUpdates();
    }, []);

    const fetchUpdates = async () => {
        try {
            const res = await axios.get("https://nxorsystems-backend-xglw.onrender.com/api/superadmin/updates/recent");
            if (res.data.success) {
                setUpdates(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching updates:", error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "success": return <FaCheckCircle className="update-icon success" />;
            case "warning": return <FaExclamationCircle className="update-icon warning" />;
            case "error": return <FaBolt className="update-icon error" />;
            default: return <FaInfoCircle className="update-icon info" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-IN", {
            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
        });
    };

    return (
        <div className="updates-container">
            <div className="updates-header">
                <h2 className="updates-title"><FaClipboardList /> Recent System Updates</h2>
                <p className="updates-subtitle">Track the last 15 system activities across all modules.</p>
            </div>

            <div className="updates-content">
                {loading ? (
                    <div className="updates-loader">Loading updates...</div>
                ) : updates.length === 0 ? (
                    <div className="no-updates">
                        <div className="no-updates-icon"><FaInbox /></div>
                        <h3>No Recent Updates</h3>
                        <p>System activities like invoices, ID generation, or client changes will appear here.</p>
                    </div>
                ) : (
                    <div className="timeline">
                        {updates.map((update, index) => (
                            <motion.div
                                className="timeline-item"
                                key={update._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="timeline-marker"></div>
                                <div className={`timeline-card type-${update.type}`}>
                                    <div className="timeline-header">
                                        <span className={`module-badge module-${update.module.replace(/\s+/g, '-').toLowerCase()}`}>
                                            {update.module}
                                        </span>
                                        <span className="update-time">{formatDate(update.createdAt)}</span>
                                    </div>
                                    <div className="timeline-body">
                                        <div className="timeline-icon-wrapper">
                                            {getIcon(update.type)}
                                        </div>
                                        <div className="timeline-details">
                                            <h4>{update.action}</h4>
                                            <p>{update.description}</p>
                                            <small className="performed-by">By: {update.performedBy}</small>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Updates;

