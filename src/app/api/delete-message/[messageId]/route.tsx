import { connectDB } from "@/lib/connectDB";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import UserModel from "@/models/user.models";
import { User } from "next-auth";
import userModels from "@/models/user.models";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  // Extract messageId from the URL

  const messageId = params.messageId;

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
    const updateResult = await UserModel.updateOne(
      {
        _id: userSession?._id,
      },
      {
        $pull: {
          message: {
            _id: messageId,
          },
        },
      },
      {
        new: true,
      }
    );

    const user = await userModels.findById(userSession?._id);

    if (updateResult.modifiedCount == 0) {
      return new Response(
        JSON.stringify({
          message: "Error in deleting messages",
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

    return new Response(
      JSON.stringify({
        message: "Message deleted successfully",
        success: true,
      }),
      {
        status: 200, // Updated status to 200
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: error.message || "Error in deleting messages",
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
