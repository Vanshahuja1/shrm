const express = require("express");
const {
  getProfile,
  updateProfile,
  getAllUsers,
  getById,
  addEmp,
  updateEmp,
  deleteEmp,
  getNameById,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");
const { authorizeEmployeeAccess, authorizeHRAccess } = require("../middleware/authorization");

const router = express.Router();

// Public routes (no authentication required) - only basic user info
router.get("/name/:empId", getNameById);

// Protected routes (authentication required)
router.use(authenticateToken);
router.get("/", authorizeHRAccess, getAllUsers);
router.post("/addEmp", authorizeHRAccess, addEmp);
router.get("/profile", getProfile);
router.patch("/profile", updateProfile);
router.get("/:id", authorizeEmployeeAccess, getById);
router.put("/:id", authorizeEmployeeAccess, updateEmp);
router.delete("/:id", authorizeHRAccess, deleteEmp);

module.exports = router;
