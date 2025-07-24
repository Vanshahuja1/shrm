const nodemailer = require("nodemailer");
require('dotenv').config();
const transporter = nodemailer.createTransport({
  service: "gmail", // or use SMTP config
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail({ to, subject, text, html }) {
    console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });
}

module.exports = sendMail;