import nodemailer from "nodemailer";
import logger from "./logger.js";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const sendEmail = async (options: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
    port: Number(process.env.EMAIL_PORT) || 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: '"Sukoon Productivity App" <no-reply@momentum.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  logger.info(`Message sent: ${info.messageId}`);
};

export default sendEmail;
