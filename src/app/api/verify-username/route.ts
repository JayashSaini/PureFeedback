import User from "@/models/user.models";
import { connectDB } from "@/lib/connectDB";
import { verifyUsernameValidator } from "@/schema/verify.schema";
import moment from "moment";

export async function POST(request: Request) {
  await connectDB();
  try {
    const { username, code } = await request.json();

    const result = verifyUsernameValidator.safeParse({ username, code });

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      const codeError = result.error.format().code?._errors || [];

      const getMessage =
        usernameErrors.length > 0
          ? usernameErrors[0]
          : codeError.length > 0
          ? codeError[0]
          : "Invalid parameters";

      return Response.json(
        {
          success: false,
          message: getMessage,
        },
        {
          status: 400,
        }
      );
    }

    const user = await User.findOne({
      username: username,
    });

    // check user is exists or not
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "username is not found",
        },
        {
          status: 400,
        }
      );
    }

    // check code is correct or not
    if (user.verifyCode !== code) {
      return Response.json(
        {
          success: false,
          message: "code is incorrect!",
        },
        {
          status: 400,
        }
      );
    }

    // check code is expiry date
    const now = moment();
    if (now.isAfter(user.verifyCodeExpiry)) {
      return Response.json(
        {
          success: false,
          message: "code is expired!",
        },
        {
          status: 400,
        }
      );
    }

    // update user based on username
    await User.updateOne(
      {
        username,
      },
      {
        isVerified: true,
        verifyCode: null,
        verifyCodeExpiry: null,
      }
    );

    return Response.json(
      {
        success: true,
        message: "User verified successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error in verify user : ", error);
    return Response.json(
      {
        success: false,
        message: "Error in verify user",
      },
      {
        status: 400,
      }
    );
  }
}
