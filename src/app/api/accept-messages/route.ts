import { connectDB } from "@/lib/connectDB";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import UserModel from "@/models/user.models";
import { User } from "next-auth";

export async function POST(request: Request) {
  await connectDB();

  const { acceptingMessage } = await request.json();

  const session = await getServerSession(authOptions);

  const userSession: User = session?.user as User;

  if (!session || !userSession) {
    return new Response(
      JSON.stringify({
        message: "Not Authenticated",
        success: false,
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const user = await UserModel.findById(userSession?._id);

    if (!user) {
      throw new Error("User not found");
    }

    user.isAcceptingMessage = acceptingMessage;
    await user.save();

    return new Response(
      JSON.stringify({
        message: `Is Accepting Message ${acceptingMessage ? "On" : "Off"}`,
        success: true,
        isAcceptingMessage: acceptingMessage,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.log("Error in accepting messages ", error.message);
    return new Response(
      JSON.stringify({
        message: error.message || "Error in accepting messages",
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

export async function GET(request: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  const userSession: User = session?.user as User;

  if (!session || !userSession) {
    return new Response(
      JSON.stringify({
        message: "Not Authenticated",
        success: false,
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const user = await UserModel.findById(userSession?._id);

    if (!user) {
      return new Response(
        JSON.stringify({
          message: "User not found",
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

    return new Response(
      JSON.stringify({
        message: "User fetched successfully",
        success: true,
        isAcceptingMessage: user.isAcceptingMessage,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.log("Error in accepting messages ", error.message);
    return new Response(
      JSON.stringify({
        message: error.message || "Error in accepting messages",
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
