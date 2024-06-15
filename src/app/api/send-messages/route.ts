import { connectDB } from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import UserModel from "@/models/user.models";
import { userValidator } from "@/schema/message.schema"; // Adjust the import path as necessary

export async function POST(request: Request) {
  await connectDB();

  try {
    const { content, username } = await request.json();

    // Validate the incoming data
    const validation = userValidator.safeParse({ content });

    if (!validation.success) {
      return new Response(
        JSON.stringify({
          message: validation.error.errors[0].message,
          success: false,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return new Response(
        JSON.stringify({
          message: "User not found",
          success: false,
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!user.isAcceptingMessage) {
      return new Response(
        JSON.stringify({
          message: "User is not accepting messages",
          success: false,
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(newMessage);
    await user.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message sent successfully",
        user,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.log("Error in sending message ", error.message);
    return new Response(
      JSON.stringify({
        message: error.message || "Error in sending message",
        success: false,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
