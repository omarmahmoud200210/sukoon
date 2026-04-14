import nodemailer from "nodemailer";
import logger from "./logger.js";

const sendEmail = async (userEmail: string, token: string) => {
  let transporter;

  if (process.env.NODE_ENV === "production") {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
      port: Number(process.env.EMAIL_PORT) || 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  const mailOptions = {
    from: "omar.mahmoud200210@gmail.com",
    to: userEmail,
    subject: "Test Email",
    text: "This is a test email",
    html: `<h1>This is a test email</h1><a href="${process.env.FRONTEND_URL}/verify-email?token=${token}">Verify Email</a>`,
  };

  const info = await transporter.sendMail(mailOptions);

  logger.info(`Message sent: ${info.messageId}`);
};

export default sendEmail;
