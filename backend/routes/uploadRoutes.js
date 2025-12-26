const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const { upload, uploadSingle, uploadMultiple, deleteFile } = require("../controllers/uploadController")

const router = express.Router()

// Apply authentication to all upload routes
router.use(authenticateToken)

// Single file upload
router.post("/single", upload.single("file"), uploadSingle)

// Multiple files upload
router.post("/multiple", upload.array("files", 10), uploadMultiple)

// Delete file
router.delete("/", deleteFile)

module.exports = router
