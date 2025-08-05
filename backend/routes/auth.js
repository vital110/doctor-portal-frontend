const express = require('express');
const bcrypt = require('bcryptjs');
const { Admin } = require('../models');
const router = express.Router();

// Register new admin
router.post('/register-admin', async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        // Validation
        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create admin in database
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
        console.log('Login attempt for:', email);

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find admin in database
        const admin = await Admin.findOne({ where: { email } });
        console.log('Admin found:', admin ? 'Yes' : 'No');

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        console.log('Comparing passwords...');
        const isValidPassword = await bcrypt.compare(password, admin.password);
        console.log('Password valid:', isValidPassword);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        console.log('Login successful for:', admin.fullName);
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

module.exports = router;