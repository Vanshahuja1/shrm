const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

// Apply authentication to all project routes
router.use(authenticateToken);

router.route("/").get(getAllProjects).post(createProject);

router
  .route("/:id")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;
