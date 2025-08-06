import React, { useState, useEffect } from 'react';

const UploadMedicalRecord = ({ onBack, adminData }) => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    recordType: '',
    title: '',
    description: '',
    file: null
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/all-patients');
      const result = await response.json();
      
      if (result.success) {
        setPatients(result.patients);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'file') {
      setFormData({
        ...formData,
        file: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.recordType || !formData.title || !formData.file) {
      alert('Please fill all required fields and select a PDF file');
      return;
    }

    if (formData.file.type !== 'application/pdf') {
      alert('Please select a PDF file only');
      return;
    }

    setUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('medicalFile', formData.file);
      uploadData.append('patientId', formData.patientId);
      uploadData.append('recordType', formData.recordType);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('uploadedBy', adminData?.fullName || 'Admin');

      const response = await fetch('http://localhost:3001/api/auth/upload-medical-record', {
        method: 'POST',
        body: uploadData
      });

      const result = await response.json();

      if (result.success) {
        alert('Medical record uploaded successfully!');
        setFormData({
          patientId: '',
          recordType: '',
          title: '',
          description: '',
          file: null
        });
        // Reset file input
        document.getElementById('fileInput').value = '';
      } else {
        alert(result.message || 'Upload failed');
      }
    } catch (error) {
      alert('Error uploading file: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-medical-record-container">
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-8 col-lg-6">
            <div className="upload-form-card">
              <div className="text-center mb-4">
                <button className="btn btn-link text-muted p-0 mb-3" onClick={onBack}>
                  <i className="fas fa-arrow-left me-2"></i>Back to Dashboard
                </button>
                <h2><i className="fas fa-cloud-upload-alt me-2"></i>Upload Medical Record</h2>
                <p className="text-muted">Upload patient medical documents (PDF only)</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Select Patient *</label>
                  <select
                    className="form-control"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.fullName} ({patient.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Record Type *</label>
                  <select
                    className="form-control"
                    name="recordType"
                    value={formData.recordType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="prescription">Prescription</option>
                    <option value="test_report">Test Report</option>
                    <option value="diagnosis">Diagnosis</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Blood Test Report, X-Ray Results"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Additional notes or description (optional)"
                    rows="3"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">PDF File *</label>
                  <input
                    type="file"
                    className="form-control"
                    id="fileInput"
                    name="file"
                    accept=".pdf"
                    onChange={handleChange}
                    required
                  />
                  <small className="text-muted">Only PDF files are allowed (Max: 10MB)</small>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-3"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-upload me-2"></i>
                      Upload Medical Record
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMedicalRecord;