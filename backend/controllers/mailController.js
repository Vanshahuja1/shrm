const sendMail = require("../config/mailer");
const Email = require("../models/emailModel");

async function sendEmail(req, res) {
  try {
    await sendMail({
      from: req.body.from,
      to: req.body.to,
      subject: req.body.subject || "Notification from OneAim Organisation",
      text:
        req.body.text ||
        `You have a new notification from ${req.body.from} under OneAim Organisation, Kindly check your dashboard for more details.`,
    });


    // Store email data in DB
    const emailDoc = new Email({
      type: req.body.type,
      sender: req.body.from,
      recipient: req.body.to,
      senderId: req.body.senderId,
      recipientId: req.body.recipientId,
      subject: req.body.subject || "Notification from OneAim Organisation",
      message:
        req.body.text ||
        `You have a new notification from ${req.body.from} under OneAim Organisation, Kindly check your dashboard for more details.`,
      status: "sent",
    });
    await emailDoc.save();

    res.json({ success: true, message: "Email sent" });
  } catch (err) {
    await Email.create({
      type: req.body.type,
      sender: req.body.from,
      recipient: req.body.to,
      subject: req.body.subject || "Notification from OneAim Organisation",
      message:
        req.body.text ||
        `You have a new notification from ${req.body.from} under OneAim Organisation, Kindly check your dashboard for more details.`,
      status: "failed",
    });

    res
      .status(500)
      .json({ success: false, message: "Email failed", error: err.message });
  }
}

async function sendEmailToMultipleRecipients(req, res) {
  const { recipients, subject, text } = req.body;
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No recipients provided" });
  }
  try {
    const emailPromises = recipients.map((recipient) => {
      return sendMail({
        from: req.body.from,
        to: recipient,
        subject: subject || "Notification from OneAim Organisation",
        text:
          text ||
          `You have a new notification from ${req.body.from} under OneAim Organisation, Kindly check your dashboard for more details.`,
      });
    });

    await Promise.all(emailPromises);

    // Store emails in DB
    const emailDocs = recipients.map((recipient) => ({
      type: req.body.type,
      sender: req.body.from,
      recipient: recipient,
      subject: subject || "Notification from OneAim Organisation",
      message:
        text ||
        `You have a new notification from ${req.body.from} under OneAim Organisation, Kindly check your dashboard for more details.`,
      status: "sent",
    }));
    await Email.insertMany(emailDocs);

    res.json({ success: true, message: "Emails sent" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Email failed", error: err.message });
  }
}

async function getAllEmails(req, res) {
  try {
    const emails = await Email.find().sort({ sentAt: -1 });
    res.json({ success: true, emails });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch emails",
        error: err.message,
      });
  }
}

async function getById(req, res) {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });
    }
    res.json({ success: true, email });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch email",
        error: err.message,
      });
  }
}

async function getSentEmailsByEmployeeId(req, res) {
  const empId = req.params.empId;
  try {
    const emails = await Email.find({ sender: empId }).sort({ sentAt: -1 });
    res.json({ success: true, emails });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch emails",
        error: err.message,
      });
  }
}

async function getReceivedEmailsByEmployeeId(req, res) {
  const empId = req.params.empId;
  try {
    const emails = await Email.find({ recipient: empId }).sort({ sentAt: -1 });
    res.json({ success: true, emails });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch emails",
        error: err.message,
      });
  }
}

module.exports = {
  sendEmail,
  sendEmailToMultipleRecipients,
  getAllEmails,
  getById,
  getSentEmailsByEmployeeId,
  getReceivedEmailsByEmployeeId,
};
