// frontend/src/client/Layout/ClientLayout.jsx
import React from "react";
import ClientNavbar from "../Navbar/ClientNavbar";
import "./ClientLayout.css";

export default function ClientLayout({ children }) {
    return (
        <div className="client-layout">
            <ClientNavbar />
            <div className="client-layout-content">
                {children}
            </div>
        </div>
    );
}
