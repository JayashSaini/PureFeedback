import { connectDB } from "@/lib/connectDB";
import { sendVerificationEmail } from "@/helpers/verificationEmail";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";
import moment from "moment";

export async function POST(request: Request) {
  await connectDB();
  try {
    const { username, email, password } = await request.json();

    const user = await User.findOne({
      $or: [
        {
          username,
        },
        {
          email,
        },
      ],
    });

    if (user) {
      return Response.json(
        {
          success: false,
          message: "User or Email is already exists!",
        },
        {
          status: 400,
        }
      );
    }

    // encrypt the password to store in the database
    const hashedPassword = bcrypt.hashSync(password, 10);

    const now = moment();
    const verifyCodeExpiry = now.add(1, "hour");

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
