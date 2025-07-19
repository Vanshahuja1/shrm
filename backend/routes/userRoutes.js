const express = require("express")
const { getProfile, updateProfile } = require("../controllers/userController")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

router.use(authenticateToken)

router.get("/profile", getProfile)
router.patch("/profile", updateProfile)

module.exports = router
