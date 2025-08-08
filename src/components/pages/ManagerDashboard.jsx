import React, { useState, useEffect } from 'react';
import './ManagerDashboard.css';
import './AdminForm.css';

const ManagerDashboard = ({ onLogout }) => {
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showAdminList, setShowAdminList] = useState(false);
  const [showAppointmentFilter, setShowAppointmentFilter] = useState(false);
  const [adminCount, setAdminCount] = useState(0);
  const [adminList, setAdminList] = useState([]);
  const [appointmentCount, setAppointmentCount] = useState(null);
  const [filterData, setFilterData] = useState({
    year: '',
    month: '',
    date: ''
  });
  const [adminFormData, setAdminFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'admin'
  });
  const [showAdminLeaves, setShowAdminLeaves] = useState(false);
  const [adminLeaves, setAdminLeaves] = useState([]);
  const [disabledButtons, setDisabledButtons] = useState(() => {
    const saved = localStorage.getItem('disabledLeaveButtons');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    fetchAdminCount();
  }, []);

  const fetchAdminLeaves = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/admin-leaves');
      const result = await response.json();
      if (result.success) {
        setAdminLeaves(result.leaves);
      }
    } catch (error) {
      console.error('Error fetching admin leaves:', error);
    }
  };

  const handleAdminLeavesClick = () => {
    fetchAdminLeaves();
    setShowAdminLeaves(true);
  };

  const handleLeaveAction = async (leaveId, action) => {
    const newDisabledSet = new Set(disabledButtons).add(leaveId);
    setDisabledButtons(newDisabledSet);
    localStorage.setItem('disabledLeaveButtons', JSON.stringify([...newDisabledSet]));

    try {
      const response = await fetch(`http://localhost:3001/api/auth/admin-leaves/${leaveId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action })
      });

      const result = await response.json();

      if (result.success) {
        alert(`Leave request ${action} successfully!`);
        setAdminLeaves(prev =>
          prev.map(leave =>
            leave.id === leaveId
              ? { ...leave, status: action }
              : leave
          )
        );
      } else {
        alert(result.message || `Failed to ${action} leave request`);
        const revertedSet = new Set(disabledButtons);
        revertedSet.delete(leaveId);
        setDisabledButtons(revertedSet);
        localStorage.setItem('disabledLeaveButtons', JSON.stringify([...revertedSet]));
      }
    } catch (error) {
      alert(`Error ${action}ing leave request: ` + error.message);
      const revertedSet = new Set(disabledButtons);
      revertedSet.delete(leaveId);
      setDisabledButtons(revertedSet);
      localStorage.setItem('disabledLeaveButtons', JSON.stringify([...revertedSet]));
    }
  };

  const fetchAdminCount = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/admin-count');
      const result = await response.json();
      if (result.success) {
        setAdminCount(result.count);
      }
    } catch (error) {
      console.error('Error fetching admin count:', error);
    }
  };

  const fetchAdminList = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/admin-list');
      const result = await response.json();
      if (result.success) {
        setAdminList(result.admins);
      }
    } catch (error) {
      console.error('Error fetching admin list:', error);
    }
  };

  const fetchAppointmentsByDate = async () => {
    try {
      const params = new URLSearchParams();
      if (filterData.year) params.append('year', filterData.year);
      if (filterData.month) params.append('month', filterData.month);
      if (filterData.date) params.append('date', filterData.date);

      const response = await fetch(`http://localhost:3001/api/auth/appointments-by-date?${params}`);
      const result = await response.json();

      if (result.success) {
        setAppointmentCount(result.count);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      alert('Error fetching appointments: ' + error.message);
    }
  };

  const handleAdminCardClick = () => {
    fetchAdminList();
    setShowAdminList(true);
  };

  const handleAppointmentCardClick = () => {
    setAppointmentCount(null); // Reset count when opening filter
    setFilterData({ year: '', month: '', date: '' }); // Reset form
    setShowAppointmentFilter(true);
  };

  const handleFilterChange = (e) => {
    setFilterData({
      ...filterData,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (!filterData.year) {
      alert('Please enter a year');
      return;
    }
    fetchAppointmentsByDate();
  };

  const handleAdminFormChange = (e) => {
    setAdminFormData({
      ...adminFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/auth/register-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminFormData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`Admin registered successfully! ID: ${result.admin.id}`);
        setShowAdminForm(false);
        setAdminFormData({ fullName: '', email: '', password: '', role: 'admin' });
        fetchAdminCount();
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (showAppointmentFilter) {
    return (
      <div className="appointment-filter-container">
        <div className="container-fluid h-100">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-md-6 col-lg-5">
              <div className="admin-form-card">
                <div className="text-center mb-4">
                  <button
                    className="back-btn"
                    onClick={() => setShowAppointmentFilter(false)}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Dashboard
                  </button>
                  <h2>Filter Appointments</h2>
                  <p className="text-muted">Check appointments by date</p>
                </div>

                <form onSubmit={handleFilterSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Year *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="year"
                      value={filterData.year}
                      onChange={handleFilterChange}
                      placeholder="Enter year (e.g., 2024)"
                      min="2020"
                      max="2030"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Month (Optional)</label>
                    <select
                      className="form-control"
                      name="month"
                      value={filterData.month}
                      onChange={handleFilterChange}
                    >
                      <option value="">Select month</option>
                      <option value="1">January</option>
                      <option value="2">February</option>
                      <option value="3">March</option>
                      <option value="4">April</option>
                      <option value="5">May</option>
                      <option value="6">June</option>
                      <option value="7">July</option>
                      <option value="8">August</option>
                      <option value="9">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Date (Optional)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="date"
                      value={filterData.date}
                      onChange={handleFilterChange}
                      placeholder="Enter date (1-31)"
                      min="1"
                      max="31"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100 py-3 mb-3">
                    <i className="fas fa-search me-2"></i>
                    Check Appointments
                  </button>
                </form>

                {appointmentCount !== null && (
                  <div className="alert alert-success text-center">
                    <h4 className="mb-2">{appointmentCount} Appointments</h4>
                    <p className="mb-0">
                      Found for {filterData.year}
                      {filterData.month && ` - ${new Date(0, filterData.month - 1).toLocaleString('default', { month: 'long' })}`}
                      {filterData.date && ` - ${filterData.date}`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showAdminLeaves) {
    return (
      <div className="admin-leaves-container">
        <div className="container-fluid h-100">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-md-10 col-lg-8">
              <div className="admin-list-card">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3>Admin Leave Requests ({adminLeaves.length})</h3>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowAdminLeaves(false)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                {adminLeaves.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                    <h5>No Leave Requests</h5>
                    <p className="text-muted">No admin leave requests found.</p>
                  </div>
                ) : (
                  <div className="admin-cards">
                    {adminLeaves.map((leave) => (
                      <div key={leave.id} className="admin-detail-card mb-3">
                        <div className="row align-items-center">
                          <div className="col-md-2 text-center">
                            <div className="admin-avatar">
                              <i className="fas fa-calendar-times fa-2x text-warning"></i>
                            </div>
                          </div>
                          <div className="col-md-8">
                            <div className="admin-info">
                              <h5 className="mb-1">{leave.adminName}</h5>
                              <p className="text-muted mb-1">
                                <i className="fas fa-calendar me-2"></i>
                                Leave Date: {new Date(leave.leaveDate).toLocaleDateString()}
                              </p>
                              <p className="text-muted mb-1">
                                <i className="fas fa-comment me-2"></i>
                                Reason: {leave.reason}
                              </p>
                              <p className="text-muted mb-1">
                                <i className="fas fa-clock me-2"></i>
                                Requested: {new Date(leave.createdAt).toLocaleDateString()}
                              </p>
                              <span className={`badge ${leave.status === 'approved' ? 'bg-success' :
                                leave.status === 'rejected' ? 'bg-danger' : 'bg-warning'
                                }`}>
                                {leave.status?.toUpperCase() || 'PENDING'}
                              </span>
                            </div>
                          </div>
                          <div className="col-md-2 text-end">
                            <div className="btn-group-vertical" role="group">
                              <button
                                className="btn btn-success btn-sm mb-2"
                                onClick={() => handleLeaveAction(leave.id, 'approved')}
                                disabled={disabledButtons.has(leave.id)}
                              >
                                <i className="fas fa-check me-1"></i>
                                Approve
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleLeaveAction(leave.id, 'rejected')}
                                disabled={disabledButtons.has(leave.id)}
                              >
                                <i className="fas fa-times me-1"></i>
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showAdminList) {
    return (
      <div className="admin-list-container">
        <div className="container-fluid h-100">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-md-8 col-lg-6">
              <div className="admin-list-card">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3>Active Admins ({adminCount})</h3>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowAdminList(false)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="admin-cards">
                  {adminList.map((admin) => (
                    <div key={admin.id} className="admin-detail-card mb-3">
                      <div className="row align-items-center">
                        <div className="col-md-2 text-center">
                          <div className="admin-avatar">
                            <i className="fas fa-user-shield fa-2x text-primary"></i>
                          </div>
                        </div>
                        <div className="col-md-10">
                          <div className="admin-info">
                            <h5 className="mb-1">{admin.fullName}</h5>
                            <p className="text-muted mb-1">
                              <i className="fas fa-envelope me-2"></i>
                              {admin.email}
                            </p>
                            <p className="text-muted mb-1">
                              <i className="fas fa-calendar me-2"></i>
                              Joined: {new Date(admin.createdAt).toLocaleDateString()}
                            </p>
                            <span className={`badge ${admin.role === 'admin' ? 'bg-primary' : admin.role === 'manager' ? 'bg-success' : 'bg-info'}`}>
                              {admin.role.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  <a className="nav-link" href="#" onClick={handleAppointmentCardClick}>
                    <i className="fas fa-calendar-alt me-2"></i>
                    Appointments
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link" href="#" onClick={handleAdminLeavesClick}>
                    <i className="fas fa-calendar-times me-2"></i>
                    Admin Leaves
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

          <div className="col-md-9 col-lg-10 main-content">
            <div className="p-4">
              <h2 className="mb-4">Dashboard Overview</h2>

              <div className="row mb-4">
                <div className="col-md-3 mb-3">
                  <div
                    className="card bg-primary text-white clickable-card"
                    onClick={handleAdminCardClick}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h4>{adminCount}</h4>
                          <p className="mb-0">Active Admins</p>
                        </div>
                        <i className="fas fa-user-shield fa-2x opacity-75"></i>
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
                  <div
                    className="card bg-warning text-white clickable-card"
                    onClick={handleAppointmentCardClick}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h4>Filter</h4>
                          <p className="mb-0">Check Appointments</p>
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

              <div className="row">
                <div className="col-md-8">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">System Overview</h5>
                    </div>
                    <div className="card-body">
                      <p className="text-muted">Welcome to the Manager Dashboard. Use the quick actions to manage your healthcare system.</p>
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
                        <button
                          className="btn btn-warning"
                          onClick={handleAppointmentCardClick}
                        >
                          <i className="fas fa-calendar-search me-2"></i>
                          Filter Appointments
                        </button>
                        <button className="btn btn-info">
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