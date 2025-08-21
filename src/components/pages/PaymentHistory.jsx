import React, { useState, useEffect } from 'react';

const PaymentHistory = ({ onBack, patientData }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/auth/patient-payments/${patientData.id}`);
      const result = await response.json();
      
      if (result.success) {
        setPayments(result.payments);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="payment-history-container">
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-10 col-lg-8">
            <div className="payment-history-card">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3><i className="fas fa-history me-2"></i>Payment History</h3>
                  <p className="text-muted mb-0">Your payment transactions ({payments.length})</p>
                </div>
                <button className="btn btn-outline-secondary" onClick={onBack}>
                  <i className="fas fa-arrow-left me-2"></i>Back to Dashboard
                </button>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <i className="fas fa-spinner fa-spin fa-2x text-primary mb-3"></i>
                  <p>Loading payment history...</p>
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-receipt fa-3x text-muted mb-3"></i>
                  <h5>No Payment History</h5>
                  <p className="text-muted">You haven't made any payments yet.</p>
                </div>
              ) : (
                <div className="payments-list">
                  {payments.map((payment) => (
                    <div key={payment.id} className="payment-card mb-3">
                      <div className="card">
                        <div className="card-body">
                          <div className="row align-items-center">
                            <div className="col-md-2 text-center">
                              <div className="payment-icon">
                                <i className={`fas fa-check-circle fa-2x ${
                                  payment.status === 'completed' ? 'text-success' : 
                                  payment.status === 'failed' ? 'text-danger' : 'text-warning'
                                }`}></i>
                              </div>
                            </div>
                            <div className="col-md-8">
                              <h5 className="mb-1">Dr. {payment.doctorName}</h5>
                              <p className="text-muted mb-1">
                                <i className="fas fa-calendar me-2"></i>
                                {formatDate(payment.paymentDate)}
                              </p>
                              <p className="text-muted mb-1">
                                <i className={`${payment.paymentMethod === 'paypal' ? 'fab fa-paypal' : payment.paymentMethod === 'upi' ? 'fas fa-mobile-alt' : 'fas fa-credit-card'} me-2`}></i>
                                {payment.paymentMethod === 'paypal' ? 'PayPal' : payment.paymentMethod === 'upi' ? 'UPI' : 'Card'} - ID: {payment.transactionId}
                              </p>
                              {payment.upiId && (
                                <p className="text-muted mb-1">
                                  <i className="fas fa-at me-2"></i>
                                  UPI: {payment.upiId} | Phone: {payment.phoneNumber}
                                </p>
                              )}
                              {payment.payerEmail && (
                                <p className="text-muted mb-1">
                                  <i className="fas fa-envelope me-2"></i>
                                  {payment.payerName} ({payment.payerEmail})
                                </p>
                              )}
                              {payment.appointment && (
                                <p className="text-muted mb-0">
                                  <i className="fas fa-stethoscope me-2"></i>
                                  {payment.appointment.reason}
                                </p>
                              )}
                            </div>
                            <div className="col-md-2 text-end">
                              <div className="payment-amount">
                                <h4 className="text-success mb-1">${parseFloat(payment.amount).toFixed(2)}</h4>
                                <span className={`badge ${
                                  payment.status === 'completed' ? 'bg-success' : 
                                  payment.status === 'failed' ? 'bg-danger' : 'bg-warning'
                                }`}>
                                  {payment.status.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Payment Summary */}
                  <div className="payment-summary mt-4">
                    <div className="card bg-light">
                      <div className="card-body">
                        <div className="row text-center">
                          <div className="col-md-4">
                            <h4 className="text-primary">{payments.length}</h4>
                            <p className="text-muted mb-0">Total Payments</p>
                          </div>
                          <div className="col-md-4">
                            <h4 className="text-success">
                              ${payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0).toFixed(2)}
                            </h4>
                            <p className="text-muted mb-0">Total Amount</p>
                          </div>
                          <div className="col-md-4">
                            <h4 className="text-info">
                              {payments.filter(p => p.status === 'completed').length}
                            </h4>
                            <p className="text-muted mb-0">Successful</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;