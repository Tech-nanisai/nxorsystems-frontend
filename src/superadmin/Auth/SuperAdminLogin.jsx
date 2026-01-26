// import React, { useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../context/AuthContext";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import "./SuperAdminLogin.css";

// const API = "http://localhost:1981";

// const SuperAdminLogin = () => {
//   const { loginSuperAdmin } = useAuth();
  
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPwd, setShowPwd] = useState(false);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       setLoading(true);

//       const res = await axios.post(`${API}/api/superadmin/auth/login`, {
//         email,
//         password,
//       });

//       if (!res.data.token || !res.data.superAdmin) {
//         setMessage("Invalid server response.");
//         return;
//       }

//       sessionStorage.setItem("SUPERADMIN_DATA", JSON.stringify(res.data.superAdmin));
//       sessionStorage.setItem("TOKEN", res.data.token);
//       sessionStorage.setItem("USER_ROLE", "superadmin");

//       loginSuperAdmin(res.data.superadmin, res.data.token);

//     } catch (err) {
//       setMessage("Login failed. Check your credentials.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="superadminLogin-container">
//       <form className="superadminLogin-box" onSubmit={handleLogin}>
//         <h2 className="superadminLogin-heading">Super Admin Login</h2>

//         <label className="superadminLogin-label">Email</label>
//         <input
//           className="superadminLogin-input"
//           type="email"
//           value={email}
//           placeholder="superadmin@example.com"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <label className="superadminLogin-label">Password</label>
//         <div className="superadminLogin-passwordWrapper">
//           <input
//             className="superadminLogin-input"
//             type={showPwd ? "text" : "password"}
//             value={password}
//             placeholder="Enter password"
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <span className="superadminLogin-toggleIcon" onClick={() => setShowPwd(!showPwd)}>
//             {showPwd ? <FaEyeSlash /> : <FaEye />}
//           </span>
//         </div>

//         {message && <p className="superadminLogin-message">{message}</p>}

//         <button className="superadminLogin-button" disabled={loading}>
//           {loading ? "Please wait..." : "Login"}
//         </button>

//         <p className="superadminLogin-switchText">
//           Don’t have an account?{" "}
//           <a href="/superadmin/register" className="superadminLogin-link">
//             Create Super Admin
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default SuperAdminLogin;

// frontend/src/superadmin/Auth/SuperAdminLogin.jsx
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./SuperAdminLogin.css";

const API = "http://localhost:1981";

const SuperAdminLogin = () => {
  const { loginSuperAdmin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const res = await axios.post(`${API}/api/superadmin/auth/login`, {
        email,
        password,
      });

      // API returns: { message, token, superAdmin: { ... } }
      if (!res.data?.token || !res.data?.superAdmin) {
        setMessage("Invalid server response.");
        return;
      }

      // Persist to sessionStorage (AuthContext also persists on login)
      sessionStorage.setItem("SUPERADMIN_DATA", JSON.stringify(res.data.superAdmin));
      sessionStorage.setItem("TOKEN", res.data.token);
      sessionStorage.setItem("USER_ROLE", "superadmin");

      // Call context helper to finalize login and fetch fresh data
      await loginSuperAdmin(res.data.superAdmin, res.data.token);
      // loginSuperAdmin will navigate to dashboard
    } catch (err) {
      console.error("Login error:", err?.response?.data || err.message);
      setMessage(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="superadminLogin-container">
      <form className="superadminLogin-box" onSubmit={handleLogin}>
        <h2 className="superadminLogin-heading">Super Admin Login</h2>

        <label className="superadminLogin-label">Email</label>
        <input
          className="superadminLogin-input"
          type="email"
          value={email}
          placeholder="superadmin@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="superadminLogin-label">Password</label>
        <div className="superadminLogin-passwordWrapper">
          <input
            className="superadminLogin-input"
            type={showPwd ? "text" : "password"}
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="superadminLogin-toggleIcon" onClick={() => setShowPwd(!showPwd)}>
            {showPwd ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {message && <p className="superadminLogin-message">{message}</p>}

        <button className="superadminLogin-button" disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </button>

        <p className="superadminLogin-switchText">
          Don’t have an account?{" "}
          <a href="/superadmin/register" className="superadminLogin-link">
            Create Super Admin
          </a>
        </p>
      </form>
    </div>
  );
};

export default SuperAdminLogin;
