import { connectDB } from "@/lib/connectDB";
import { sendVerificationEmail } from "@/helpers/verificationEmail";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await connectDB();
  try {
    const { username, email, password } = await request.json();

    // encrypt the password to store in the database
    const hashedPassword = bcrypt.hashSync(password, 10);

    const expiryDate = Date.now();
    const verifyCodeExpiry = new Date(expiryDate + 60 * 60 * 1000);
    const verifyCode = Math.floor(100000 + Math.random() * 900000);

    // send verification email to the user
    const { success, message } = await sendVerificationEmail(
      email,
      username,
      String(verifyCode)
    );

    if (!success) {
      return Response.json(
        {
          success: false,
          message,
        },
        {
          status: 500,
        }
      );
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry,
    });

    await newUser.save();

    return Response.json(
      {
        success: true,
        message: "User registered successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error while user registration", error);

    return Response.json(
      {
        success: false,
        message: "Failed to register user",
      },
      {
        status: 400,
      }
    );
  }
}
