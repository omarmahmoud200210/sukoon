import nodemailer from "nodemailer";
import logger from "./logger.js";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const sendEmail = async (options: EmailOptions) => {
  let transporter;

  if (process.env.GMAIL_EMAIL && process.env.GMAIL_PASSWORD) {
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

  const senderEmail = process.env.GMAIL_EMAIL || "no-reply@momentum.com";

  const info = await transporter.sendMail({
    from: `"Sukoon Productivity App" <${senderEmail}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  logger.info(`Message sent: ${info.messageId}`);
};

export default sendEmail;
