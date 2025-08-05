import React from 'react';

const AdminDashboard = ({ onLogout, adminData }) => {
  return (
    <div className="admin-dashboard">
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container-fluid">
          <span className="navbar-brand">
            <i className="fas fa-user-shield me-2"></i>
            Admin Panel - {adminData?.role || 'Admin'}
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
              <h6 className="text-muted mb-3">ADMINISTRATION</h6>
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <a className="nav-link active" href="#">
                    <i className="fas fa-tachometer-alt me-2"></i>
                    Dashboard
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link" href="#">
                    <i className="fas fa-users-cog me-2"></i>
                    User Management
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link" href="#">
                    <i className="fas fa-hospital me-2"></i>
                    System Settings
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-9 col-lg-10 main-content">
            <div className="p-4">
              <h2 className="mb-4">Welcome, {adminData?.fullName || 'Admin'}</h2>

              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <h5>Role: {adminData?.role || 'Admin'}</h5>
                      <p className="mb-0">Access Level: Full Control</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="card bg-info text-white">
                    <div className="card-body">
                      <h5>System Status</h5>
                      <p className="mb-0">All systems operational</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Admin Actions</h5>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2 d-md-flex">
                    <button className="btn btn-primary">
                      <i className="fas fa-users me-2"></i>
                      Manage Users
                    </button>
                    <button className="btn btn-success">
                      <i className="fas fa-cog me-2"></i>
                      System Config
                    </button>
                    <button className="btn btn-warning">
                      <i className="fas fa-chart-line me-2"></i>
                      View Reports
                    </button>
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

export default AdminDashboard;