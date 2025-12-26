const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentsByOrganisation,
  getDepartmentSummary
} = require("../controllers/departmentController")

const router = express.Router()

// Apply authentication to all department routes
router.use(authenticateToken)

router.route("/").get(getAllDepartments).post(createDepartment)
router.route("/:id").get(getDepartmentById).put(updateDepartment).delete(deleteDepartment)
router.route("/org/:orgId").get(getDepartmentsByOrganisation)
router.route("/:id/summary").get(getDepartmentSummary)

module.exports = router