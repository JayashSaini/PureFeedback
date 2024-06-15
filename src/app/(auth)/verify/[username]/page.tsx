"use client";

import { verifyUsernameValidator } from "@/schema/verify.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import React, { useState } from "react";
import * as z from "zod";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse.types";
import { TailSpin } from "react-loader-spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

const VerifyPage = () => {
  const param = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof verifyUsernameValidator>>({
    resolver: zodResolver(verifyUsernameValidator),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (data: z.infer<typeof verifyUsernameValidator>) => {
    setIsSubmitting(true);
    axios
      .post("/api/verify-username", {
        username: param.username,
        code: data.code,
      })
      .then((res: AxiosResponse<ApiResponse>) => {
        if (res.data.success) {
          toast.success(res.data.message);
          router.replace(`/sign-in`);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err: AxiosError<ApiResponse>) => {
        toast.error(err.response?.data.message ?? "Error while submitting");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="max-w-[400px] w-full p-5 border-2 rounded-xl border-[#be3144] shadow-xl mx-5">
        <h2 className="md:text-3xl text-2xl mb-4 text-center font-medium">
          Verify Account
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification code</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Code here..."
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      className="focus:bg-transparent bg-transparent rounded-md"
                      minLength={6}
                      maxLength={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-center bg-[#be3144] text-white rounded-lg hover:bg-[#a32032]"
            >
              {isSubmitting ? (
                <TailSpin
                  visible={true}
                  height="30"
                  width="30"
                  color="#fff"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : (
                "Confirm"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyPage;
