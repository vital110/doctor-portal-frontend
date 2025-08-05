import React, { useState, useEffect } from 'react';

const Signup = ({ onBack, onLogin }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        // confirmPassword: ''
    });
    const [isHoliday, setIsHoliday] = useState(false);
    const [holidayInfo, setHolidayInfo] = useState(null);

    useEffect(() => {
        checkHoliday();
    }, []);

    const checkHoliday = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/check-holiday');
            const result = await response.json();
            if (result.success && result.isHoliday) {
                setIsHoliday(true);
                setHolidayInfo(result.holiday);
            }
        } catch (error) {
            console.error('Error checking holiday:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (formData.password !== formData.confirmPassword) {
        //     alert('Passwords do not match');
        //     return;
        // }

        try {
            const response = await fetch('http://localhost:3001/api/auth/register-patient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert('Registration successful! Please login.');
                onLogin();
            } else {
                alert(result.message || 'Registration failed');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="container-fluid h-100">
                    <div className="row h-100">
                        {/* Left Side - Image/Info */}
                        <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-gradient-secondary">
                            <div className="text-center text-white p-5">
                                <div className="auth-illustration mb-4">
                                    <i className="fas fa-user-plus fa-5x mb-4 opacity-75"></i>
                                </div>
                                <h3 className="fw-bold mb-3">Join Our Healthcare Community</h3>
                                <p className="lead opacity-90 mb-4">
                                    Get personalized healthcare services and connect with top medical professionals
                                </p>
                                <div className="row text-center">
                                    <div className="col-4">
                                        <i className="fas fa-shield-alt fa-2x mb-2"></i>
                                        <p className="small mb-0">Secure & Private</p>
                                    </div>
                                    <div className="col-4">
                                        <i className="fas fa-clock fa-2x mb-2"></i>
                                        <p className="small mb-0">24/7 Available</p>
                                    </div>
                                    <div className="col-4">
                                        <i className="fas fa-award fa-2x mb-2"></i>
                                        <p className="small mb-0">Expert Care</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form */}
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
                                    <h2 className="fw-bold text-dark mb-2">Create Account</h2>
                                    <p className="text-muted">Start your healthcare journey with us</p>
                                </div>

                                {isHoliday && (
                                    <div className="alert alert-warning mb-4">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-calendar-times fa-2x me-3 text-warning"></i>
                                            <div>
                                                <h5 className="alert-heading mb-1">Holiday Notice</h5>
                                                <p className="mb-0">
                                                    <strong>Today is a holiday:</strong> {holidayInfo?.reason}
                                                    <br />
                                                    <small className="text-muted">Registration is temporarily disabled. Please try again tomorrow.</small>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="auth-form">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Full Name</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="fas fa-user text-muted"></i>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control border-start-0 ps-0"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                disabled={isHoliday}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
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
                                                disabled={isHoliday}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
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
                                                placeholder="Create a password"
                                                disabled={isHoliday}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* <div className="mb-4">
                                        <label className="form-label fw-semibold">Confirm Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="fas fa-lock text-muted"></i>
                                            </span>
                                            <input
                                                type="password"
                                                className="form-control border-start-0 ps-0"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Confirm your password"
                                                required
                                            />
                                        </div>
                                    </div> */}

                                    <div className="form-check mb-4">
                                        <input className="form-check-input" type="checkbox" id="terms" disabled={isHoliday} required />
                                        <label className="form-check-label text-muted" htmlFor="terms">
                                            I agree to the <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>
                                        </label>
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100 py-3 mb-4" disabled={isHoliday}>
                                        {isHoliday ? 'Registration Closed - Holiday' : 'Create Account'}
                                    </button>

                                    <div className="text-center">
                                        <p className="text-muted mb-0">
                                            Already have an account?{' '}
                                            <button
                                                type="button"
                                                className="btn btn-link text-primary p-0 text-decoration-none"
                                                onClick={onLogin}
                                            >
                                                Sign in here
                                            </button>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;