import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse.types";
import VerificationEmailTemplate from "../../emails/verifyEmail.template";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> => {
  try {
    const { error } = await resend.emails.send({
      from: "jayashysaini7361@gmail.com",
      to: email,
      subject: "PureFeedback | Email Verification",
      react: VerificationEmailTemplate({ username, verifyCode }),
    });

    if (error) {
      throw new Error(error.message || "Unknown error");
    }
    return {
      success: false,
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
