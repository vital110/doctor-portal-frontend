import React, { useState, useEffect } from 'react';
import MedicalRecords from './MedicalRecords';

const PatientDashboard = ({ onLogout, patientData }) => {
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
  const [showMedicalRecords, setShowMedicalRecords] = useState(false);
  const [showUploadDocument, setShowUploadDocument] = useState(false);
  const [showMyDocuments, setShowMyDocuments] = useState(false);
  const [myDocuments, setMyDocuments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    doctorName: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });
  const [isHoliday, setIsHoliday] = useState(false);
  const [holidayInfo, setHolidayInfo] = useState(null);

  useEffect(() => {
    if (showAppointmentForm) {
      checkHoliday();
    }
  }, [showAppointmentForm]);

  const checkHoliday = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/check-holiday');
      const result = await response.json();
      if (result.success && result.isHoliday) {
        setIsHoliday(true);
        setHolidayInfo(result.holiday);
      } else {
        setIsHoliday(false);
        setHolidayInfo(null);
      }
    } catch (error) {
      console.error('Error checking holiday:', error);
    }
  };

  const handleAppointmentChange = (e) => {
    setAppointmentData({
      ...appointmentData,
      [e.target.name]: e.target.value
    });
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/auth/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patientData.id,
          ...appointmentData
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Appointment booked successfully!');
        setShowAppointmentForm(false);
        setAppointmentData({
          doctorName: '',
          appointmentDate: '',
          appointmentTime: '',
          reason: ''
        });
      } else {
        if (result.isOnLeave) {
          alert(`❌ ${result.message}\n\nPlease select a different date or doctor.`);
        } else {
          alert(result.message || 'Booking failed');
        }
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/auth/patient-appointments/${patientData.id}`);
      const result = await response.json();

      if (result.success) {
        setAppointments(result.appointments);
        setShowAppointments(true);
      }
    } catch (error) {
      alert('Error fetching appointments: ' + error.message);
    }
  };

  if (showMyDocuments) {
    return (
      <div className="my-documents-container">
        <div className="container-fluid h-100">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-md-10 col-lg-8">
              <div className="my-documents-card">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h3><i className="fas fa-folder-open me-2"></i>My Documents</h3>
                    <p className="text-muted mb-0">Your uploaded medical documents ({myDocuments.length})</p>
                  </div>
                  <button className="btn btn-outline-secondary" onClick={() => setShowMyDocuments(false)}>
                    <i className="fas fa-arrow-left me-2"></i>Back to Upload
                  </button>
                </div>

                {myDocuments.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
                    <h5>No Documents Found</h5>
                    <p className="text-muted">You haven't uploaded any documents yet.</p>
                  </div>
                ) : (
                  <div className="documents-list">
                    {myDocuments.map((doc) => (
                      <div key={doc.id} className="document-card mb-3 p-3 border rounded">
                        <div className="row align-items-center">
                          <div className="col-md-1">
                            <i className="fas fa-file-pdf fa-2x text-danger"></i>
                          </div>
                          <div className="col-md-9">
                            <h6 className="mb-1">{doc.title}</h6>
                            <p className="text-muted mb-1 small">{doc.description || 'No description provided'}</p>
                            <div className="d-flex gap-3 small text-muted">
                              <span><i className="fas fa-calendar me-1"></i>{new Date(doc.createdAt).toLocaleDateString()}</span>
                              <span><i className="fas fa-file me-1"></i>{doc.fileName}</span>
                              <span><i className="fas fa-weight me-1"></i>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                            </div>
                          </div>
                          <div className="col-md-2 text-end">
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this document?')) {
                                  try {
                                    const response = await fetch(`http://localhost:3001/api/auth/patient-document/${doc.id}`, {
                                      method: 'DELETE'
                                    });
                                    
                                    const result = await response.json();
                                    
                                    if (result.success) {
                                      setMyDocuments(prev => prev.filter(d => d.id !== doc.id));
                                      alert('Document deleted successfully!');
                                    } else {
                                      alert(result.message || 'Failed to delete document');
                                    }
                                  } catch (error) {
                                    alert('Error deleting document: ' + error.message);
                                  }
                                }
                              }}
                            >
                              <i className="fas fa-trash me-1"></i>Delete
                            </button>
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

  if (showUploadDocument) {
    return (
      <div className="upload-document-container">
        <div className="container-fluid h-100">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-md-6 col-lg-5">
              <div className="upload-document-card">
                <div className="text-center mb-4">
                  <button
                    className="back-btn"
                    onClick={() => setShowUploadDocument(false)}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Dashboard
                  </button>
                  <h2><i className="fas fa-cloud-upload-alt me-2"></i>Upload Document</h2>
                  <p className="text-muted">Upload your personal medical documents</p>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  formData.append('patientId', patientData.id);
                  
                  try {
                    const response = await fetch('http://localhost:3001/api/auth/upload-patient-document', {
                      method: 'POST',
                      body: formData
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                      alert('Document uploaded successfully!');
                      setShowUploadDocument(false);
                    } else {
                      alert(result.message || 'Upload failed');
                    }
                  } catch (error) {
                    alert('Error uploading document: ' + error.message);
                  }
                }}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Document Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      placeholder="Enter document title"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      placeholder="Brief description (optional)"
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Select PDF File *</label>
                    <input
                      type="file"
                      className="form-control"
                      name="documentFile"
                      accept=".pdf"
                      required
                    />
                    <div className="form-text">Only PDF files are allowed (Max: 10MB)</div>
                  </div>

                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary py-3">
                      <i className="fas fa-upload me-2"></i>
                      Upload Document
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary py-2"
                      onClick={async () => {
                        try {
                          const response = await fetch(`http://localhost:3001/api/auth/patient-documents/${patientData.id}`);
                          const result = await response.json();
                          if (result.success) {
                            setMyDocuments(result.documents);
                            setShowMyDocuments(true);
                          }
                        } catch (error) {
                          alert('Error fetching documents: ' + error.message);
                        }
                      }}
                    >
                      <i className="fas fa-eye me-2"></i>
                      View My Documents
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showMedicalRecords) {
    return <MedicalRecords onBack={() => setShowMedicalRecords(false)} patientData={patientData} />;
  }

  if (showAppointments) {
    return (
      <div className="appointments-view-container">
        <div className="container-fluid h-100">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-md-10 col-lg-8">
              <div className="appointments-view-card">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3>My Appointments</h3>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowAppointments(false)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="appointments-list">
                  {appointments.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No appointments found</p>
                    </div>
                  ) : (
                    appointments.map((appointment) => (
                      <div key={appointment.id} className="appointment-card mb-3">
                        <div className="row align-items-center">
                          <div className="col-md-3">
                            <div className="appointment-date">
                              <i className="fas fa-calendar text-primary me-2"></i>
                              {new Date(appointment.appointmentDate).toLocaleDateString()}
                            </div>
                            <div className="appointment-time">
                              <i className="fas fa-clock text-info me-2"></i>
                              {appointment.appointmentTime}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <h5 className="mb-1">Dr. {appointment.doctorName}</h5>
                            <p className="text-muted mb-1">{appointment.reason}</p>
                          </div>
                          <div className="col-md-3 text-end">
                            <span className={`badge ${appointment.status === 'confirmed' ? 'bg-success' :
                              appointment.status === 'cancelled' ? 'bg-danger' : 'bg-warning'
                              }`}>
                              {appointment.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showAppointmentForm) {
    return (
      <div className="appointment-form-container">
        <div className="container-fluid h-100">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-md-6 col-lg-5">
              <div className="appointment-form-card">
                <div className="text-center mb-4">
                  <button
                    className="back-btn"
                    onClick={() => setShowAppointmentForm(false)}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Dashboard
                  </button>
                  <h2>Book Appointment</h2>
                  <p className="text-muted">Schedule your medical consultation</p>
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
                          <small className="text-muted">Appointment booking is temporarily disabled. Please try again tomorrow.</small>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleAppointmentSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Doctor Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="fas fa-user-md text-muted"></i>
                      </span>
                      <select
                        className="form-control border-start-0 ps-0"
                        name="doctorName"
                        value={appointmentData.doctorName}
                        onChange={handleAppointmentChange}
                        disabled={isHoliday}
                        required
                      >
                        <option value="">Select Doctor</option>
                        <option value="Dr. Smith">Dr. Smith</option>
                        <option value="Dr. Johnson">Dr. Johnson</option>
                        <option value="Dr. Williams">Dr. Williams</option>
                        <option value="Dr. Brown">Dr. Brown</option>
                        <option value="Dr. Davis">Dr. Davis</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Appointment Date</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="fas fa-calendar text-muted"></i>
                      </span>
                      <input
                        type="date"
                        className="form-control border-start-0 ps-0"
                        name="appointmentDate"
                        value={appointmentData.appointmentDate}
                        onChange={handleAppointmentChange}
                        min={new Date().toISOString().split('T')[0]}
                        disabled={isHoliday}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Appointment Time</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="fas fa-clock text-muted"></i>
                      </span>
                      <select
                        className="form-control border-start-0 ps-0"
                        name="appointmentTime"
                        value={appointmentData.appointmentTime}
                        onChange={handleAppointmentChange}
                        disabled={isHoliday}
                        required
                      >
                        <option value="">Select time</option>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="03:00 PM">03:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                        <option value="05:00 PM">05:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Reason for Visit</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="fas fa-notes-medical text-muted"></i>
                      </span>
                      <textarea
                        className="form-control border-start-0 ps-0"
                        name="reason"
                        value={appointmentData.reason}
                        onChange={handleAppointmentChange}
                        placeholder="Describe your symptoms or reason for visit"
                        rows="3"
                        disabled={isHoliday}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 py-3" disabled={isHoliday}>
                    <i className="fas fa-calendar-plus me-2"></i>
                    {isHoliday ? 'Booking Closed - Holiday' : 'Book Appointment'}
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
                  <a className="nav-link" href="#" onClick={() => setShowAppointmentForm(true)}>
                    <i className="fas fa-calendar-plus me-2"></i>
                    Book Appointment
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link" href="#" onClick={fetchAppointments}>
                    <i className="fas fa-calendar-check me-2"></i>
                    View Appointments
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link" href="#" onClick={() => setShowMedicalRecords(true)}>
                    <i className="fas fa-file-medical me-2"></i>
                    Medical Records
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link" href="#" onClick={() => setShowUploadDocument(true)}>
                    <i className="fas fa-cloud-upload-alt me-2"></i>
                    Upload Document
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
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => setShowAppointmentForm(true)}
                      >
                        <i className="fas fa-calendar-plus me-2"></i>
                        Book Appointment
                      </button>
                    </div>
                    <div className="col-md-3 mb-3">
                      <button
                        className="btn btn-success w-100"
                        onClick={fetchAppointments}
                      >
                        <i className="fas fa-calendar-check me-2"></i>
                        View Appointments
                      </button>
                    </div>
                    <div className="col-md-3 mb-3">
                      <button 
                        className="btn btn-warning w-100"
                        onClick={() => setShowMedicalRecords(true)}
                      >
                        <i className="fas fa-file-medical me-2"></i>
                        Medical Records
                      </button>
                    </div>
                    <div className="col-md-3 mb-3">
                      <button 
                        className="btn btn-secondary w-100"
                        onClick={() => setShowUploadDocument(true)}
                      >
                        <i className="fas fa-cloud-upload-alt me-2"></i>
                        Upload Document
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