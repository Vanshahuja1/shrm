const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const { authorizeEmployeeAccess, authorizeHRAccess, authorizeManagerAccess } = require("../middleware/authorization")
const router = express.Router()
const {
  getAllPerformanceScores,
  getPerformanceScoreByEmployee,
  getPerformanceScoreById,
  createPerformanceScore,
  updatePerformanceScore,
  addManagerEvaluation,
  addSelfAssessment,
  calculateIncrementEligibility,
  getPerformanceAnalytics,
  deletePerformanceScore,
  getPerformanceScoreByManager
} = require("../controllers/performanceScoreController")

// Apply authentication to all performance score routes
router.use(authenticateToken)

// Basic CRUD routes
router.get("/", authorizeHRAccess, getAllPerformanceScores)
router.get("/analytics", authorizeManagerAccess, getPerformanceAnalytics)
router.get("/employee/:employeeId", authorizeEmployeeAccess, getPerformanceScoreByEmployee)
router.get("/:id", authorizeManagerAccess, getPerformanceScoreById)
router.post("/", authorizeManagerAccess, createPerformanceScore)
router.put("/:id", authorizeManagerAccess, updatePerformanceScore)
router.delete("/:id", authorizeHRAccess, deletePerformanceScore)

router.get("/manager/:managerId", getPerformanceScoreByManager)

// Evaluation routes
router.post("/:id/manager-evaluation", addManagerEvaluation)
router.post("/:id/self-assessment", addSelfAssessment)

// Calculation routes
router.post("/:id/calculate-increment", calculateIncrementEligibility)

module.exports = router
