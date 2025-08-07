import React, { useState, useEffect } from 'react';
import SystemSettings from './SystemSettings';
import UploadMedicalRecord from './UploadMedicalRecord';
import './AdminDashboard.css';
import './PreviousAppointments.css';

const AdminDashboard = ({ onLogout, adminData }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [showPreviousFilter, setShowPreviousFilter] = useState(false);
  const [showSystemSettings, setShowSystemSettings] = useState(false);
  const [showUploadMedical, setShowUploadMedical] = useState(false);
  const [filterData, setFilterData] = useState({
    year: '',
    month: '',
    date: ''
  });
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filterDescription, setFilterDescription] = useState('');

  useEffect(() => {
    fetchTodayAppointments();
    const interval = setInterval(fetchTodayAppointments, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTodayAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/today-appointments');
      const result = await response.json();
      if (result.success) {
        setAppointments(result.appointments);
        setCurrentDate(result.date);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchPreviousAppointments = async () => {
    try {
      const params = new URLSearchParams();
      if (filterData.year) params.append('year', filterData.year);
      if (filterData.month) params.append('month', filterData.month);
      if (filterData.date) params.append('date', filterData.date);

      const response = await fetch(`http://localhost:3001/api/auth/admin-appointments-by-date?${params}`);
      const result = await response.json();

      if (result.success) {
        setFilteredAppointments(result.appointments);
        setFilterDescription(result.filter);
      }
    } catch (error) {
      alert('Error fetching appointments: ' + error.message);
    }
  };

  const handleCheckboxChange = (appointmentId) => {
    setSelectedAppointments(prev =>
      prev.includes(appointmentId)
        ? prev.filter(id => id !== appointmentId)
        : [...prev, appointmentId]
    );
  };

  const handleStatusUpdate = async (status) => {
    if (selectedAppointments.length === 0) {
      alert('Please select appointments to update');
      return;
    }

    try {
      for (const appointmentId of selectedAppointments) {
        await fetch(`http://localhost:3001/api/auth/update-appointment/${appointmentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status })
        });
      }

      alert(`${selectedAppointments.length} appointment(s) ${status}`);
      setSelectedAppointments([]);
      fetchTodayAppointments();
    } catch (error) {
      alert('Error updating appointments: ' + error.message);
    }
  };

  const handleFilterChange = (e) => {
    setFilterData({
      ...filterData,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (!filterData.year || !filterData.month) {
      alert('Please select year and month');
      return;
    }
    fetchPreviousAppointments();
  };

  if (showUploadMedical) {
    return <UploadMedicalRecord onBack={() => setShowUploadMedical(false)} adminData={adminData} />;
  }

  if (showSystemSettings) {
    return <SystemSettings onBack={() => setShowSystemSettings(false)} />;
  }

  if (showPreviousFilter) {
    return (
      <div className="appointment-filter-container">
        <div className="appointment-filter-card">
          <div className="appointment-filter-header">
            <button
              className="back-btn"
              onClick={() => setShowPreviousFilter(false)}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to Dashboard
            </button>
            <h2>Previous Appointments</h2>
            <p>Search appointments by date and month</p>
          </div>

          <form onSubmit={handleFilterSubmit} className="filter-form">
            <div className="row">
              <div className="col-md-4">
                <label className="form-label">Year *</label>
                <input
                  type="number"
                  className="form-control"
                  name="year"
                  value={filterData.year}
                  onChange={handleFilterChange}
                  placeholder="2024"
                  min="2020"
                  max="2030"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Month *</label>
                <select
                  className="form-select"
                  name="month"
                  value={filterData.month}
                  onChange={handleFilterChange}
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
              <div className="col-md-4">
                <label className="form-label">Date (Optional)</label>
                <input
                  type="number"
                  className="form-control"
                  name="date"
                  value={filterData.date}
                  onChange={handleFilterChange}
                  placeholder="Day"
                  min="1"
                  max="31"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              <i className="fas fa-search me-2"></i>
              Search Appointments
            </button>
          </form>

          {filteredAppointments.length > 0 && (
            <div className="results-section">
              <div className="results-header">
                <h4>Appointments for {filterDescription} ({filteredAppointments.length})</h4>
              </div>
              <div className="results-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                        <td><strong>{appointment.appointmentTime}</strong></td>
                        <td>
                          <div>
                            <strong>{appointment.patient?.fullName}</strong>
                            <br />
                            <small>{appointment.patient?.email}</small>
                          </div>
                        </td>
                        <td>Dr. {appointment.doctorName}</td>
                        <td>
                          <span className={`status-badge ${
                            appointment.status === 'confirmed' ? 'confirmed' :
                            appointment.status === 'cancelled' ? 'cancelled' : 'pending'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredAppointments.length === 0 && filterDescription && (
            <div className="no-results-alert">
              <i className="fas fa-info-circle"></i>
              No appointments found for {filterDescription}
            </div>
          )}
        </div>
      </div>
    );
  }

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
                    <i className="fas fa-calendar-check me-2"></i>
                    Today's Appointments
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link" href="#" onClick={() => setShowPreviousFilter(true)}>
                    <i className="fas fa-history me-2"></i>
                    Previous Appointments
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link" href="#" onClick={() => setShowUploadMedical(true)}>
                    <i className="fas fa-cloud-upload-alt me-2"></i>
                    Upload Medical Record
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link" href="#">
                    <i className="fas fa-users-cog me-2"></i>
                    User Management
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link" href="#" onClick={() => setShowSystemSettings(true)}>
                    <i className="fas fa-hospital me-2"></i>
                    System Settings
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-9 col-lg-10 main-content">
            <div className="p-4">
              {/* Professional Stats Cards */}
              <div className="row stats-cards mb-4">
                <div className="col-md-4">
                  <div className="stats-card pending">
                    <div className="stats-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="stats-number">{appointments.filter(apt => apt.status === 'pending').length}</div>
                    <p className="stats-label">Pending</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stats-card confirmed">
                    <div className="stats-icon">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="stats-number">{appointments.filter(apt => apt.status === 'confirmed').length}</div>
                    <p className="stats-label">Confirmed</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stats-card cancelled">
                    <div className="stats-icon">
                      <i className="fas fa-times-circle"></i>
                    </div>
                    <div className="stats-number">{appointments.filter(apt => apt.status === 'cancelled').length}</div>
                    <p className="stats-label">Cancelled</p>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2>Today's Appointments ({appointments.length})</h2>
                  <p className="text-muted mb-0">{currentDate}</p>
                </div>
                <div className="btn-group">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleStatusUpdate('confirmed')}
                    disabled={selectedAppointments.length === 0}
                  >
                    <i className="fas fa-check me-1"></i>
                    Confirm
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleStatusUpdate('cancelled')}
                    disabled={selectedAppointments.length === 0}
                  >
                    <i className="fas fa-times me-1"></i>
                    Cancel
                  </button>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={fetchTodayAppointments}
                  >
                    <i className="fas fa-sync me-1"></i>
                    Refresh
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => setShowPreviousFilter(true)}
                  >
                    <i className="fas fa-history me-1"></i>
                    Previous
                  </button>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  {appointments.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                      <h5>No appointments for today</h5>
                      <p className="text-muted">All appointments will be automatically cleaned after midnight</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th width="50">
                              <input
                                type="checkbox"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedAppointments(appointments.map(apt => apt.id));
                                  } else {
                                    setSelectedAppointments([]);
                                  }
                                }}
                                checked={selectedAppointments.length === appointments.length && appointments.length > 0}
                              />
                            </th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Patient Name</th>
                            <th>Doctor</th>
                            <th>Reason</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map((appointment) => (
                            <tr key={appointment.id}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={selectedAppointments.includes(appointment.id)}
                                  onChange={() => handleCheckboxChange(appointment.id)}
                                  disabled={appointment.status === 'confirmed'}
                                />
                              </td>
                              <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                              <td>
                                <strong>{appointment.appointmentTime}</strong>
                              </td>
                              <td>
                                <div>
                                  <strong>{appointment.patient?.fullName}</strong>
                                  <br />
                                  <small className="text-muted">{appointment.patient?.email}</small>
                                </div>
                              </td>
                              <td>Dr. {appointment.doctorName}</td>
                              <td>
                                <span title={appointment.reason}>
                                  {appointment.reason.length > 40
                                    ? appointment.reason.substring(0, 40) + '...'
                                    : appointment.reason}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${appointment.status === 'confirmed' ? 'bg-success' :
                                  appointment.status === 'cancelled' ? 'bg-danger' : 'bg-warning'
                                  }`}>
                                  {appointment.status.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>



              <div className="alert alert-info mt-4">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Auto Cleanup:</strong> Old appointments are automatically removed after midnight to keep the system clean.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;