
const express = require('express');
const router = express.Router();

const Leave = require('../models/Leave');

const {
    authenticateToken,
    authorizeRole
} = require('../middleware/authMiddleware');

// Employee applies for leave
router.post(
    '/',
    authenticateToken,
    authorizeRole('employee'),
    async (req, res) => {
        try {
            const { leaveType, startDate, endDate, reason } = req.body;

            if (!leaveType || !startDate || !endDate || !reason) {
                return res.status(400).json({
                    message: 'Please fill in all fields'
                });
            }

            if (new Date(endDate) < new Date(startDate)) {
                return res.status(400).json({
                    message: 'End date cannot be before start date'
                });
            }

            const leave = await Leave.create({
                userId: req.user.id,
                name: req.user.name,
                email: req.user.email,
                leaveType,
                startDate,
                endDate,
                reason
            });

            res.status(201).json({
                message: 'Leave application submitted successfully',
                leave
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);

// Employee views their own leave applications
router.get(
    '/my-leaves',
    authenticateToken,
    authorizeRole('employee'),
    async (req, res) => {
        try {
            const leaves = await Leave.find({
                userId: req.user.id
            }).sort({ createdAt: -1 });

            res.json(leaves);

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);

// Admin views all leave applications
router.get(
    '/',
    authenticateToken,
    authorizeRole('admin'),
    async (req, res) => {
        try {
            const leaves = await Leave.find().sort({
                createdAt: -1
            });

            res.json(leaves);

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);

// Admin approves or rejects leave
router.patch(
    '/:id',
    authenticateToken,
    authorizeRole('admin'),
    async (req, res) => {
        try {
            const { status } = req.body;

            if (!['Approved', 'Rejected'].includes(status)) {
                return res.status(400).json({
                    message: 'Invalid leave status'
                });
            }

            const leave = await Leave.findByIdAndUpdate(
    req.params.id,
    { status },
    {
        returnDocument: 'after',
        runValidators: true
    }
);

            if (!leave) {
                return res.status(404).json({
                    message: 'Leave application not found'
                });
            }

            res.json({
                message: 'Leave status updated successfully',
                leave
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);

module.exports = router;
