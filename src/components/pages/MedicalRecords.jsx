import React, { useState, useEffect } from 'react';

const MedicalRecords = ({ onBack, patientData }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPdfPopup, setShowPdfPopup] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/auth/patient-medical-records/${patientData.id}`);
      const result = await response.json();
      
      if (result.success) {
        setRecords(result.records);
      }
    } catch (error) {
      console.error('Error fetching medical records:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewRecord = (recordId) => {
    const viewUrl = `http://localhost:3001/api/auth/view-medical-record/${recordId}`;
    setCurrentPdfUrl(viewUrl);
    setShowPdfPopup(true);
  };

  const closePdfPopup = () => {
    setShowPdfPopup(false);
    setCurrentPdfUrl('');
  };

  const downloadRecord = async (recordId, fileName) => {
    try {
      const response = await fetch(`http://localhost:3001/api/auth/download-medical-record/${recordId}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Error downloading file');
      }
    } catch (error) {
      alert('Error downloading file: ' + error.message);
    }
  };

  const getRecordTypeIcon = (type) => {
    switch (type) {
      case 'prescription': return 'fas fa-prescription-bottle-alt';
      case 'test_report': return 'fas fa-file-medical-alt';
      case 'diagnosis': return 'fas fa-stethoscope';
      default: return 'fas fa-file-pdf';
    }
  };

  const getRecordTypeColor = (type) => {
    switch (type) {
      case 'prescription': return 'text-success';
      case 'test_report': return 'text-info';
      case 'diagnosis': return 'text-warning';
      default: return 'text-primary';
    }
  };

  return (
    <div className="medical-records-container">
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-10 col-lg-8">
            <div className="medical-records-card">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3><i className="fas fa-file-medical me-2"></i>Medical Records</h3>
                  <p className="text-muted mb-0">Patient: {patientData?.fullName}</p>
                </div>
                <button className="btn btn-outline-secondary" onClick={onBack}>
                  <i className="fas fa-arrow-left me-2"></i>Back to Dashboard
                </button>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading medical records...</p>
                </div>
              ) : records.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-file-medical fa-3x text-muted mb-3"></i>
                  <h5>No Medical Records Found</h5>
                  <p className="text-muted">Your medical records will appear here once uploaded by your healthcare provider.</p>
                </div>
              ) : (
                <div className="records-list">
                  {records.map((record) => (
                    <div key={record.id} className="record-card mb-3 p-3 border rounded">
                      <div className="row align-items-center">
                        <div className="col-md-1">
                          <i className={`${getRecordTypeIcon(record.recordType)} fa-2x ${getRecordTypeColor(record.recordType)}`}></i>
                        </div>
                        <div className="col-md-7">
                          <h6 className="mb-1">{record.title}</h6>
                          <p className="text-muted mb-1 small">{record.description}</p>
                          <div className="d-flex gap-3 small text-muted">
                            <span><i className="fas fa-calendar me-1"></i>{new Date(record.createdAt).toLocaleDateString()}</span>
                            <span><i className="fas fa-user me-1"></i>Uploaded by: {record.uploadedBy}</span>
                            <span><i className="fas fa-tag me-1"></i>{record.recordType.replace('_', ' ').toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="col-md-2">
                          <small className="text-muted d-block">{record.fileName}</small>
                          <small className="text-muted">{(record.fileSize / 1024).toFixed(1)} KB</small>
                        </div>
                        <div className="col-md-2 text-end">
                          <div className="btn-group-vertical" role="group">
                            <button 
                              className="btn btn-outline-primary btn-sm mb-1"
                              onClick={() => viewRecord(record.id)}
                            >
                              <i className="fas fa-eye me-1"></i>View
                            </button>
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => downloadRecord(record.id, record.fileName)}
                            >
                              <i className="fas fa-download me-1"></i>Download
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

      {/* PDF Popup Modal */}
      {showPdfPopup && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content" style={{ height: '90vh' }}>
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-file-pdf me-2"></i>
                  Medical Report Viewer
                </h5>
                <button type="button" className="btn-close" onClick={closePdfPopup}></button>
              </div>
              <div className="modal-body p-0" style={{ height: 'calc(90vh - 120px)' }}>
                <iframe
                  src={currentPdfUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  title="Medical Report"
                >
                  <p>Your browser does not support PDFs. <a href={currentPdfUrl} target="_blank" rel="noopener noreferrer">Download the PDF</a>.</p>
                </iframe>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;