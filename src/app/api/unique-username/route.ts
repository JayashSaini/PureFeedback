import User from "@/models/user.models";
import { connectDB } from "@/lib/connectDB";
import { z } from "zod";
import { usernameValidator } from "@/schema/signUp.schema";

const uniqueUserNameSchema = z.object({
  username: usernameValidator,
});

export const dynamic = "force-dynamic"; // This ensures the route is treated as dynamic

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
      return new Response(
        JSON.stringify({
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid username provided",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const user = await User.findOne({
      username: queryParams.username,
    });

    if (user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username is already taken",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Username is available",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.log("Error checking unique username: ", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error checking unique username",
      }),
      {
        status: 500, // It's better to return a 500 status for server errors
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
