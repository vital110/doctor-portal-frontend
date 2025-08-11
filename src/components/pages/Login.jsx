import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ManagerDashboard from './ManagerDashboard';
import AdminDashboard from './AdminDashboard';
import PatientDashboard from './PatientDashboard';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { user, login, loading } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

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

        if (formData.email === MANAGER_CREDENTIALS.email &&
            formData.password === MANAGER_CREDENTIALS.password) {
            login({ userType: 'manager', email: formData.email });
            return;
        }

        try {
            const adminResponse = await fetch('http://localhost:3001/api/auth/login-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const adminResult = await adminResponse.json();

            if (adminResponse.ok && adminResult.success) {
                login({ userType: 'admin', userData: adminResult.admin });
                return;
            }

            const patientResponse = await fetch('http://localhost:3001/api/auth/login-patient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const patientResult = await patientResponse.json();

            if (patientResponse.ok && patientResult.success) {
                login({ userType: 'patient', userData: patientResult.patient });
                return;
            }

            alert('Invalid credentials');
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed');
        }
    };

    const handleBackToHome = (e) => {
        e.preventDefault();
        navigate('/');
        setFormData({ email: '', password: '' });
    };

    const handleGoToSignup = () => navigate('/signup');

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user?.userType === 'manager') {
        return <ManagerDashboard />;
    }

    if (user?.userType === 'admin') {
        return <AdminDashboard adminData={user.userData} />;
    }

    if (user?.userType === 'patient') {
        return <PatientDashboard patientData={user.userData} />;
    }

    return (
        <div className="login-container">
            <div className="container-fluid h-100">
                <div className="row h-100">
                    <div className="col-lg-6 d-flex align-items-center justify-content-center">
                        <div className="login-card">
                            <div className="login-header">
                                <button
                                    type="button"
                                    className="back-btn"
                                    onClick={handleBackToHome}
                                >
                                    <i className="fas fa-arrow-left me-2"></i>
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

                    <div className="col-lg-6 d-none d-lg-flex">
                        <div className="login-info-side">
                            <div className="info-icon">
                                <i className="fas fa-user-md"></i>
                            </div>
                            <h3 className="info-title">Access Your Health Dashboard</h3>
                            <p className="info-description">
                                Manage appointments, view medical records, and connect with healthcare professionals
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
