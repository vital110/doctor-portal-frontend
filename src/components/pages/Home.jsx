import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            {/* Navigation Header */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
                <div className="container">
                    <a className="navbar-brand fw-bold text-primary" href="#">
                        <i className="fas fa-heartbeat me-2"></i>
                        HealthCare Portal
                    </a>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section bg-gradient-primary text-white py-5" style={{ marginTop: '76px' }}>
                <div className="container">
                    <div className="row align-items-center min-vh-75">
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bold mb-4">
                                Your Health, Our Priority
                            </h1>
                            <p className="lead mb-4">
                                Experience world-class healthcare with our team of expert doctors.
                                Book appointments, manage your health records, and get personalized care.
                            </p>
                            <div className="d-flex gap-3">
                                <button className="btn btn-light btn-lg px-4">
                                    Book Appointment
                                </button>
                                <button className="btn btn-outline-light btn-lg px-4">
                                    Learn More
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="hero-image-container">
                                <div className="hero-card bg-white text-dark p-4 rounded-4 shadow-lg">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-primary rounded-circle p-2 me-3">
                                            <i className="fas fa-user-md text-white"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-0">Dr. Sarah Johnson</h6>
                                            <small className="text-muted">Cardiologist</small>
                                        </div>
                                    </div>
                                    <p className="small mb-0">Available for consultation</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-5">
                <div className="container">
                    <div className="row text-center mb-5">
                        <div className="col-lg-8 mx-auto">
                            <h2 className="fw-bold mb-3">Why Choose Our Portal?</h2>
                            <p className="text-muted">Modern healthcare solutions designed for your convenience</p>
                        </div>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="feature-card text-center p-4 h-100">
                                <div className="feature-icon bg-primary bg-opacity-10 rounded-circle mx-auto mb-3">
                                    <i className="fas fa-calendar-check text-primary"></i>
                                </div>
                                <h5 className="fw-bold mb-3">Easy Booking</h5>
                                <p className="text-muted">Schedule appointments with your preferred doctors in just a few clicks</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card text-center p-4 h-100">
                                <div className="feature-icon bg-success bg-opacity-10 rounded-circle mx-auto mb-3">
                                    <i className="fas fa-shield-alt text-success"></i>
                                </div>
                                <h5 className="fw-bold mb-3">Secure Records</h5>
                                <p className="text-muted">Your medical records are safely stored and easily accessible</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card text-center p-4 h-100">
                                <div className="feature-icon bg-info bg-opacity-10 rounded-circle mx-auto mb-3">
                                    <i className="fas fa-clock text-info"></i>
                                </div>
                                <h5 className="fw-bold mb-3">24/7 Support</h5>
                                <p className="text-muted">Round-the-clock assistance for all your healthcare needs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-light py-5">
                <div className="container">
                    <div className="row text-center">
                        <div className="col-md-3 col-6 mb-4">
                            <div className="stat-item">
                                <h3 className="fw-bold text-primary mb-2">500+</h3>
                                <p className="text-muted mb-0">Expert Doctors</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-6 mb-4">
                            <div className="stat-item">
                                <h3 className="fw-bold text-success mb-2">10K+</h3>
                                <p className="text-muted mb-0">Happy Patients</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-6 mb-4">
                            <div className="stat-item">
                                <h3 className="fw-bold text-info mb-2">50+</h3>
                                <p className="text-muted mb-0">Specialties</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-6 mb-4">
                            <div className="stat-item">
                                <h3 className="fw-bold text-warning mb-2">24/7</h3>
                                <p className="text-muted mb-0">Emergency Care</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto text-center">
                            <h2 className="fw-bold mb-4">Ready to Get Started?</h2>
                            <p className="lead text-muted mb-4">
                                Join thousands of patients who trust us with their healthcare
                            </p>
                            <button className="btn btn-primary btn-lg px-5">
                                Get Started Today
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
