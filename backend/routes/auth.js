const express = require('express');
const bcrypt = require('bcryptjs');
const { Admin, Patient, Appointment } = require('../models');
const router = express.Router();

// Register new admin
router.post('/register-admin', async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      fullName,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ 
      success: true,
      message: 'Admin registered successfully',
      admin: {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration', 
      error: error.message 
    });
  }
});

// Login admin
router.post('/login-admin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login', 
      error: error.message 
    });
  }
});

// Register patient
router.post('/register-patient', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingPatient = await Patient.findOne({ where: { email } });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const patient = await Patient.create({
      fullName,
      email,
      password: hashedPassword
    });

    res.status(201).json({ 
      success: true,
      message: 'Patient registered successfully',
      patient: {
        id: patient.id,
        fullName: patient.fullName,
        email: patient.email
      }
    });
  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration', 
      error: error.message 
    });
  }
});

// Login patient
router.post('/login-patient', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const patient = await Patient.findOne({ where: { email } });
    if (!patient) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    const isValidPassword = await bcrypt.compare(password, patient.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      patient: {
        id: patient.id,
        fullName: patient.fullName,
        email: patient.email
      }
    });
  } catch (error) {
    console.error('Patient login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login', 
      error: error.message 
    });
  }
});

// Book appointment
router.post('/book-appointment', async (req, res) => {
  try {
    const { patientId, doctorName, appointmentDate, appointmentTime, reason } = req.body;

    if (!patientId || !doctorName || !appointmentDate || !appointmentTime || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorName,
      appointmentDate,
      appointmentTime,
      reason,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: {
        id: appointment.id,
        doctorName: appointment.doctorName,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        reason: appointment.reason,
        status: appointment.status
      }
    });
  } catch (error) {
    console.error('Appointment booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during booking',
      error: error.message
    });
  }
});

// Get patient appointments
router.get('/patient-appointments/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    const appointments = await Appointment.findAll({
      where: { patientId },
      order: [['appointmentDate', 'DESC']]
    });

    res.json({
      success: true,
      appointments: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
});

// Get admin count
router.get('/admin-count', async (req, res) => {
  try {
    const count = await Admin.count();
    res.json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('Error fetching admin count:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin count',
      error: error.message
    });
  }
});

// Get admin list
router.get('/admin-list', async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: ['id', 'fullName', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      admins: admins
    });
  } catch (error) {
    console.error('Error fetching admin list:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin list',
      error: error.message
    });
  }
});

module.exports = router;