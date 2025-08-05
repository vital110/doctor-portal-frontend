import React, { useState } from 'react';
import ManagerDashboard from './ManagerDashboard';
import AdminDashboard from './AdminDashboard';

const Login = ({ onBack, onSignup }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isManager, setIsManager] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminData, setAdminData] = useState(null);

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
            return;
        }

        // Check admin credentials from database
        try {
            console.log('Attempting admin login with:', formData.email);
            const response = await fetch('http://localhost:3001/api/auth/login-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log('Login response:', result);

            if (response.ok && result.success) {
                console.log('Admin login successful:', result.admin);
                setIsAdmin(true);
                setAdminData(result.admin);
            } else {
                alert(result.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login error: ' + error.message);
        }
    };

    const handleLogout = () => {
        setIsManager(false);
        setIsAdmin(false);
        setAdminData(null);
        setFormData({ email: '', password: '' });
    };

    // Show manager dashboard if authenticated
    if (isManager) {
        return <ManagerDashboard onLogout={handleLogout} />;
    }

    // Show admin dashboard if authenticated
    if (isAdmin) {
        return <AdminDashboard onLogout={handleLogout} adminData={adminData} />;
    }

    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="container-fluid h-100">
                    <div className="row h-100">
                        {/* Left Side - Form */}
                        <div className="col-lg-6 d-flex align-items-center justify-content-center">
                            <div className="auth-form-container">
                                <div className="text-center mb-4">
                                    <button
                                        className="btn btn-link text-muted p-0 mb-3"
                                        onClick={onBack}
                                    >
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Back to Home
                                    </button>
                                    <h2 className="fw-bold text-dark mb-2">Welcome Back</h2>
                                    <p className="text-muted">Sign in to access your healthcare dashboard</p>
                                </div>

                                <form onSubmit={handleSubmit} className="auth-form">
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">Email Address</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="fas fa-envelope text-muted"></i>
                                            </span>
                                            <input
                                                type="email"
                                                className="form-control border-start-0 ps-0"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="fas fa-lock text-muted"></i>
                                            </span>
                                            <input
                                                type="password"
                                                className="form-control border-start-0 ps-0"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Enter your password"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="remember" />
                                            <label className="form-check-label text-muted" htmlFor="remember">
                                                Remember me
                                            </label>
                                        </div>
                                        <a href="#" className="text-primary text-decoration-none">
                                            Forgot Password?
                                        </a>
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100 py-3 mb-4">
                                        Sign In
                                    </button>

                                    <div className="text-center">
                                        <p className="text-muted mb-0">
                                            Don't have an account?{' '}
                                            <button
                                                type="button"
                                                className="btn btn-link text-primary p-0 text-decoration-none"
                                                onClick={onSignup}
                                            >
                                                Sign up here
                                            </button>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Right Side - Image/Info */}
                        <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-gradient-primary">
                            <div className="text-center text-white p-5">
                                <div className="auth-illustration mb-4">
                                    <i className="fas fa-user-md fa-5x mb-4 opacity-75"></i>
                                </div>
                                <h3 className="fw-bold mb-3">Access Your Health Dashboard</h3>
                                <p className="lead opacity-90 mb-4">
                                    Manage appointments, view medical records, and connect with healthcare professionals
                                </p>
                                <div className="d-flex justify-content-center gap-4">
                                    <div className="text-center">
                                        <i className="fas fa-calendar-check fa-2x mb-2"></i>
                                        <p className="small mb-0">Book Appointments</p>
                                    </div>
                                    <div className="text-center">
                                        <i className="fas fa-file-medical fa-2x mb-2"></i>
                                        <p className="small mb-0">Medical Records</p>
                                    </div>
                                    <div className="text-center">
                                        <i className="fas fa-comments fa-2x mb-2"></i>
                                        <p className="small mb-0">Chat with Doctors</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;