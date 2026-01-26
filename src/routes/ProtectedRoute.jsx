// frontend/src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("CLIENT_TOKEN");

  if (!token) {
    return <Navigate to="/client/signIn" replace />;
  }

  return children;
};

export default ProtectedRoute;
