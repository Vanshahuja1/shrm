const express = require("express");
const {
  sendEmail,
  getAllEmails,
  sendEmailToMultipleRecipients,
  getById
} = require("../controllers/mailController");
const router = express.Router();

router.post("/send", sendEmail);
router.get("/", getAllEmails);
router.post("/send-multiple", sendEmailToMultipleRecipients);
router.get("/:id", getById);
module.exports = router;
