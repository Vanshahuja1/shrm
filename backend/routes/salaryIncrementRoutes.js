const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const { authorizeEmployeeAccess, authorizeHRAccess, authorizeManagerAccess } = require("../middleware/authorization")
const router = express.Router()
const {
  getAllSalaryIncrements,
  getSalaryIncrementByEmployee,
  getSalaryIncrementById,
  calculateSalaryIncrement,
  bulkCalculateIncrements,
  updateSalaryIncrement,
  approveSalaryIncrement,
  getIncrementAnalytics,
  deleteSalaryIncrement
} = require("../controllers/salaryIncrementController")

// Apply authentication to all salary increment routes
router.use(authenticateToken)

// Basic CRUD routes
router.get("/", authorizeHRAccess, getAllSalaryIncrements)
router.get("/analytics", authorizeManagerAccess, getIncrementAnalytics)
router.get("/employee/:employeeId", authorizeEmployeeAccess, getSalaryIncrementByEmployee)
router.get("/:id", authorizeManagerAccess, getSalaryIncrementById)
router.post("/calculate/:employeeId", authorizeManagerAccess, calculateSalaryIncrement)
router.post("/bulk-calculate", authorizeHRAccess, bulkCalculateIncrements)
router.put("/:id", authorizeHRAccess, updateSalaryIncrement)
router.put("/:id/approve", authorizeHRAccess, approveSalaryIncrement)
router.delete("/:id", authorizeHRAccess, deleteSalaryIncrement)

// Basic CRUD routes
router.get("/", getAllSalaryIncrements)
router.get("/analytics", getIncrementAnalytics)
router.get("/employee/:employeeId", getSalaryIncrementByEmployee)
router.get("/:id", getSalaryIncrementById)
router.put("/:id", updateSalaryIncrement)
router.delete("/:id", deleteSalaryIncrement)

// Calculation routes
router.post("/calculate", calculateSalaryIncrement)
router.post("/bulk-calculate", bulkCalculateIncrements)

// Approval routes
router.post("/:id/approve", approveSalaryIncrement)

module.exports = router
