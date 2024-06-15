import User from "@/models/user.models";
import { connectDB } from "@/lib/connectDB";
import { z } from "zod";
import { usernameValidator } from "@/schema/signUp.schema";

const uniqueUserNameSchema = z.object({
  username: usernameValidator,
});

export async function GET(request: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    const result = uniqueUserNameSchema.safeParse(queryParams);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid username provided",
        },
        {
          status: 400,
        }
      );
    }

    const user = await User.findOne({
      username: queryParams.username,
      isVerified: true,
    });

    if (user) {
      return Response.json(
        {
          success: false,
          message: "Username is  already taken",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error checking unique username : ", error);
    return Response.json(
      {
        success: false,
        message: "Error checking unique username",
      },
      {
        status: 400,
      }
    );
  }
}
