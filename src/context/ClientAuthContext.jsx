import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ClientAuthContext = createContext(null);

export const ClientAuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [client, setClient] = useState(null);
  const [clientToken, setClientToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Direct URL to Backend
  const API_URL = "https://nxorsystems-backend-xglw.onrender.com/api/client/auth";

  // --- HELPER: Format User ---
  const formatUser = (user) => {
    if (!user) return null;
    const pic = user.profilePicture || "";
    const isBase64 = pic.startsWith("data:image/") || pic.startsWith("data:application/");
    return {
      ...user,
      profilePicture: isBase64 ? pic : pic ? `${pic}?t=${Date.now()}` : "",
    };
  };

  // --- FETCH PROFILE ---
  const fetchClientProfile = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && res.data.client) {
        setClient(formatUser(res.data.client));
      }
    } catch (err) {
      console.error("âŒ Error loading client profile:", err);
      // If token is invalid, clear session
      if (err.response?.status === 401) {
        logoutClient();
      }
    }
  };

  // --- RESTORE SESSION ---
  useEffect(() => {
    const restoreSession = async () => {
      const savedRole = sessionStorage.getItem("USER_ROLE");
      const savedToken = sessionStorage.getItem("TOKEN");

      if (savedRole === "client" && savedToken) {
        setClientToken(savedToken);
        await fetchClientProfile(savedToken);
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  // --- LOGIN ---
  const loginClient = (userData, token) => {
    // 1. Set Storage
    sessionStorage.setItem("USER_ROLE", "client");
    sessionStorage.setItem("TOKEN", token);

    // 2. Update State
    setClientToken(token);
    setClient(formatUser(userData));

    // 3. Fetch Full Profile (Double Check)
    fetchClientProfile(token);

    // 4. Navigate
    // Check if we were redirected here, otherwise go to dashboard
    const origin = location.state?.from?.pathname || "/client/dashboard";
    navigate(origin);
  };

  // --- LOGOUT ---
  const logoutClient = () => {
    sessionStorage.removeItem("USER_ROLE");
    sessionStorage.removeItem("TOKEN");
    setClient(null);
    setClientToken(null);
    navigate("/client/signIn");
  };

  // --- UPDATE PROFILE ---
  const updateClientProfile = (partialUpdate) => {
    setClient((prev) => formatUser({ ...(prev || {}), ...partialUpdate }));
  };

  return (
    <ClientAuthContext.Provider
      value={{
        client,
        clientToken,
        loading,
        loginClient,
        logoutClient,
        fetchClientProfile,
        updateClientProfile,
        isAuthenticated: !!client && !!clientToken, // Boolean check
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
};

export const useClientAuth = () => useContext(ClientAuthContext);
