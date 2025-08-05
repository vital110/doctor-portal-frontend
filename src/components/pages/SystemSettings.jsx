import React, { useState, useEffect } from 'react';

const SystemSettings = ({ onBack }) => {
  const [workingHours, setWorkingHours] = useState({
    monday: { start: '09:00', end: '17:00', isOpen: true },
    tuesday: { start: '09:00', end: '17:00', isOpen: true },
    wednesday: { start: '09:00', end: '17:00', isOpen: true },
    thursday: { start: '09:00', end: '17:00', isOpen: true },
    friday: { start: '09:00', end: '17:00', isOpen: true },
    saturday: { start: '09:00', end: '13:00', isOpen: true },
    sunday: { start: '09:00', end: '17:00', isOpen: false }
  });
  
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState({ date: '', reason: '' });
  const [doctorLeaves, setDoctorLeaves] = useState([]);
  const [newLeave, setNewLeave] = useState({ doctorName: '', leaveDate: '', reason: '' });
  
  const doctors = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis'];

  useEffect(() => {
    fetchSettings();
    fetchHolidays();
    fetchDoctorLeaves();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/clinic-settings');
      const result = await response.json();
      if (result.success && result.settings.working_hours) {
        setWorkingHours(JSON.parse(result.settings.working_hours));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchHolidays = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/holidays');
      const result = await response.json();
      if (result.success) {
        setHolidays(result.holidays);
      }
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };

  const handleWorkingHoursChange = (day, field, value) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const saveWorkingHours = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/clinic-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workingHours })
      });
      
      const result = await response.json();
      if (result.success) {
        alert('Working hours updated successfully!');
      }
    } catch (error) {
      alert('Error updating working hours');
    }
  };

  const addHoliday = async () => {
    if (!newHoliday.date || !newHoliday.reason) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/holidays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHoliday)
      });
      
      const result = await response.json();
      if (result.success) {
        setNewHoliday({ date: '', reason: '' });
        fetchHolidays();
        alert('Holiday added successfully!');
      }
    } catch (error) {
      alert('Error adding holiday');
    }
  };

  const removeHoliday = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/auth/holidays/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        fetchHolidays();
        alert('Holiday removed successfully!');
      }
    } catch (error) {
      alert('Error removing holiday');
    }
  };

  const fetchDoctorLeaves = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/doctor-leaves');
      const result = await response.json();
      if (result.success) {
        setDoctorLeaves(result.leaves);
      }
    } catch (error) {
      console.error('Error fetching doctor leaves:', error);
    }
  };

  const addDoctorLeave = async () => {
    if (!newLeave.doctorName || !newLeave.leaveDate || !newLeave.reason) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/doctor-leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLeave)
      });
      
      const result = await response.json();
      if (result.success) {
        setNewLeave({ doctorName: '', leaveDate: '', reason: '' });
        fetchDoctorLeaves();
        alert('Doctor leave added successfully!');
      }
    } catch (error) {
      alert('Error adding doctor leave');
    }
  };

  const removeDoctorLeave = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/auth/doctor-leaves/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        fetchDoctorLeaves();
        alert('Doctor leave removed successfully!');
      }
    } catch (error) {
      alert('Error removing doctor leave');
    }
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2><i className="fas fa-cog me-2"></i>System Settings</h2>
            <button className="btn btn-secondary" onClick={onBack}>
              <i className="fas fa-arrow-left me-2"></i>Back to Dashboard
            </button>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-header">
                  <h5><i className="fas fa-clock me-2"></i>Working Hours</h5>
                </div>
                <div className="card-body">
                  {days.map(day => (
                    <div key={day} className="row mb-3 align-items-center">
                      <div className="col-md-2">
                        <label className="form-label text-capitalize fw-bold">{day}</label>
                      </div>
                      <div className="col-md-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={workingHours[day].isOpen}
                            onChange={(e) => handleWorkingHoursChange(day, 'isOpen', e.target.checked)}
                          />
                          <label className="form-check-label">Open</label>
                        </div>
                      </div>
                      {workingHours[day].isOpen && (
                        <>
                          <div className="col-md-3">
                            <input
                              type="time"
                              className="form-control"
                              value={workingHours[day].start}
                              onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                            />
                          </div>
                          <div className="col-md-1 text-center">to</div>
                          <div className="col-md-3">
                            <input
                              type="time"
                              className="form-control"
                              value={workingHours[day].end}
                              onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  <button className="btn btn-success" onClick={saveWorkingHours}>
                    <i className="fas fa-save me-2"></i>Save Working Hours
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card mb-4">
                <div className="card-header">
                  <h5><i className="fas fa-calendar-times me-2"></i>Holidays</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newHoliday.date}
                      onChange={(e) => setNewHoliday({...newHoliday, date: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Holiday reason"
                      value={newHoliday.reason}
                      onChange={(e) => setNewHoliday({...newHoliday, reason: e.target.value})}
                    />
                  </div>
                  <button className="btn btn-primary w-100 mb-3" onClick={addHoliday}>
                    <i className="fas fa-plus me-2"></i>Add Holiday
                  </button>

                  <div className="holiday-list" style={{maxHeight: '200px', overflowY: 'auto'}}>
                    {holidays.map(holiday => (
                      <div key={holiday.id} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                        <div>
                          <strong>{new Date(holiday.date).toLocaleDateString()}</strong>
                          <br />
                          <small>{holiday.reason}</small>
                        </div>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => removeHoliday(holiday.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card">
                <div className="card-header">
                  <h5><i className="fas fa-user-md me-2"></i>Doctor Leaves</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Doctor</label>
                    <select
                      className="form-control"
                      value={newLeave.doctorName}
                      onChange={(e) => setNewLeave({...newLeave, doctorName: e.target.value})}
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map(doctor => (
                        <option key={doctor} value={doctor}>{doctor}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Leave Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newLeave.leaveDate}
                      onChange={(e) => setNewLeave({...newLeave, leaveDate: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Leave reason"
                      value={newLeave.reason}
                      onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                    />
                  </div>
                  <button className="btn btn-warning w-100 mb-3" onClick={addDoctorLeave}>
                    <i className="fas fa-plus me-2"></i>Add Leave
                  </button>

                  <div className="leave-list" style={{maxHeight: '200px', overflowY: 'auto'}}>
                    {doctorLeaves.map(leave => (
                      <div key={leave.id} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                        <div>
                          <strong>{leave.doctorName}</strong>
                          <br />
                          <small>{new Date(leave.leaveDate).toLocaleDateString()}</small>
                          <br />
                          <small className="text-muted">{leave.reason}</small>
                        </div>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => removeDoctorLeave(leave.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
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

export default SystemSettings;