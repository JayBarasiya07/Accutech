import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create transporter once
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send a single email
export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
    console.log(`✅ Email sent to ${to} | Subject: ${subject}`);
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}`, err);
    throw err;
  }
};

// Send OTP email
export const sendOtpEmail = async (to, otp, expirySeconds = 300) => {
  const subject = "🔑 Your OTP Code for Accutech Power Solutions";
  const html = `
    <h2>Accutech Power Solutions</h2>
    <p>Your OTP is: <b>${otp}</b></p>
    <p>This OTP is valid for ${expirySeconds} seconds.</p>
    <p>If you did not request this, please ignore.</p>
  `;
  await sendEmail(to, subject, html);
};

// Send mass emails with custom subject and message
export const sendMassEmails = async (users) => {
  // users = [{ email: "user@example.com", subject: "Hello", message: "Custom HTML message" }, ...]
  for (const user of users) {
    const { email, subject, message } = user;
    await sendEmail(email, subject, message);
  }
};
