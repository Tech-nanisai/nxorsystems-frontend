// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";        // SuperAdmin Context
// import { useClientAuth } from "../context/ClientAuthContext"; // Client Context (NEW)

// const RoleBasedRoute = ({ allowed, allowedRoles, children }) => {
//   // 1. Get Data from BOTH Contexts
//   const saContext = useAuth();        // SuperAdmin Data
//   const clientContext = useClientAuth(); // Client Data

//   const rolesAllowed = allowed || allowedRoles || [];

//   // --- LOGIC FOR CLIENT ROUTES ---
//   if (rolesAllowed.includes("client")) {
//     if (clientContext.loading) {
//       return <div className="rb-route-loading">Loading Client...</div>;
//     }
//     // Check if Client is logged in
//     if (!clientContext.clientToken || !clientContext.client) {
//       return <Navigate to="/client/signIn" replace />;
//     }
//     // If valid, render content
//     return children ? <>{children}</> : <Outlet />;
//   }

//   // --- LOGIC FOR SUPER ADMIN ROUTES ---
//   if (rolesAllowed.includes("superadmin")) {
//     if (saContext.loading) {
//       return <div className="rb-route-loading">Loading Admin...</div>;
//     }
//     // Check if SuperAdmin is logged in
//     if (!saContext.token || saContext.userRole !== "superadmin") {
//       return <Navigate to="/" replace />; // Or /superadmin/login
//     }
//     // If valid, render content
//     return children ? <>{children}</> : <Outlet />;
//   }

//   // Fallback for other roles (e.g. Student)
//   // Expand logic here if needed for students
  
//   return <Navigate to="/" replace />;
// };

// export default RoleBasedRoute;

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";        // SuperAdmin Context
import { useClientAuth } from "../context/ClientAuthContext"; // Client Context

const RoleBasedRoute = ({ allowed, allowedRoles, children }) => {
  // 1. Get Data from BOTH Contexts
  const saContext = useAuth();        // SuperAdmin Data
  const clientContext = useClientAuth(); // Client Data

  // Normalize allowed roles
  const rolesAllowed = allowed || allowedRoles || [];

  // --- LOGIC FOR CLIENT ROUTES ---
  if (rolesAllowed.includes("client")) {
    // If loading, show spinner
    if (clientContext.loading) {
      return (
        <div className="rb-route-loading-wrapper">
          <div className="rb-route-spinner" />
        </div>
      );
    }
    // Check if Client is logged in (token + user object)
    if (!clientContext.clientToken || !clientContext.client) {
      return <Navigate to="/client/signIn" replace />;
    }
    // If valid, render content
    return children ? <>{children}</> : <Outlet />;
  }

  // --- LOGIC FOR SUPER ADMIN / ADMIN / STUDENT ROUTES ---
  // (Uses original AuthContext)
  if (rolesAllowed.some(r => ["superadmin", "admin", "student"].includes(r))) {
    if (saContext.loading) {
      return (
        <div className="rb-route-loading-wrapper">
          <div className="rb-route-spinner" />
        </div>
      );
    }
    // Check if user matches role in AuthContext
    if (!saContext.token || !rolesAllowed.includes(saContext.userRole)) {
      return <Navigate to="/" replace />; 
    }
    return children ? <>{children}</> : <Outlet />;
  }

  // Fallback
  return <Navigate to="/" replace />;
};

export default RoleBasedRoute;