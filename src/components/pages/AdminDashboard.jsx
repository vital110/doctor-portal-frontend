import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ onLogout, adminData }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/all-appointments');
      const result = await response.json();
      if (result.success) {
        setAppointments(result.appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
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
      fetchAppointments();
    } catch (error) {
      alert('Error updating appointments: ' + error.message);
    }
  };

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
                    Appointments
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
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Patient Appointments ({appointments.length})</h2>
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
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  {appointments.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No appointments found</p>
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
                            <th>Patient Name</th>
                            <th>Doctor</th>
                            <th>Date</th>
                            <th>Time</th>
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
                                  disabled={appointment.status === 'confirmed'}   //checkbox disabled

                                />
                              </td>
                              <td>
                                <div>
                                  <strong>{appointment.patient?.fullName}</strong>
                                  <br />
                                  <small className="text-muted">{appointment.patient?.email}</small>
                                </div>
                              </td>
                              <td>Dr. {appointment.doctorName}</td>
                              <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                              <td>{appointment.appointmentTime}</td>
                              <td>
                                <span title={appointment.reason}>
                                  {appointment.reason.length > 50
                                    ? appointment.reason.substring(0, 50) + '...'
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

              <div className="row mt-4">
                <div className="col-md-4">
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <h4>{appointments.filter(apt => apt.status === 'pending').length}</h4>
                      <p className="mb-0">Pending Appointments</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <h4>{appointments.filter(apt => apt.status === 'confirmed').length}</h4>
                      <p className="mb-0">Confirmed Appointments</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-danger text-white">
                    <div className="card-body text-center">
                      <h4>{appointments.filter(apt => apt.status === 'cancelled').length}</h4>
                      <p className="mb-0">Cancelled Appointments</p>
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

export default AdminDashboard;