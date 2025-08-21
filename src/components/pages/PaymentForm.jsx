import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import './PaymentForm.css';

const PaymentForm = ({ onBack, patientData, appointmentData }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    paymentMethod: 'card'
  });
  const [upiData, setUpiData] = useState({
    upiId: '',
    phoneNumber: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctorFee, setDoctorFee] = useState(0);

  const doctors = [
    { name: 'Dr. Smith', fee: 200, specialty: 'Cardiologist' },
    { name: 'Dr. Johnson', fee: 180, specialty: 'Neurologist' },
    { name: 'Dr. Williams', fee: 150, specialty: 'General Physician' },
    { name: 'Dr. Brown', fee: 220, specialty: 'Orthopedic' },
    { name: 'Dr. Davis', fee: 190, specialty: 'Dermatologist' }
  ];

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (value.length > 19) value = value.substr(0, 19);
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (value.length > 5) value = value.substr(0, 5);
    }
    
    // Format CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 3) value = value.substr(0, 3);
    }

    setPaymentData({
      ...paymentData,
      [name]: value
    });
  };

  const handleUpiInputChange = (e) => {
    const { name, value } = e.target;
    setUpiData({
      ...upiData,
      [name]: value
    });
  };

  const handleDoctorChange = (e) => {
    const doctorName = e.target.value;
    const doctor = doctors.find(d => d.name === doctorName);
    setSelectedDoctor(doctorName);
    setDoctorFee(doctor ? doctor.fee : 0);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patientData.id,
          appointmentId: appointmentData?.appointmentId || appointmentData?.id,
          doctorName: selectedDoctor,
          amount: doctorFee,
          paymentMethod: paymentData.paymentMethod,
          cardDetails: {
            cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
            expiryDate: paymentData.expiryDate,
            cvv: paymentData.cvv,
            cardholderName: paymentData.cardholderName
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(`Payment successful! Transaction ID: ${result.payment.transactionId}`);
        onBack();
      } else {
        alert(result.message || 'Payment failed');
      }
    } catch (error) {
      alert('Payment error: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalSuccess = async (details, data) => {
    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patientData.id,
          appointmentId: appointmentData?.appointmentId || appointmentData?.id,
          doctorName: appointmentData?.doctorName || 'General Consultation',
          amount: doctorFee,
          paymentMethod: 'paypal',
          transactionId: details.id,
          paypalDetails: details
        })
      });

      const result = await response.json();
      if (result.success) {
        alert(`PayPal payment successful! Transaction ID: ${details.id}`);
        onBack();
      } else {
        alert(result.message || 'Payment failed');
      }
    } catch (error) {
      alert('Payment error: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpiPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patientData.id,
          appointmentId: appointmentData?.appointmentId || appointmentData?.id,
          doctorName: selectedDoctor,
          amount: doctorFee,
          paymentMethod: 'upi',
          upiDetails: {
            upiId: upiData.upiId,
            phoneNumber: upiData.phoneNumber
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(`UPI payment successful! Transaction ID: ${result.payment.transactionId}`);
        onBack();
      } else {
        alert(result.message || 'UPI payment failed');
      }
    } catch (error) {
      alert('Payment error: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-form-container">
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-6 col-lg-5">
            <div className="payment-form-card">
              <div className="text-center mb-4">
                <button
                  className="back-btn"
                  onClick={onBack}
                  disabled={isProcessing}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Dashboard
                </button>
                <h2><i className="fas fa-credit-card me-2"></i>Pay Doctor Fee</h2>
                <p className="text-muted">Secure online payment for medical consultation</p>
              </div>

              {/* Doctor Selection */}
              <div className="doctor-selection mb-4">
                <label className="form-label fw-semibold">Select Doctor *</label>
                <select
                  className="form-control"
                  value={selectedDoctor}
                  onChange={handleDoctorChange}
                  required
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.name} value={doctor.name}>
                      {doctor.name} - {doctor.specialty} (${doctor.fee})
                    </option>
                  ))}
                </select>
                {doctorFee > 0 && (
                  <div className="mt-2 text-center">
                    <span className="badge bg-primary fs-6">Consultation Fee: ${doctorFee}</span>
                  </div>
                )}
              </div>

              {/* Payment Method Selection */}
              <div className="payment-method-selection mb-4">
                <h5 className="mb-3">Select Payment Method</h5>
                <div className="row">
                  <div className="col-md-4 mb-2">
                    <div 
                      className={`payment-method-card ${selectedPaymentMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setSelectedPaymentMethod('card')}
                    >
                      <i className="fas fa-credit-card me-2"></i>
                      Credit/Debit Card
                    </div>
                  </div>
                  <div className="col-md-4 mb-2">
                    <div 
                      className={`payment-method-card ${selectedPaymentMethod === 'paypal' ? 'active' : ''}`}
                      onClick={() => setSelectedPaymentMethod('paypal')}
                    >
                      <i className="fab fa-paypal me-2"></i>
                      PayPal
                    </div>
                  </div>
                  <div className="col-md-4 mb-2">
                    <div 
                      className={`payment-method-card ${selectedPaymentMethod === 'upi' ? 'active' : ''}`}
                      onClick={() => setSelectedPaymentMethod('upi')}
                    >
                      <i className="fas fa-mobile-alt me-2"></i>
                      UPI Payment
                    </div>
                  </div>
                </div>
              </div>

              {selectedPaymentMethod === 'card' && (
                <form onSubmit={handlePaymentSubmit}>
                  <div className="mb-3">
                  <label className="form-label fw-semibold">Cardholder Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cardholderName"
                    value={paymentData.cardholderName}
                    onChange={handleInputChange}
                    placeholder="Enter cardholder name"
                    required
                    disabled={isProcessing}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Card Number *</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-credit-card"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Expiry Date *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">CVV *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div className="security-info mb-4">
                  <div className="alert alert-info">
                    <i className="fas fa-shield-alt me-2"></i>
                    <small>Your payment information is secure and encrypted. We do not store your card details.</small>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-success w-100 py-3" 
                  disabled={isProcessing || !selectedDoctor}
                >
                  {isProcessing ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-lock me-2"></i>
                      Pay ${doctorFee} Securely
                    </>
                  )}
                </button>
                </form>
              )}

              {selectedPaymentMethod === 'paypal' && (
                <PayPalScriptProvider options={{
                  "client-id": "AWs4gSxj2JfYeLM01u0MvhCRALxHAkr_FMQbj9iY5VkiXpBxaUyPQTwvOdPKhXY8BFFYXaYYlJ6EP2EQ",
                  currency: "USD"
                }}>
                  <div className="paypal-container">
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [{
                            amount: {
                              value: doctorFee.toString()
                            },
                            description: `Doctor consultation fee - ${appointmentData?.doctorName || 'General Consultation'}`,
                            custom_id: `patient_${patientData.id}_appointment_${appointmentData?.id || 'general'}`
                          }]
                        });
                      }}
                      onApprove={async (data, actions) => {
                        setIsProcessing(true);
                        try {
                          const order = await actions.order.capture();
                          
                          const response = await fetch('http://localhost:3001/api/auth/process-payment', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              patientId: patientData.id,
                              appointmentId: appointmentData?.appointmentId || appointmentData?.id,
                              doctorName: selectedDoctor,
                              amount: doctorFee,
                              paymentMethod: 'paypal',
                              paypalOrderId: data.orderID
                            })
                          });

                          const result = await response.json();
                          if (result.success) {
                            alert(`PayPal payment successful! Transaction ID: ${result.payment.transactionId}`);
                            onBack();
                          } else {
                            alert(result.message || 'Payment verification failed');
                          }
                        } catch (error) {
                          alert('Payment error: ' + error.message);
                        } finally {
                          setIsProcessing(false);
                        }
                      }}
                      onError={(err) => {
                        console.error('PayPal error:', err);
                        alert('PayPal payment failed. Please try again.');
                        setIsProcessing(false);
                      }}
                    />
                  </div>
                </PayPalScriptProvider>
              )}

              {selectedPaymentMethod === 'upi' && (
                <form onSubmit={handleUpiPayment}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">UPI ID *</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-at"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="upiId"
                        value={upiData.upiId}
                        onChange={handleUpiInputChange}
                        placeholder="yourname@paytm / yourname@gpay"
                        required
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="form-text">Enter your UPI ID (e.g., 9876543210@paytm)</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Phone Number *</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-phone"></i>
                      </span>
                      <input
                        type="tel"
                        className="form-control"
                        name="phoneNumber"
                        value={upiData.phoneNumber}
                        onChange={handleUpiInputChange}
                        placeholder="Enter 10-digit mobile number"
                        pattern="[0-9]{10}"
                        maxLength="10"
                        required
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="form-text">Enter your registered mobile number</div>
                  </div>

                  <div className="upi-info mb-4">
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      <small>You will receive a payment request on your UPI app. Please approve to complete the payment.</small>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-3" 
                    disabled={isProcessing || !selectedDoctor}
                  >
                    {isProcessing ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Processing UPI Payment...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-mobile-alt me-2"></i>
                        Pay ₹{doctorFee} via UPI
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="payment-methods mt-4 text-center">
                <small className="text-muted">We accept:</small>
                <div className="mt-2">
                  <i className="fab fa-cc-visa fa-2x me-2 text-primary"></i>
                  <i className="fab fa-cc-mastercard fa-2x me-2 text-warning"></i>
                  <i className="fab fa-cc-amex fa-2x me-2 text-info"></i>
                  <i className="fab fa-cc-discover fa-2x text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;