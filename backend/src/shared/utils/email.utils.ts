import logger from "./logger.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (userEmail: string, token: string) => {
  if (process.env.NODE_ENV === "production") {
    resend.emails.send({
      from: process.env.GMAIL_EMAIL!,
      to: userEmail,
      subject: "Verify Email",
      text: "Verify your email",
      html: `<a href="${process.env.FRONTEND_URL}/verify-email?token=${token}">Verify Email</a>`,
    });

    logger.info(`Email sent to ${userEmail}`);
  }
};

export default sendEmail;
