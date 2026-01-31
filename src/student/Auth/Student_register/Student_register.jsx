import React, { useState } from "react";
import axios from "axios";
import "./Student_register.css";
import { Link, useNavigate } from "react-router-dom";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import bcrypt from "bcryptjs";

const Studentregister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        studentId: "",
    });
    const [isValidId, setIsValidId] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateStudentId = async (id) => {
        if (!id) return;
        try {
            const [idResponse, registerResponse] = await Promise.all([
                axios.get(`https://nxorsystems-backend-xglw.onrender.com/api/id-generation/verify-id/${id}`),
                axios.get(`https://nxorsystems-backend-xglw.onrender.com/api/student/check-registered/${id}`)
            ]);
            setIsValidId(idResponse.data.isValid);
            setIsRegistered(registerResponse.data.isRegistered);
        } catch (error) {
            console.error("Error validating student ID:", error);
            setIsValidId(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "studentId") validateStudentId(value.trim().toUpperCase());
    };

    const validateForm = () => {
        const nameRegex = /^[A-Za-z ]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        return (
            nameRegex.test(formData.fullname) &&
            emailRegex.test(formData.email) &&
            phoneRegex.test(formData.phone) &&
            passwordRegex.test(formData.password) &&
            isValidId &&
            !isRegistered
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            alert("Please enter valid details before submitting.");
            return;
        }
        setLoading(true);
        try {
            // const hashedPassword = await bcrypt.hash(formData.password, 10);
            const response = await axios.post("https://nxorsystems-backend-xglw.onrender.com/api/student/register", {
                ...formData,
                
            });
            if (response.status === 201) {
                setSuccess(true);
                setTimeout(() => navigate("/student-login"), 1000);
            }
        } catch (error) {
            console.error("Error creating account:", error);
            alert("Error creating account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="Studentregister-main-container">
            <form className="Studentregister-form-container" onSubmit={handleSubmit}>
                <h3>Create an Account</h3>
                <label htmlFor="studentId" className="Studentregister-label">Student ID</label>
                <input 
                    type="text" 
                    name="studentId" 
                    placeholder="Enter your student ID" 
                    className={`Studentregister-inputBox ${isValidId === null ? "" : isValidId ? "valid-id verified-tick" : "invalid-id"}`} 
                    value={formData.studentId} 
                    onChange={handleInputChange} 
                    required 
                />
                {isValidId === false && <p className="error-message">Invalid Student ID. Please check and try again.</p>}
                
                <label htmlFor="fullname" className="Studentregister-label">Full Name</label>
                <input type="text" name="fullname" placeholder="Enter your full name" className="Studentregister-inputBox" value={formData.fullname} onChange={handleInputChange} required />
                
                <label htmlFor="email" className="Studentregister-label">Email</label>
                <input type="email" name="email" placeholder="Enter your email" className="Studentregister-inputBox" value={formData.email} onChange={handleInputChange} required />
                
                <label htmlFor="phone" className="Studentregister-label">Phone Number</label>
                <input type="tel" name="phone" placeholder="Enter your phone number" pattern="[0-9]{10}" className="Studentregister-inputBox" value={formData.phone} onChange={handleInputChange} required />
                
                <label htmlFor="password" className="Studentregister-label">Set Password</label>
                <div className="Studentregister-password-container">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        placeholder="Create password" 
                        className="Studentregister-inputBox" 
                        value={formData.password} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <span className="Studentregister-eye-icon" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                
                <button type="submit" className="Studentregister-button" disabled={!validateForm()}>
                    {loading ? <span className="spinner"></span> : success ? <FaCheck /> : "Register"}
                </button>
                <Link to="/student-login">Sign In</Link>
            </form>
        </div>
    );
};

export default Studentregister;

