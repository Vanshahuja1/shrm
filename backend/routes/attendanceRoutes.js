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

// Route for manager to get team attendance with pagination
router.get('/manager/:managerId/team', authorizeManagerTeamAccess, getManagerTeamAttendance);

module.exports = router;