const Joi = require('joi');

// Admin registration validation
const adminRegistrationSchema = Joi.object({
  fullName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Full name is required',
    'string.min': 'Full name must be at least 2 characters long',
    'string.max': 'Full name cannot exceed 50 characters'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long'
  }),
  role: Joi.string().valid('admin', 'super_admin').required().messages({
    'string.empty': 'Role is required',
    'any.only': 'Role must be either admin or super_admin'
  })
});

// Patient registration validation
const patientRegistrationSchema = Joi.object({
  fullName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Full name is required',
    'string.min': 'Full name must be at least 2 characters long',
    'string.max': 'Full name cannot exceed 50 characters'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long'
  })
});

// Login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required'
  })
});

// Appointment booking validation
const appointmentSchema = Joi.object({
  patientId: Joi.number().integer().positive().required().messages({
    'number.base': 'Patient ID must be a number',
    'number.positive': 'Patient ID must be positive',
    'any.required': 'Patient ID is required'
  }),
  doctorName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Doctor name is required',
    'string.min': 'Doctor name must be at least 2 characters long',
    'string.max': 'Doctor name cannot exceed 50 characters'
  }),
  appointmentDate: Joi.date().min(new Date().toISOString().split('T')[0]).required().messages({
    'date.base': 'Please provide a valid appointment date',
    'date.min': 'Appointment date cannot be in the past',
    'any.required': 'Appointment date is required'
  }),
  appointmentTime: Joi.string().required().messages({
    'string.empty': 'Appointment time is required'
  }),
  reason: Joi.string().min(5).max(500).required().messages({
    'string.empty': 'Reason for visit is required',
    'string.min': 'Reason must be at least 5 characters long',
    'string.max': 'Reason cannot exceed 500 characters'
  })
});

module.exports = {
  adminRegistrationSchema,
  patientRegistrationSchema,
  loginSchema,
  appointmentSchema
};