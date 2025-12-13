const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { authorizeAttendanceAccess, authorizeHRAccess } = require('../middleware/authorization');

const {getTodaysAttendance , getAttendanceByEmpId, getStats} = require('../controllers/attendanceController');

// Apply authentication to all attendance routes
router.use(authenticateToken);

// Route to get today's attendance for HR
router.get('/employee/stats/:id', authorizeAttendanceAccess, getStats);
router.get('/hr/:hrId', authorizeHRAccess, getTodaysAttendance);
router.get('/hr/employee/:id', authorizeAttendanceAccess, getAttendanceByEmpId);
module.exports = router;