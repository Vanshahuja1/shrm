const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  sendEmail,
  getAllEmails,
  sendEmailToMultipleRecipients,
  getById,
  getSentEmailsByEmployeeId,
  getReceivedEmailsByEmployeeId

} = require("../controllers/mailController");

const router = express.Router();

// Apply authentication to all mail routes
router.use(authenticateToken);

router.post("/send", sendEmail);
router.get("/", getAllEmails);
router.post("/send-multiple", sendEmailToMultipleRecipients);
router.get("/get/:empId" , getReceivedEmailsByEmployeeId);
router.get("/sent/:empId" , getSentEmailsByEmployeeId);
router.get("/:id", getById);
module.exports = router;
