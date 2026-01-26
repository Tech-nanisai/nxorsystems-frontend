// frontend/src/superadmin/Layout/SuperAdminLayout.jsx
import React, { useState } from "react";
import SuperAdminSidebar from "./SuperAdminSidebar";
import "./SuperAdminLayout.css";
// Optional: Import a hamburger icon for mobile if you want it explicitly here, 
// or assume valid header elsewhere. Given the sidebar needs a toggle, 
// usually a top bar or floating button is needed on mobile. W'll add a simple mobile toggle here.
import { FaBars } from "react-icons/fa";

const SuperAdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="superadminlayout-wrapper">

      {/* GLOBAL TOGGLE BUTTON (Visible when sidebar is closed) */}
      {!sidebarOpen && (
        <button
          className="superadminlayout-mobile-toggle"
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 900,
            background: '#fff',
            border: 'none',
            padding: '12px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setSidebarOpen(true)}
          title="Open Sidebar"
        >
          <FaBars size={20} color="#334155" />
        </button>
      )}

      {/* MOBILE TOGGLE (Keep visible on mobile if needed, or unify. 
         The above button covers both Desktop (closed) and Mobile (closed) scenarios effectively since !sidebarOpen is true on mobile load typically, 
         but we init state to true. On mobile CSS usually hides sidebar initially or overlays. 
         However, current logic uses state. Let's rely on the above button for RE-OPENING. 
       */}

      {/* SIDEBAR */}
      <SuperAdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN CONTENT AREA */}
      <main
        className={
          sidebarOpen
            ? "superadminlayout-main superadminlayout-main-shifted"
            : "superadminlayout-main"
        }
      >
        {children}
      </main>
    </div>
  );
};

export default SuperAdminLayout;
