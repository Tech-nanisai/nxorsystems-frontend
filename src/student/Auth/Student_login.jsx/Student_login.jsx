import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import "./Student_login.css";

const StudentLogin = () => {
    const navigate = useNavigate();

    const [studentId, setStudentId] = useState("");
    const [password, setPassword] = useState("");
    const [isValidId, setIsValidId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // 👉 AUTO-REDIRECT IF JWT ALREADY EXISTS
    useEffect(() => {
        const token = Cookies.get("student_auth_token");
        if (token) {
            navigate("/student/dashboard");
        }
    }, []);

    // Validate Student ID exists
    const validateStudentId = async (id) => {
        try {
            const response = await axios.get(
                `http://localhost:1981/api/id-generation/verify-id/${id}`
            );
            setIsValidId(response.data.isValid);
        } catch {
            setIsValidId(false);
        }
    };

    // Handle Login
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!studentId || !password) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.post(
                "http://localhost:1981/api/student/login",
                { studentId: studentId.trim().toUpperCase(), password }
            );

            if (res.data?.token) {
                // Store JWT
                Cookies.set("student_auth_token", res.data.token, {
                    expires: 7,
                    secure: false,
                    sameSite: "Lax",
                });

                navigate("/student/dashboard");
            } else {
                setErrorMessage("Invalid Student ID or Password.");
            }
        } catch (error) {
            const msg =
                error.response?.data?.error ||
                "Something went wrong. Please try again.";
            setErrorMessage(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="StudentLogin-main-container">
            <form className="StudentLogin-form-container" onSubmit={handleLogin}>
                <h3 className="StudentLogin-heading">Student Login</h3>

                <label className="StudentLogin-label">Student ID</label>
                <input
                    type="text"
                    placeholder="Enter your Student ID"
                    className={`StudentLogin-inputBox ${
                        isValidId === null
                            ? ""
                            : isValidId
                            ? "StudentLogin-valid-id"
                            : "StudentLogin-invalid-id"
                    }`}
                    value={studentId}
                    onChange={async (e) => {
                        const id = e.target.value.trim().toUpperCase();
                        setStudentId(id);
                        setErrorMessage("");
                        await validateStudentId(id);
                    }}
                />

                {isValidId && (
                    <p className="StudentLogin-success-message">Verified</p>
                )}
                {!isValidId && isValidId !== null && (
                    <p className="StudentLogin-error-message">
                        Invalid Student ID
                    </p>
                )}

                <label className="StudentLogin-label">Password</label>
                <div className="StudentLogin-password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="StudentLogin-inputBox"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                        className="StudentLogin-eye-icon"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                {errorMessage && (
                    <p className="StudentLogin-error-message">{errorMessage}</p>
                )}

                <button className="StudentLogin-button" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </button>

                <Link to="/student-register" className="Createstudenaccount">
                    Create Student Account
                </Link>
            </form>
        </div>
    );
};

export default StudentLogin;
