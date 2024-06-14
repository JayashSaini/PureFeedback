export function renderVerificationEmail(username: string, verifyCode: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          h1 {
            font-size: 24px;
            margin: 0 0 20px;
          }
          p {
            font-size: 16px;
            margin: 0 0 20px;
          }
          .otp {
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to PureFeedback, ${username}!</h1>
          <p>
            Thank you for registering with us. To complete your registration,
            please verify your email address by entering the following OTP code:
          </p>
          <p class="otp">${verifyCode}</p>
          <p>
            If you did not create an account with us, please ignore this
            email.
          </p>
          <p>Best regards,</p>
          <p>The PureFeedback Team</p>
        </div>
      </body>
    </html>
  `;
}
