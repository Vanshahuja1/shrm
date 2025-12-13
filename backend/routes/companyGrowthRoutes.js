const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const router = express.Router()
const {
  getAllCompanyGrowth,
  getCompanyGrowthByPeriod,
  getCompanyGrowthById,
  createCompanyGrowth,
  updateCompanyGrowth,
  calculateGrowthMetrics,
  getGrowthTrend,
  getCurrentGrowthRate,
  approveCompanyGrowth,
  getGrowthAnalytics,
  deleteCompanyGrowth
} = require("../controllers/companyGrowthController")

// Apply authentication to all company growth routes
router.use(authenticateToken)

// Basic CRUD routes
router.get("/", getAllCompanyGrowth)
router.get("/analytics", getGrowthAnalytics)
router.get("/current-rate", getCurrentGrowthRate)
router.get("/trend", getGrowthTrend)
router.get("/period/:year/:quarter", getCompanyGrowthByPeriod)
router.get("/:id", getCompanyGrowthById)
router.post("/", createCompanyGrowth)
router.put("/:id", updateCompanyGrowth)
router.delete("/:id", deleteCompanyGrowth)

// Growth calculation routes
router.post("/:id/calculate-metrics", calculateGrowthMetrics)

// Approval routes
router.post("/:id/approve", approveCompanyGrowth)

module.exports = router
