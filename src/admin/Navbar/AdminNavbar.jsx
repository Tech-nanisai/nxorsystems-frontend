import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AdminNavbar.css";
import {
    FaHome,
    FaUsers,
    FaClock,
    FaUserGraduate,
    FaUserCircle
} from "react-icons/fa";
import { BiSearch } from "react-icons/bi";

const AdminNavbar = ({ setActiveSection }) => {
    const [activeTab, setActiveTab] = useState("Dashboard");

    const handleNavigation = (section) => {
        setActiveTab(section);
        setActiveSection(section); // Update the parent component state
    };

    return (
        <div className="admin_navbar-container">
            <div className="admin_navbar-top">
                <div className="admin_navbar-logo">Admin</div>

                <div className="admin_navbar-search">
                    <BiSearch className="admin_navbar-search-icon" />
                    <input type="text" placeholder="Search..." className="admin_navbar-search-input" />
                </div>

                <nav className="admin_navbar-menu">
                    <a 
                        className={`admin_navbar-item ${activeTab === "Dashboard" ? "active" : ""}`}
                        onClick={() => handleNavigation("Dashboard")}
                    >
                        <FaHome /> Dashboard
                    </a>

                    <a 
                        className={`admin_navbar-item ${activeTab === "ClientManagement" ? "active" : ""}`}
                        onClick={() => handleNavigation("ClientManagement")}
                    >
                        <FaUsers /> Client Management
                    </a>

                    <a 
                        className={`admin_navbar-item ${activeTab === "StudentManagement" ? "active" : ""}`}
                        onClick={() => handleNavigation("StudentManagement")}
                    >
                        <FaUserGraduate /> Student Management
                    </a>
                    <a 
                        className={`admin_navbar-item ${activeTab === "IDGeneration" ? "active" : ""}`}
                        onClick={() => handleNavigation("IDGeneration")}
                    >
                        <FaClock /> ID Generation
                    </a>
                    <a 
                        className={`admin_navbar-item ${activeTab === "LastUpdates" ? "active" : ""}`}
                        onClick={() => handleNavigation("LastUpdates")}
                    >
                        <FaClock /> Last Updates
                    </a>
                </nav>
            </div>

            <div className="admin_navbar-profile">
                <FaUserCircle className="admin_navbar-profile-pic" />
                <span className="admin_navbar-username">SAILU AETTARI</span>
            </div>
        </div>
    );
};

export default AdminNavbar;
