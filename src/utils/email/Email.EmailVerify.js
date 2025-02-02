import { readFileSync } from "fs";
import transporter from "./Email.Connect.js";

const payload = readFileSync("../../payload/emailVerify.html");

export default function sendVerificationEmail(email, username, url) {
  const mailOptions = {
    from: "info@mainandtee.fun",
    to: email,
    subject: "Подтверждение почты",
    html: payload.toString("utf-8"),
  };

  mailOptions.html = mailOptions.html.replace("{{username}}", username);
  mailOptions.html = mailOptions.html.replaceAll("{{url}}", url);

  return transporter.sendMail(mailOptions).catch(console.error);
}
