import React, { useState } from 'react';

const ManagerDashboard = ({ onLogout }) => {
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'admin'
  });

  const handleAdminFormChange = (e) => {
    setAdminFormData({
      ...adminFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting admin data:', adminFormData);

    try {
      const response = await fetch('http://localhost:3001/api/auth/register-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminFormData)
      });

      const result = await response.json();
      console.log('Response:', result);

      if (response.ok && result.success) {
        alert(`Admin registered successfully! ID: ${result.admin.id}`);
        setShowAdminForm(false);
        setAdminFormData({ fullName: '', email: '', password: '', role: 'admin' });
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error: ' + error.message);
    }
  };

  if (showAdminForm) {
    return (
      <div className="admin-form-container">
        <div className="container-fluid h-100">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-md-6 col-lg-5">
              <div className="admin-form-card">
                <div className="text-center mb-4">
                  <button
                    className="back-btn"
                    onClick={() => setShowAdminForm(false)}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Dashboard
                  </button>
                  <h2>Register New Admin</h2>
                  <p className="text-muted">Add a new administrator to the system</p>
                </div>

                <form onSubmit={handleAdminSubmit}>
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
                        value={adminFormData.fullName}
                        onChange={handleAdminFormChange}
                        placeholder="Enter full name"
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
                        value={adminFormData.email}
                        onChange={handleAdminFormChange}
                        placeholder="Enter email address"
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
                        value={adminFormData.password}
                        onChange={handleAdminFormChange}
                        placeholder="Create password"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Role</label>
                    <div className="role-selection">
                      <div
                        className={`role-btn ${adminFormData.role === 'admin' ? 'active' : ''}`}
                        onClick={() => setAdminFormData({ ...adminFormData, role: 'admin' })}
                      >
                        <i className="fas fa-user-shield"></i>
                        Admin
                      </div>
                      <div
                        className={`role-btn ${adminFormData.role === 'manager' ? 'active' : ''}`}
                        onClick={() => setAdminFormData({ ...adminFormData, role: 'manager' })}
                      >
                        <i className="fas fa-cogs"></i>
                        Manager
                      </div>
                      <div
                        className={`role-btn ${adminFormData.role === 'supervisor' ? 'active' : ''}`}
                        onClick={() => setAdminFormData({ ...adminFormData, role: 'supervisor' })}
                      >
                        <i className="fas fa-eye"></i>
                        Supervisor
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="submit-btn">
                    <i className="fas fa-user-plus me-2"></i>
                    Register Admin
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="manager-dashboard">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">
            <i className="fas fa-cogs me-2"></i>
            Manager Dashboard
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
          {/* Sidebar */}
          <div className="col-md-3 col-lg-2 bg-light sidebar">
            <div className="p-3">
              <h6 className="text-muted mb-3">MANAGEMENT</h6>
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <a className="nav-link active" href="#">
                    <i className="fas fa-tachometer-alt me-2"></i>
                    Overview
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link" href="#">
                    <i className="fas fa-user-md me-2"></i>
                    Doctors
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link" href="#">
                    <i className="fas fa-users me-2"></i>
                    Patients
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link" href="#">
                    <i className="fas fa-calendar-alt me-2"></i>
                    Appointments
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link" href="#">
                    <i className="fas fa-chart-bar me-2"></i>
                    Reports
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9 col-lg-10 main-content">
            <div className="p-4">
              <h2 className="mb-4">Dashboard Overview</h2>

              {/* Stats Cards */}
              <div className="row mb-4">
                <div className="col-md-3 mb-3">
                  <div className="card bg-primary text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h4>150</h4>
                          <p className="mb-0">Total Doctors</p>
                        </div>
                        <i className="fas fa-user-md fa-2x opacity-75"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h4>2,450</h4>
                          <p className="mb-0">Total Patients</p>
                        </div>
                        <i className="fas fa-users fa-2x opacity-75"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card bg-warning text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h4>89</h4>
                          <p className="mb-0">Today's Appointments</p>
                        </div>
                        <i className="fas fa-calendar-check fa-2x opacity-75"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card bg-info text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h4>$12,500</h4>
                          <p className="mb-0">Monthly Revenue</p>
                        </div>
                        <i className="fas fa-dollar-sign fa-2x opacity-75"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="row">
                <div className="col-md-8">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">Recent Appointments</h5>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Patient</th>
                              <th>Doctor</th>
                              <th>Time</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>John Doe</td>
                              <td>Dr. Smith</td>
                              <td>10:00 AM</td>
                              <td><span className="badge bg-success">Completed</span></td>
                            </tr>
                            <tr>
                              <td>Jane Wilson</td>
                              <td>Dr. Johnson</td>
                              <td>11:30 AM</td>
                              <td><span className="badge bg-warning">In Progress</span></td>
                            </tr>
                            <tr>
                              <td>Mike Brown</td>
                              <td>Dr. Davis</td>
                              <td>2:00 PM</td>
                              <td><span className="badge bg-primary">Scheduled</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">Quick Actions</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-primary"
                          onClick={() => setShowAdminForm(true)}
                        >
                          <i className="fas fa-user-plus me-2"></i>
                          Register New Admin
                        </button>
                        <button className="btn btn-success">
                          <i className="fas fa-plus me-2"></i>
                          Add New Doctor
                        </button>
                        <button className="btn btn-info">
                          <i className="fas fa-calendar-plus me-2"></i>
                          Schedule Appointment
                        </button>
                        <button className="btn btn-warning">
                          <i className="fas fa-file-alt me-2"></i>
                          Generate Report
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
    </div>
  );
};

export default ManagerDashboard;