import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                navigate('/login');
            } else {
                alert(result.message || 'Registration failed');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const handleBackToHome = () => navigate('/');
    const handleGoToLogin = () => navigate('/login');

    const handleGoogleSignup = () => {
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com&redirect_uri=${encodeURIComponent('http://localhost:5173/login')}&response_type=code&scope=email profile&prompt=select_account`;
        window.open(googleAuthUrl, 'googleSignup', 'width=500,height=600,scrollbars=yes,resizable=yes');
    };

    const handleGoogleResponse = async (response) => {
        try {
            // Decode JWT token to get user info
            const payload = JSON.parse(atob(response.credential.split('.')[1]));

            const googleSignupData = {
                email: payload.email,
                name: payload.name,
                googleId: payload.sub
            };

            const apiResponse = await fetch('http://localhost:3001/api/auth/google-signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(googleSignupData)
            });

            const result = await apiResponse.json();

            if (result.success) {
                alert('Google signup successful! Please login.');
                navigate('/login');
            } else {
                alert(result.message || 'Google signup failed');
            }
        } catch (error) {
            alert('Error with Google signup: ' + error.message);
        }
    };

    return (
        <div className="login-container">
            <div className="container-fluid h-100">
                <div className="row h-100">
                    {/* Left Side - Image/Info */}
                    <div className="col-lg-6 d-none d-lg-flex">
                        <div className="login-info-side">
                            <div className="info-icon">
                                <i className="fas fa-user-plus"></i>
                            </div>
                            <h3 className="info-title">Join Our Healthcare Community</h3>
                            <p className="info-description">
                                Get personalized healthcare services and connect with top medical professionals
                            </p>
                            <div className="info-features">
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <i className="fas fa-shield-alt"></i>
                                    </div>
                                    <p className="feature-text">Secure & Private</p>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <i className="fas fa-clock"></i>
                                    </div>
                                    <p className="feature-text">24/7 Available</p>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <i className="fas fa-award"></i>
                                    </div>
                                    <p className="feature-text">Expert Care</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="col-lg-6 d-flex align-items-center justify-content-center">
                        <div className="login-card">
                            <div className="login-header">
                                <button
                                    className="back-btn"
                                    onClick={handleBackToHome}
                                >
                                    <i className="fas fa-arrow-left me-2"></i>

                                </button>
                                <h2 className="login-title">Create Account</h2>
                                <p className="login-subtitle">Start your healthcare journey with us</p>
                            </div>

                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <div className="input-wrapper">
                                        <i className="fas fa-user input-icon"></i>
                                        <input
                                            type="text"
                                            className="form-input"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                </div>

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
                                            placeholder="Create a password"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="remember-me">
                                    <input type="checkbox" id="terms" required />
                                    <label htmlFor="terms">
                                        I agree to the <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>
                                    </label>
                                </div>

                                <button type="submit" className="login-btn">
                                    <i className="fas fa-user-plus me-2"></i>
                                    Create Account
                                </button>

                                <div className="text-center my-3">
                                    <span className="text-muted">or</span>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-outline-danger w-100 py-3"
                                    onClick={handleGoogleSignup}
                                >
                                    <i className="fab fa-google me-2"></i>
                                    Sign up with Google
                                </button>

                                <div className="signup-link">
                                    <p>
                                        Already have an account?{' '}
                                        <button
                                            type="button"
                                            className="signup-btn"
                                            onClick={handleGoToLogin}
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
    );
};

export default Signup;
