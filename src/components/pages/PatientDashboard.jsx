import React from 'react';

const PatientDashboard = ({ onLogout, patientData }) => {
  return (
    <div className="patient-dashboard">
      <nav className="navbar navbar-expand-lg navbar-dark bg-info">
        <div className="container-fluid">
          <span className="navbar-brand">
            <i className="fas fa-user me-2"></i>
            Patient Portal - {patientData?.fullName}
          </span>
          <div className="logout-container">
            <button className="logout-btn" onClick={onLogout}>
              <i className="fas fa-power-off"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-lg-2 bg-light sidebar">
            <div className="p-3">
              <h6 className="text-muted mb-3">PATIENT PORTAL</h6>
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <a className="nav-link active" href="#">
                    <i className="fas fa-tachometer-alt me-2"></i>
                    Dashboard
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link" href="#">
                    <i className="fas fa-calendar-plus me-2"></i>
                    Book Appointment
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link" href="#">
                    <i className="fas fa-file-medical me-2"></i>
                    Medical Records
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link" href="#">
                    <i className="fas fa-user-md me-2"></i>
                    My Doctors
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-9 col-lg-10 main-content">
            <div className="p-4">
              <h2 className="mb-4">Welcome, {patientData?.fullName}</h2>
              
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <div className="card bg-info text-white">
                    <div className="card-body">
                      <h5>Patient ID: {patientData?.id}</h5>
                      <p className="mb-0">Your unique patient identifier</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <h5>Account Status</h5>
                      <p className="mb-0">Active & Verified</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Quick Actions</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3 mb-3">
                      <button className="btn btn-primary w-100">
                        <i className="fas fa-calendar-plus me-2"></i>
                        Book Appointment
                      </button>
                    </div>
                    <div className="col-md-3 mb-3">
                      <button className="btn btn-success w-100">
                        <i className="fas fa-file-medical me-2"></i>
                        View Records
                      </button>
                    </div>
                    <div className="col-md-3 mb-3">
                      <button className="btn btn-warning w-100">
                        <i className="fas fa-user-md me-2"></i>
                        Find Doctors
                      </button>
                    </div>
                    <div className="col-md-3 mb-3">
                      <button className="btn btn-info w-100">
                        <i className="fas fa-comments me-2"></i>
                        Messages
                      </button>
                    </div>
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

export default PatientDashboard;