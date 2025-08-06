import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerDashboard from './ManagerDashboard';
import AdminDashboard from './AdminDashboard';
import PatientDashboard from './PatientDashboard';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isManager, setIsManager] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPatient, setIsPatient] = useState(false);
    const [adminData, setAdminData] = useState(null);
    const [patientData, setPatientData] = useState(null);

    // Check for existing authentication on component mount
    useEffect(() => {
        const authData = localStorage.getItem('authData');
        if (authData) {
            const { userType, userData } = JSON.parse(authData);
            if (userType === 'manager') {
                setIsManager(true);
            } else if (userType === 'admin') {
                setIsAdmin(true);
                setAdminData(userData);
            } else if (userType === 'patient') {
                setIsPatient(true);
                setPatientData(userData);
            }
        }
    }, []);

    // Default manager credentials
    const MANAGER_CREDENTIALS = {
        email: 'manager@healthcare.com',
        password: 'manager123'
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if credentials match manager
        if (formData.email === MANAGER_CREDENTIALS.email &&
            formData.password === MANAGER_CREDENTIALS.password) {
            setIsManager(true);
            localStorage.setItem('authData', JSON.stringify({ userType: 'manager' }));
            return;
        }

        // Check admin credentials from database
        try {
            const adminResponse = await fetch('http://localhost:3001/api/auth/login-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const adminResult = await adminResponse.json();

            if (adminResponse.ok && adminResult.success) {
                setIsAdmin(true);
                setAdminData(adminResult.admin);
                localStorage.setItem('authData', JSON.stringify({ 
                    userType: 'admin', 
                    userData: adminResult.admin 
                }));
                return;
            }
        } catch (error) {
            console.error('Admin login error:', error);
        }

        // Check patient credentials from database
        try {
            const patientResponse = await fetch('http://localhost:3001/api/auth/login-patient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const patientResult = await patientResponse.json();

            if (patientResponse.ok && patientResult.success) {
                setIsPatient(true);
                setPatientData(patientResult.patient);
                localStorage.setItem('authData', JSON.stringify({ 
                    userType: 'patient', 
                    userData: patientResult.patient 
                }));
                return;
            }
        } catch (error) {
            console.error('Patient login error:', error);
        }

        alert('Invalid credentials');
    };

    const handleLogout = () => {
        setIsManager(false);
        setIsAdmin(false);
        setIsPatient(false);
        setAdminData(null);
        setPatientData(null);
        setFormData({ email: '', password: '' });
        localStorage.removeItem('authData');
    };

    const handleBackToHome = (e) => {
        e.preventDefault();
        navigate('/');
        setFormData({ email: '', password: '' });

    }
    const handleGoToSignup = () => navigate('/signup');

    // Show manager dashboard if authenticated
    if (isManager) {
        return <ManagerDashboard onLogout={handleLogout} />;
    }

    // Show admin dashboard if authenticated
    if (isAdmin) {
        return <AdminDashboard onLogout={handleLogout} adminData={adminData} />;
    }

    // Show patient dashboard if authenticated
    if (isPatient) {
        return <PatientDashboard onLogout={handleLogout} patientData={patientData} />;
    }

    return (
        <div className="login-container">
            <div className="container-fluid h-100">
                <div className="row h-100">
                    {/* Left Side - Form */}
                    <div className="col-lg-6 d-flex align-items-center justify-content-center">
                        <div className="login-card">
                            <div className="login-header">
                                <button
                                    type="button"
                                    className="back-btn"
                                    onClick={handleBackToHome}
                                >
                                    <i className="fas fa-arrow-left me-2"></i>
                                    Back to Home
                                </button>
                                <h2 className="login-title">Welcome Back</h2>
                                <p className="login-subtitle">Sign in to access your healthcare dashboard</p>
                            </div>

                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <div className="input-wrapper">
                                        <i className="fas fa-envelope input-icon"></i>
                                        <input
                                            type="email"
                                            className="form-input"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <div className="input-wrapper">
                                        <i className="fas fa-lock input-icon"></i>
                                        <input
                                            type="password"
                                            className="form-input"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-options">
                                    <div className="remember-me">
                                        <input type="checkbox" id="remember" />
                                        <label htmlFor="remember">Remember me</label>
                                    </div>
                                    <a href="#" className="forgot-password">
                                        Forgot Password?
                                    </a>
                                </div>

                                <button type="submit" className="login-btn">
                                    <i className="fas fa-sign-in-alt me-2"></i>
                                    Sign In
                                </button>

                                <div className="signup-link">
                                    <p>
                                        Don't have an account?{' '}
                                        <button
                                            type="button"
                                            className="signup-btn"
                                            onClick={handleGoToSignup}
                                        >
                                            Sign up here
                                        </button>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Side - Image/Info */}
                    <div className="col-lg-6 d-none d-lg-flex">
                        <div className="login-info-side">
                            <div className="info-icon">
                                <i className="fas fa-user-md"></i>
                            </div>
                            <h3 className="info-title">Access Your Health Dashboard</h3>
                            <p className="info-description">
                                Manage appointments, view medical records, and connect with healthcare professionals
                            </p>
                            {/* <div className="info-features"> */}
                            {/* <div className="feature-item">
                                <div className="feature-icon">
                                    <i className="fas fa-calendar-check"></i>
                                </div> */}
                            {/* <p className="feature-text">Book Appointments</p> */}
                            {/* </div>
                        <div className="feature-item">
                            <div className="feature-icon"> */}
                            {/* <i className="fas fa-file-medical"></i>
                        </div>
                        <p className="feature-text">Medical Records</p>
                    </div> */}
                            {/* <div className="feature-item">
                                <div className="feature-icon">
                                    <i className="fas fa-comments"></i>
                                </div> */}
                            {/* <p className="feature-text">Chat with Doctors</p> */}
                        </div>
                    </div>
                </div>
            </div>
        </div >
        // </div >
        // </div >
    );
};

export default Login;
