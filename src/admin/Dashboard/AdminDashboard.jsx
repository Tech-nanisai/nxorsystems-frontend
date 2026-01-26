import React, { useState } from "react";
import "./AdminDashboard.css";
import AdminNavbar from "../Navbar/AdminNavbar";
// import Adminreportsclient from "../ReportsClient/AdminReportsClient";
import IDGeneration from "../idGeneration/IDGeneration";
const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState("Dashboard");

    return (
        <div className="admin-dashboard-container">
            <AdminNavbar setActiveSection={setActiveSection} />            
            <div className="admin-dashboard-content">
                {activeSection === "LastUpdates" && <Adminreportsclient />}
                {/* {activeSection === "ClientManagement" && <Adminreportsclient />} */}
                {activeSection === "IDGeneration" && <IDGeneration />}
                {/* Add other components as needed */}
            </div>
        </div>
    );
};

export default AdminDashboard;
