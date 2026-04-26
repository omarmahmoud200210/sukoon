import logger from "./logger.js";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_ADDRESS = "onboarding@resend.dev";
const sendEmail = async (userEmail, token) => {
    const { data, error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: userEmail,
        subject: "Verify your Sukoon account",
        html: `
      <p>Welcome to Sukoon!</p>
      <p>Click the link below to verify your email address:</p>
      <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}">Verify Email</a>
    `,
    });
    if (error) {
        logger.error(`Failed to send email to ${userEmail}: ${error.message}`);
        throw new Error(`Email delivery failed: ${error.message}`);
    }
    logger.info(`Email sent to ${userEmail} (id: ${data?.id})`);
};
export default sendEmail;
