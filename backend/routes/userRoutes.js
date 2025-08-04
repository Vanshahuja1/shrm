const express = require("express");
const {
  getProfile,
  updateProfile,
  getAllUsers,
  getById,
  addEmp,
  updateEmp,
  deleteEmp
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Public routes (no authentication required)
router.get("/", getAllUsers);
router.post("/addEmp", addEmp);
router.get("/:id", getById);
router.put("/:id", updateEmp);
router.delete("/:id", deleteEmp);

// Protected routes (authentication required)
router.get("/profile", authenticateToken, getProfile);
router.patch("/profile", authenticateToken, updateProfile);

module.exports = router;
