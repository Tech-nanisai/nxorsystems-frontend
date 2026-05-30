const getBaseUrl = () => {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return "http://localhost:1981";
    } else {
        return "https://nxorsystems-backend-xglw.onrender.com";
    }
};

export const API_BASE_URL = getBaseUrl();

