const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { 
  authorizeAttendanceAccess, 
  authorizeHRAccess, 
  authorizeManagerAccess,
  authorizeManagerTeamAccess 
} = require('../middleware/authorization');

const {
  getTodaysAttendance, 
  getAttendanceByEmpId, 
  getStats,
  getManagerTeamAttendance
} = require('../controllers/attendanceController');

// Apply authentication to all attendance routes
router.use(authenticateToken);

// Route to get today's attendance for HR
router.get('/employee/stats/:id', authorizeAttendanceAccess, getStats);
router.get('/hr/:hrId', authorizeHRAccess, getTodaysAttendance);
router.get('/hr/employee/:id', authorizeAttendanceAccess, getAttendanceByEmpId);

// Route for manager to get all employees attendance in their organization with pagination
// Uses authenticated user's organization from JWT token
router.get('/manager/team', authorizeManagerTeamAccess, getManagerTeamAttendance);

module.exports = router;