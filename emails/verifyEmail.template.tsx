import * as React from "react";

interface VerificationEmailTemplateProps {
  username: string;
  verifyCode: string;
}

export default function VerificationEmailTemplate({
  username,
  verifyCode,
}: VerificationEmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.5",
        color: "#333",
      }}
    >
      <table
        width="100%"
        border={0}
        cellPadding="0"
        cellSpacing="0"
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <tr>
          <td style={{ padding: "20px", backgroundColor: "#f4f4f4" }}>
            <h1 style={{ fontSize: "24px", margin: "0 0 20px" }}>
              Welcome to PureFeedback, {username}!
            </h1>
            <p style={{ fontSize: "16px", margin: "0 0 20px" }}>
              Thank you for registering with us. To complete your registration,
              please verify your email address by entering the following OTP
              code:
            </p>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                margin: "20px 0",
                color: "#555",
              }}
            >
              {verifyCode}
            </p>
            <p style={{ fontSize: "16px", margin: "0 0 20px" }}>
              If you did not create an account with us, please ignore this
              email.
            </p>
            <p style={{ fontSize: "16px", margin: "0 0 20px" }}>
              Best regards,
            </p>
            <p style={{ fontSize: "16px", margin: "0 0 20px" }}>
              The PureFeedback Team
            </p>
          </td>
        </tr>
      </table>
    </div>
  );
}
