import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './ManagerDashboard.css';
import './AdminForm.css';
import './SubmitSalaryForm.css';
import './SalaryList.css';

const ManagerDashboard = ({ onLogout }) => {
  const { logout, extendSession } = useAuth();
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

  const [showSalaryForm, setShowSalaryForm] = useState(false);
  const [salaryFormData, setSalaryFormData] = useState({
    adminName: '',
    amount: '',
    month: '',
    year: new Date().getFullYear()
  });
  const [showSalaryList, setShowSalaryList] = useState(false);
  const [salaryList, setSalaryList] = useState([]);
  const [filteredSalaryList, setFilteredSalaryList] = useState([]);
  const [salaryFilter, setSalaryFilter] = useState({
    adminName: '',
    month: '',
    year: ''
  });

  useEffect(() => {
    fetchAdminCount();
  }, []);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, []);

  const handleActivity = () => {
    extendSession();
  };

  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
  };

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
      }
    } catch (error) {
      alert(`Error ${action}ing leave request: ` + error.message);
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

  const handleSalaryFormChange = (e) => {
    setSalaryFormData({
      ...salaryFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSalarySubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/auth/admin-salaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...salaryFormData,
          submittedBy: 'Manager'
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Admin salary submitted successfully!');
        setShowSalaryForm(false);
        setSalaryFormData({ adminName: '', amount: '', month: '', year: new Date().getFullYear() });
      } else {
        alert(result.message || 'Failed to submit salary');
      }
    } catch (error) {
      alert('Error submitting salary: ' + error.message);
    }
  };

  const fetchSalaryList = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/all-admin-salaries');
      const result = await response.json();
      if (result.success) {
        setSalaryList(result.salaries);
        setFilteredSalaryList(result.salaries);
      }
    } catch (error) {
      console.error('Error fetching salary list:', error);
    }
  };

  const handleSalaryListClick = () => {
    fetchSalaryList();
    setShowSalaryList(true);
  };

  const handleSalaryFilterChange = (e) => {
    setSalaryFilter({
      ...salaryFilter,
      [e.target.name]: e.target.value
    });
  };

  const applySalaryFilter = () => {
    let filtered = salaryList;

    if (salaryFilter.adminName) {
      filtered = filtered.filter(salary =>
        salary.adminName.toLowerCase().includes(salaryFilter.adminName.toLowerCase())
      );
    }

    if (salaryFilter.month) {
      filtered = filtered.filter(salary =>
        salary.month.toString() === salaryFilter.month
      );
    }

    if (salaryFilter.year) {
      filtered = filtered.filter(salary =>
        salary.year.toString() === salaryFilter.year
      );
    }

    setFilteredSalaryList(filtered);
  };

  const clearSalaryFilter = () => {
    setSalaryFilter({ adminName: '', month: '', year: '' });
    setFilteredSalaryList(salaryList);
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
                                disabled={leave.status === 'approved' || leave.status === 'rejected'}
                              >
                                <i className="fas fa-check me-1"></i>
                                Approve
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleLeaveAction(leave.id, 'rejected')}
                                disabled={leave.status === 'approved' || leave.status === 'rejected'}
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

  if (showSalaryList) {
    const displayList = filteredSalaryList;
    const totalAmount = displayList.reduce((sum, salary) => sum + parseFloat(salary.amount), 0);

    return (
      <div className="salary-list-container">
        <div className="container-fluid h-100">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-md-10 col-lg-8">
              <div className="salary-list-card">
                <div className="salary-list-header">
                  <button
                    className="salary-list-back-btn"
                    onClick={() => setShowSalaryList(false)}
                  >
                    <i className="fas fa-times me-2"></i>
                    Close
                  </button>
                  <h2><i className="fas fa-list-alt me-2"></i>Submitted Salaries</h2>
                  <p>Complete list of admin salary submissions</p>
                </div>

                <div className="salary-list-content">
                  {/* Filter Section */}
                  <div className="salary-filter-section">
                    <div className="row g-2">
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="salary-filter-input"
                          placeholder="Admin Name"
                          name="adminName"
                          value={salaryFilter.adminName}
                          onChange={handleSalaryFilterChange}
                        />
                      </div>
                      <div className="col-md-3">
                        <select
                          className="salary-filter-input"
                          name="month"
                          value={salaryFilter.month}
                          onChange={handleSalaryFilterChange}
                        >
                          <option value="">All Months</option>
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
                      <div className="col-md-2">
                        <input
                          type="number"
                          className="salary-filter-input"
                          placeholder="Year"
                          name="year"
                          value={salaryFilter.year}
                          onChange={handleSalaryFilterChange}
                          min="2020"
                          max="2030"
                        />
                      </div>
                      <div className="col-md-3">
                        <div className="d-flex gap-2">
                          <button
                            className="salary-filter-btn btn btn-primary"
                            onClick={applySalaryFilter}
                          >
                            <i className="fas fa-search me-1"></i>Filter
                          </button>
                          <button
                            className="salary-filter-btn btn btn-outline-secondary"
                            onClick={clearSalaryFilter}
                          >
                            <i className="fas fa-times me-1"></i>Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {displayList.length > 0 && (
                    <div className="salary-list-stats">
                      <div className="salary-list-total">${totalAmount.toFixed(2)}</div>
                      <div className="salary-list-count">Total from {displayList.length} submission{displayList.length !== 1 ? 's' : ''}</div>
                    </div>
                  )}

                  {displayList.length === 0 ? (
                    <div className="salary-list-empty-state">
                      <i className="fas fa-dollar-sign"></i>
                      <h5>No Salaries Found</h5>
                      <p>{salaryList.length === 0 ? 'No admin salaries have been submitted yet.' : 'No salaries match the current filter criteria.'}</p>
                    </div>
                  ) : (
                    <div className="salary-list-items">
                      {displayList.map((salary) => (
                        <div key={salary.id} className="salary-list-item">
                          <div className="row align-items-center">
                            <div className="col-md-2 text-center">
                              <div className="salary-list-icon">
                                <i className="fas fa-check-circle fa-lg"></i>
                              </div>
                            </div>
                            <div className="col-md-10">
                              <div className="salary-list-amount">${parseFloat(salary.amount).toFixed(2)}</div>
                              <div className="salary-list-detail">
                                <i className="fas fa-user"></i>
                                <strong>Admin:</strong> {salary.adminName}
                              </div>
                              <div className="salary-list-detail">
                                <i className="fas fa-calendar"></i>
                                <strong>Period:</strong> {new Date(0, salary.month - 1).toLocaleString('default', { month: 'long' })} {salary.year}
                              </div>
                              <div className="salary-list-detail">
                                <i className="fas fa-clock"></i>
                                <strong>Submitted:</strong> {new Date(salary.createdAt).toLocaleDateString()} at {new Date(salary.createdAt).toLocaleTimeString()}
                              </div>
                              <div className="salary-list-detail">
                                <i className="fas fa-user-tie"></i>
                                <strong>By:</strong> {salary.submittedBy} <span className="salary-list-badge">Credited</span>
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
      </div>
    );
  }

  if (showSalaryForm) {
    return (
      <div className="salary-form-container">
        <div className="container-fluid h-100">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-md-8 col-lg-6">
              <div className="salary-form-card">
                <div className="salary-form-header">
                  <button
                    className="salary-back-btn"
                    onClick={() => setShowSalaryForm(false)}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Dashboard
                  </button>
                  <h2><i className="fas fa-dollar-sign me-2"></i>Submit Admin Salary</h2>
                  <p>Credit salary to admin account</p>
                </div>

                <div className="salary-form-content">
                  <form onSubmit={handleSalarySubmit}>
                    <div className="salary-form-group">
                      <label className="salary-form-label">Admin Name *</label>
                      <input
                        type="text"
                        className="salary-form-input"
                        name="adminName"
                        value={salaryFormData.adminName}
                        onChange={handleSalaryFormChange}
                        placeholder="Enter admin full name"
                        required
                      />
                    </div>

                    <div className="salary-form-group">
                      <label className="salary-form-label">Salary Amount *</label>
                      <div className="salary-amount-group">
                        <span className="salary-amount-prefix">$</span>
                        <input
                          type="number"
                          className="salary-form-input salary-amount-input"
                          name="amount"
                          value={salaryFormData.amount}
                          onChange={handleSalaryFormChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    <div className="salary-form-group">
                      <label className="salary-form-label">Month *</label>
                      <div className="salary-month-buttons">
                        <div className="salary-month-btn-group">
                          <button
                            type="button"
                            className="salary-month-btn previous"
                            onClick={() => {
                              const prevMonth = new Date().getMonth() === 0 ? 12 : new Date().getMonth();
                              const prevYear = new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear();
                              setSalaryFormData({ ...salaryFormData, month: prevMonth.toString(), year: prevYear });
                            }}
                          >
                            Previous Month
                          </button>
                          <button
                            type="button"
                            className="salary-month-btn current"
                            onClick={() => {
                              setSalaryFormData({ ...salaryFormData, month: (new Date().getMonth() + 1).toString(), year: new Date().getFullYear() });
                            }}
                          >
                            Current Month
                          </button>
                          <button
                            type="button"
                            className="salary-month-btn advance"
                            onClick={() => {
                              const nextMonth = new Date().getMonth() === 11 ? 1 : new Date().getMonth() + 2;
                              const nextYear = new Date().getMonth() === 11 ? new Date().getFullYear() + 1 : new Date().getFullYear();
                              setSalaryFormData({ ...salaryFormData, month: nextMonth.toString(), year: nextYear });
                            }}
                          >
                            Advance Month
                          </button>
                        </div>
                      </div>
                      <select
                        className="salary-form-select"
                        name="month"
                        value={salaryFormData.month}
                        onChange={handleSalaryFormChange}
                        required
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

                    <div className="salary-form-group">
                      <label className="salary-form-label">Year *</label>
                      <input
                        type="number"
                        className="salary-form-input"
                        name="year"
                        value={salaryFormData.year}
                        onChange={handleSalaryFormChange}
                        min="2020"
                        max="2030"
                        required
                      />
                    </div>

                    <button type="submit" className="salary-submit-btn">
                      <i className="fas fa-credit-card me-2"></i>
                      Submit Salary
                    </button>
                  </form>
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
            <button className="logout-btn" onClick={handleLogout}>
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
                  <a className="nav-link" href="#" onClick={() => setShowSalaryForm(true)}>
                    <i className="fas fa-dollar-sign me-2"></i>
                    Submit Salary
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link" href="#" onClick={handleSalaryListClick}>
                    <i className="fas fa-list-alt me-2"></i>
                    Salary List
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
                        <button
                          className="btn btn-success"
                          onClick={() => setShowSalaryForm(true)}
                        >
                          <i className="fas fa-dollar-sign me-2"></i>
                          Submit Admin Salary
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