const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationSummary,
} = require("../controllers/organizationController")

const router = express.Router()

// Apply authentication to all organization routes
router.use(authenticateToken)

router.route("/").get(getAllOrganizations).post(createOrganization)
router.route("/:id").get(getOrganizationById).put(updateOrganization).delete(deleteOrganization)
router.route("/:id/summary").get(getOrganizationSummary)

module.exports = router
