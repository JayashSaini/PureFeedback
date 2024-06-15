import { connectDB } from "@/lib/connectDB";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import UserModel from "@/models/user.models";
import { User } from "next-auth";
import mongoose from "mongoose";

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
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userSession._id),
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);

    if (!user || user.length === 0) {
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

    return new Response(
      JSON.stringify({
        success: true,
        message: user[0].messages,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.log("Error in fetch messages ", error.message);
    return new Response(
      JSON.stringify({
        message: error.message || "Error in fetch messages",
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
