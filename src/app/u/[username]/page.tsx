"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { userValidator } from "@/schema/message.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TailSpin } from "react-loader-spinner";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse.types";
import { toast } from "sonner";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();

  const form = useForm<z.infer<typeof userValidator>>({
    resolver: zodResolver(userValidator),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof userValidator>) => {
    try {
      setIsSubmitting(true);
      const res = await axios.post<ApiResponse>("/api/send-messages", {
        username: params.username,
        content: data.content,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Message send successfully");
      } else {
        toast.error(res.data.message || "Failed to send message");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to send message"
      );
    } finally {
      setIsSubmitting(false);
      form.reset();
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center py-5">
      <div className="max-w-[600px] w-full p-3 border-2 rounded-xl border-[#283618] mx-3 overflow-hidden">
        <h1 className="text-center text-3xl font-bold">Public Profile Link</h1>
        <h3 className="text-xl text-[#283618] font-semibold mt-5"></h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Send anonymous message to @{params.username}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="message here..."
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      className="focus:bg-[#fefae050] rounded-[4px]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full  bg-[#283618] hover:bg-[#212c13] text-white text-base cursor-pointer"
              >
                {isSubmitting ? (
                  <TailSpin
                    visible={true}
                    height="27"
                    width="27"
                    color="#fff"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                ) : (
                  "Send it"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
