"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "./ui/button";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import { toast } from "sonner";
import { Message as MessageInterface } from "@/models/message.models";

interface MessageProp {
  message: MessageInterface;
  messageId: string;
  setMessagesHandler: (messageId: string) => void;
}

const Message = ({ message, messageId, setMessagesHandler }: MessageProp) => {
  const onDeleteMessageHandler = async () => {
    try {
      const res = await axios.delete(`/api/delete-message/${messageId}`);
      console.log("message id : ", messageId);
      if (res.data.success) {
        toast.success(res.data.message);
        setMessagesHandler(messageId);
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      console.log("error is : ", JSON.stringify(error));
    }
  };

  function formatMongoDate(createdAt: Date) {
    const date = new Date(createdAt);

    const options: any = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    const timeOptions: any = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

    return `${formattedDate} ${formattedTime}`;
  }
  return (
    <Card className="rounded-xl bg-slate-50 py-3">
      <CardHeader>
        <div className="w-full flex justify-between items-center">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className=" px-2 py-0 fourth-color hover:bg-[#a32a3a] cursor-pointer rounded-[5px]"
              >
                <IoCloseSharp className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDeleteMessageHandler}
                  className="bg-[#be3144] hover:bg-[#943b47]"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <CardDescription className="text-gray-500">
          {formatMongoDate(message.createdAt)}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default Message;
