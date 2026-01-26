//frontend/src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";



const AuthContext = createContext(null);



export const AuthProvider = ({ children }) => {

  const navigate = useNavigate();



  const [userRole, setUserRole] = useState(null);

  const [token, setToken] = useState(null);



  const [superAdmin, setSuperAdmin] = useState(null);

  const [admin, setAdmin] = useState(null);

  const [client, setClient] = useState(null);

  const [student, setStudent] = useState(null);



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

          "http://localhost:1981/api/superadmin/auth/me",

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

      }

    } catch (err) {

      console.error("❌ Error loading user:", err);

    }

  };



  // --------------------------------------------------

  // RESTORE SESSION ON REFRESH

  // --------------------------------------------------

  useEffect(() => {

    const restore = async () => {

      const savedRole = sessionStorage.getItem("USER_ROLE");

      const savedToken = sessionStorage.getItem("TOKEN");



      if (savedRole && savedToken) {

        setUserRole(savedRole);

        setToken(savedToken);

        await fetchUserFromServer(savedRole, savedToken);

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

  // GET ACTIVE USER (topbar, sidebar, profile, etc.)

  // --------------------------------------------------

  const getActiveUser = () => {

    return {

      superadmin: superAdmin,

      admin,

      client,

      student,

    }[userRole];

  };



  // --------------------------------------------------

  // LOGOUT

  // --------------------------------------------------

  const logout = () => {

    sessionStorage.clear();



    setUserRole(null);

    setToken(null);

    setSuperAdmin(null);

    setAdmin(null);

    setClient(null);

    setStudent(null);



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

        student,

        loading,



        loginSuperAdmin,
        updateSuperAdminProfile,
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