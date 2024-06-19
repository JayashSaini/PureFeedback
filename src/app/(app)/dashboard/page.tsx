"use client";
import { Message } from "@/models/message.models";
import { userValidator } from "@/schema/acceptMessage.schema";
import { ApiResponse } from "@/types/ApiResponse.types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError, AxiosResponse } from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Switch from "@radix-ui/react-switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import * as z from "zod";
import { Clipboard, ClipboardCheck, Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/Message";
import { Triangle } from "react-loader-spinner";

const Page = () => {
  const [Messages, setMessages] = useState<Message[]>([]);
  const [isRefreshLoading, setIsRefreshLoading] = useState(false);
  const [isSwitchingLoading, setIsSwitchingLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { data: session } = useSession();
  const user = session?.user as User;

  const form = useForm<z.infer<typeof userValidator>>({
    resolver: zodResolver(userValidator),
  });

  const { watch, setValue, register } = form;

  const isAcceptingMessage = watch("isAcceptingMessage");

  // accept messages
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchingLoading(true);
    try {
      const res: AxiosResponse<ApiResponse> = await axios.get(
        "/api/accept-messages"
      );
      if (res.data.success) {
        const isAcceptingMessage = res.data?.isAcceptingMessage || false;
        setValue("isAcceptingMessage", isAcceptingMessage);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch Accept Messages"
      );
    } finally {
      setIsSwitchingLoading(false);
    }
  }, [setValue]);

  // fetch messages
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsRefreshLoading(true);
      setIsSwitchingLoading(false);
      try {
        const res: AxiosResponse<ApiResponse> = await axios.get(
          "/api/get-messages"
        );
        if (res.data.success) {
          setMessages(res.data?.messages || []);
          if (refresh) {
            toast.info("Messages refreshed!");
          }
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message || "Failed to fetch messages"
        );
      } finally {
        setIsRefreshLoading(false);
      }
    },
    [setMessages, setIsRefreshLoading]
  );

  useEffect(() => {
    setIsLoading(true);
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessages();
    setIsLoading(false);
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  // Switch handler
  const handleSwitchChange = async () => {
    try {
      const res = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptingMessage: !isAcceptingMessage,
      });
      if (res.data.success) {
        setValue("isAcceptingMessage", !isAcceptingMessage);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to switch");
    }
  };

  // if user is not authenticated then directly display this message
  useCallback(() => {
    if ((!session || !session?.user) && !isLoading) {
      return <>Please Login!</>;
    }
  }, [isLoading]);

  const baseUrl = `${window.location.protocol}//${window.location.hostname}`;
  const profileUrl = `${baseUrl}/u/${session?.user?.username}`;

  // dynamic URL Clipboard Copy settings
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    setIsCopied(true);
    toast.info("Copied to clipboard");
  };

  return !isLoading ? (
    <div className=" w-full min-h-[90vh] flex flex-col justify-start items-center">
      <div className="md:w-[90%] w-full px-4 py-24">
        <div className="w-full">
          <h2 className="md:text-4xl text-2xl">
            <span className="md:text-5xl text-3xl font-sans">Welcome, </span>
            <span className="font-bold text-[#be3144]">
              {session?.user.username || session?.user?.email}!
            </span>
          </h2>
        </div>
        <div className="w-full first-color flex justify-between items-center px-2 md:mt-10 mt-5 border-2 border-gray-800 rounded-xl overflow-hidden">
          <input
            type="text"
            readOnly
            value={"> " + profileUrl}
            className="w-full text-lg px-4 py-6 focus:outline-none bg-transparent"
          />
          <div
            className="w-[50px] flex items-center justify-start cursor-pointer h-full"
            onClick={copyToClipboard}
          >
            {isCopied ? (
              <ClipboardCheck className="text-gray-700" />
            ) : (
              <Clipboard className="text-gray-700" />
            )}
          </div>
        </div>

        <div className="mt-12 py-3 px-3 border-gray-400 border-2 rounded-xl">
          <div className="w-full rounded-xl overflow-hidden bg-slate-100 flex p-4 justify-between items-center">
            <div className="flex items-center justify-start gap-2">
              <Switch.Root
                {...register("isAcceptingMessage")}
                checked={isAcceptingMessage}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchingLoading}
                className="SwitchRoot"
              >
                <Switch.Thumb className="SwitchThumb" />
              </Switch.Root>
              <span className="text-base">Accept Messages</span>
            </div>
            <button
              className="w-[50px] h-[50px] bg-slate-200 rounded-xl shadow-lg cursor-pointer flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
            >
              {isRefreshLoading ? (
                <Loader2 className="text-gray-700" />
              ) : (
                <RefreshCcw className="text-gray-700" />
              )}
            </button>
          </div>
          <Separator className="bg-gray-300 my-3 h-[2px]" />
          <div className="w-full rounded-xl bg-slate-100 p-3 overflow-hidden">
            {Messages.length > 0 ? (
              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                {Messages.map((message: Message) => {
                  return (
                    <MessageCard
                      key={message.id}
                      message={message}
                      messageId={String(message._id) || ""}
                      setMessagesHandler={(messageId: string) => {
                        const updatedMessage = Messages.filter(
                          (m: Message) => m._id !== messageId
                        );
                        console.log("updatedMessage", updatedMessage);
                        setMessages(updatedMessage);
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-base text-gray-600">
                No message here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full h-screen flex items-center justify-center">
      <Triangle
        visible={true}
        height="80"
        width="80"
        color="#be3144"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default Page;
