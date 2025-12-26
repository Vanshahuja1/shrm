const express = require("express")
const router = express.Router()
const { authenticateToken } = require("../middleware/auth")
const { authorizeEmployeeAccess, authorizeAttendanceAccess } = require("../middleware/authorization")

// Import controllers
const employeeController = require("../controllers/employeeController")
const attendanceController = require("../controllers/attendanceController")
const performanceController = require("../controllers/performanceController")
const overtimeController = require("../controllers/overtimeController")
const workHoursController = require("../controllers/workHoursController")
const dataSyncController = require("../controllers/dataSyncController")
const settingsController = require("../controllers/settingsController")

// Apply authentication to all employee routes
router.use(authenticateToken)

// Employee basic info
router.get("/:id", authorizeEmployeeAccess, employeeController.getEmployeeInfo)

// Tasks
router.get("/:id/tasks", authorizeEmployeeAccess, employeeController.getEmployeeTasks)
router.post("/:id/tasks/:taskId/response", authorizeEmployeeAccess, employeeController.submitTaskResponse)

// Attendance
router.get("/:id/attendance", authorizeAttendanceAccess, attendanceController.getAttendanceRecords)
router.post("/:id/attendance", authorizeAttendanceAccess, attendanceController.punchIn)
router.post("/:id/attendance/punch-out", authorizeAttendanceAccess, attendanceController.punchOut)
router.post("/:id/attendance/breaks", authorizeAttendanceAccess, attendanceController.handleBreak)
router.get("/:id/attendance/breaks", authorizeAttendanceAccess, attendanceController.getTodayBreaks)

// Performance
router.get("/:id/performance", authorizeEmployeeAccess, performanceController.getPerformanceMetrics)

// Overtime
router.get("/:id/overtime", authorizeEmployeeAccess, overtimeController.getOvertimeRequests)
router.post("/:id/overtime", authorizeEmployeeAccess, overtimeController.submitOvertimeRequest)

// Work Hours
router.get("/:id/work-hours", authorizeEmployeeAccess, workHoursController.getWorkHours)
router.post("/:id/work-hours/test", authorizeEmployeeAccess, workHoursController.createTestWorkHours)

// Data Sync
router.get("/:id/data-sync", authorizeEmployeeAccess, dataSyncController.getDataSyncStatus)
router.post("/:id/data-sync/force", authorizeEmployeeAccess, dataSyncController.forceDataSync)

// Settings
router.get("/:id/settings", authorizeEmployeeAccess, settingsController.getEmployeeSettings)
router.put("/:id/settings", authorizeEmployeeAccess, settingsController.updateEmployeeSettings)

module.exports = router
