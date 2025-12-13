const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController")

const router = express.Router()

// Apply authentication to all task routes
router.use(authenticateToken)

router.get("/", getAllTasks)
router.get("/:id", getTaskById)
router.post("/", createTask)
router.put("/:id", updateTask)
router.delete("/:id", deleteTask)

module.exports = router
