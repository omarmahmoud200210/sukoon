import nodemailer from "nodemailer";
const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
        port: Number(process.env.EMAIL_PORT) || 2525,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const info = await transporter.sendMail({
        from: '"Momentum App" <no-reply@momentum.com>',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    });
    console.log("Message sent: %s", info.messageId);
};
export default sendEmail;
