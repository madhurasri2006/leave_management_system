
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Employee Registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, department, password } = req.body;

        if (!name || !email || !department || !password) {
            return res.status(400).json({
                message: 'Please fill in all fields'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must contain at least 8 characters'
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await User.create({
            name,
            email: email.toLowerCase(),
            department,
            password: hashedPassword,
            role: 'employee'
        });

        res.status(201).json({
            message: 'Registration successful. Please login.'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Employee Login
router.post('/employee-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email: email?.toLowerCase()
        }).select('+password');

        if (!user || !(await bcrypt.compare(password || '', user.password))) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        if (user.role !== 'employee') {
            return res.status(403).json({
                message: 'Employee access only'
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token,
            role: user.role,
            name: user.name
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin Login
router.post('/admin-login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const hash = process.env.ADMIN_PASSWORD_HASH;

        const validUsername =
            username === process.env.ADMIN_USERNAME;

        const validPassword = hash
            ? await bcrypt.compare(password || '', hash)
            : false;

        if (!validUsername || !validPassword) {
            return res.status(401).json({
                message: 'Invalid admin credentials'
            });
        }

        const token = jwt.sign(
            {
                id: 'admin',
                role: 'admin'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Admin login successful',
            token,
            role: 'admin',
            name: 'Administrator'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
