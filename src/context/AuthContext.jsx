//frontend/src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";




const AuthContext = createContext(null);



export const AuthProvider = ({ children }) => {

  const navigate = useNavigate();



  const [userRole, setUserRole] = useState(null);

  const [token, setToken] = useState(null);



  const [superAdmin, setSuperAdmin] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [client, setClient] = useState(null);
  const [generalUser, setGeneralUser] = useState(null);




  // Prevent redirects while restoring session

  const [loading, setLoading] = useState(true);



  // --------------------------------------------------

  // FORMAT USER (adds cache-buster for profile picture)

  // --------------------------------------------------

  const formatUser = (user) => {

    if (!user) return null;



    const pic = user.profilePicture || "";



    // Check if Base64 instead of URL

    const isBase64 =

      pic.startsWith("data:image/") || pic.startsWith("data:application/");



    return {

      ...user,

      profilePicture: isBase64

        ? pic // DO NOT apply cache-buster

        : pic

          ? `${pic}?t=${Date.now()}`

          : "",

    };

  };





  // --------------------------------------------------

  // FETCH USER FROM BACKEND USING TOKEN

  // --------------------------------------------------

  const fetchUserFromServer = async (role, jwt) => {

    try {

      if (!role || !jwt) return;



      if (role === "superadmin") {

        const res = await fetch(

          "https://nxorsystems-backend-xglw.onrender.com/api/superadmin/auth/me",

          {

            method: "GET",

            headers: { Authorization: `Bearer ${jwt}` },

          }

        );



        if (!res.ok) return;



        const data = await res.json();

        if (data.success && data.superAdmin) {

          setSuperAdmin(formatUser(data.superAdmin));

        }

      } else if (role === "client") {
        const res = await fetch(
          "https://nxorsystems-backend-xglw.onrender.com/api/client/auth/me",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );

        if (!res.ok) return;

        const data = await res.json();
        if (data.success && data.client) {
          setClient(formatUser(data.client));
        }
      }

    } catch (err) {

      console.error("âŒ Error loading user:", err);

    }

  };



  // --------------------------------------------------

  // RESTORE SESSION ON REFRESH

  // --------------------------------------------------

  useEffect(() => {
    const restore = async () => {
      const savedRole = sessionStorage.getItem("USER_ROLE");

      if (savedRole === "user") {
        const savedUser = sessionStorage.getItem("active_user");
        const userToken = Cookies.get("user_auth_token");
        if (savedUser && userToken) {
          try {
            const parsed = JSON.parse(savedUser);
            setGeneralUser(formatUser(parsed));
            setUserRole("user");
            setToken(userToken);
          } catch (e) {
            console.error("Error restoring general user session:", e);
          }
        }
      } else {
        const savedToken = sessionStorage.getItem("TOKEN");
        if (savedRole && savedToken) {
          setUserRole(savedRole);
          setToken(savedToken);
          await fetchUserFromServer(savedRole, savedToken);
        }
      }

      setLoading(false);
    };

    restore();
  }, []);




  // --------------------------------------------------

  // LOGIN SUPER ADMIN

  // --------------------------------------------------

  const loginSuperAdmin = async (userData, jwtToken) => {

    // Save in session storage

    sessionStorage.setItem("USER_ROLE", "superadmin");

    sessionStorage.setItem("TOKEN", jwtToken);



    setUserRole("superadmin");

    setToken(jwtToken);



    // Immediately show login user (quick UI update)

    setSuperAdmin(formatUser(userData));



    // Then fetch the freshest data from MongoDB

    await fetchUserFromServer("superadmin", jwtToken);



    navigate("/superadmin/dashboard");

  };


  // --------------------------------------------------

  // LOGIN CLIENT

  // --------------------------------------------------

  const loginClient = async (userData, jwtToken) => {
    sessionStorage.setItem("USER_ROLE", "client");
    sessionStorage.setItem("TOKEN", jwtToken);

    setUserRole("client");
    setToken(jwtToken);
    setClient(formatUser(userData));

    // Then fetch
    await fetchUserFromServer("client", jwtToken);
    navigate("/client/dashboard");
  };

  // --------------------------------------------------
  // LOGIN GENERAL USER
  // --------------------------------------------------
  const loginGeneralUser = (userData, jwtToken) => {
    Cookies.set("user_auth_token", jwtToken, {
      expires: 7,
      secure: false,
      sameSite: "Lax",
    });
    sessionStorage.setItem("active_user", JSON.stringify(userData));
    sessionStorage.setItem("USER_ROLE", "user");

    setUserRole("user");
    setToken(jwtToken);
    setGeneralUser(formatUser(userData));

    navigate("/user");
  };




  // --------------------------------------------------

  // UPDATE SUPER ADMIN LOCALLY (edit profile, change avatar)

  // --------------------------------------------------

  const updateSuperAdminProfile = (partialUpdate) => {

    setSuperAdmin((prev) =>

      formatUser({

        ...(prev || {}),

        ...partialUpdate,

      })

    );

  };



  // --------------------------------------------------

  // UPDATE GENERAL USER LOCALLY

  // --------------------------------------------------

  const updateGeneralUserProfile = (partialUpdate) => {
    setGeneralUser((prev) => {
      const updated = formatUser({
        ...(prev || {}),
        ...partialUpdate,
      });
      sessionStorage.setItem("active_user", JSON.stringify(updated));
      return updated;
    });
  };




  // --------------------------------------------------

  // GET ACTIVE USER (topbar, sidebar, profile, etc.)

  // --------------------------------------------------

  const getActiveUser = () => {
    return {
      superadmin: superAdmin,
      admin,
      client,
      user: generalUser,
    }[userRole];
  };




  // --------------------------------------------------

  // LOGOUT

  // --------------------------------------------------

  const logout = () => {
    Cookies.remove("user_auth_token");
    sessionStorage.clear();

    setUserRole(null);
    setToken(null);
    setSuperAdmin(null);
    setAdmin(null);
    setClient(null);
    setGeneralUser(null);

    navigate("/");
  };




  return (

    <AuthContext.Provider

      value={{

        userRole,
        token,
        superAdmin,
        admin,
        client,
        generalUser,
        loading,

        loginSuperAdmin,
        loginClient,
        loginGeneralUser,
        updateSuperAdminProfile,
        updateGeneralUserProfile,
        fetchUserFromServer,
        getActiveUser,
        logout,


      }}

    >

      {children}

    </AuthContext.Provider>

  );

};



export const useAuth = () => useContext(AuthContext);
