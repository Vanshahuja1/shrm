const express = require("express")
const {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  changePassword,
} = require("../controllers/authController")
const { authenticateToken, restrictTo } = require("../middleware/auth")

const router = express.Router()

// Public routes
router.post("/register", register)
router.post("/login", login)

// Protected routes
router.use(authenticateToken) // All routes after this middleware are protected

router.get("/profile", getProfile)
router.patch("/profile", updateProfile)
router.patch("/change-password", changePassword)

// Admin only routes
router.get("/users", restrictTo("admin"), getAllUsers)

module.exports = router
