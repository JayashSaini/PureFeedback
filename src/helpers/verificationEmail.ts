import { ApiResponse } from "@/types/ApiResponse.types";
import { renderVerificationEmail } from "../../emails/verifyEmail.template";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> => {
  // Render the React component to HTML
  const htmlContent = renderVerificationEmail(username, verifyCode);

  const mail = {
    from: "purefeedback@gmail.com", // We can name this anything. The mail will go to your Mailtrap inbox
    to: email, // receiver's mail
    subject: "PureFeedback | Email Verification", // mail subject
    html: htmlContent,
  };
  try {
    await transporter.sendMail(mail);

    return {
      success: true,
      message: "Send verification email successfully",
    };
  } catch (error) {
    console.error("Failed to send verification email error : ", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
};
