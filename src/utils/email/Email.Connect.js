import nodeMailer from "nodemailer";
import "dotenv/config";

const transporter = nodeMailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.mail.ru",
  port: process.env.EMAIL_PORT || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default transporter;
