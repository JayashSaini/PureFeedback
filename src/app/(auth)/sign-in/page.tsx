"use client";
import React, { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useDebounceCallback } from "usehooks-ts";
import { ApiResponse } from "@/types/ApiResponse.types";
import * as z from "zod";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { userValidator } from "@/schema/signIn.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { TailSpin } from "react-loader-spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { signIn } from "next-auth/react";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof userValidator>>({
    resolver: zodResolver(userValidator),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof userValidator>) => {
    setIsSubmitting(true);

    const result: any = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (!result.ok) {
      toast.error(result?.error);
      setIsSubmitting(false);
      return;
    }

    toast.success("Sign in successfully");
    setIsSubmitting(false);
    router.replace("/");
  };

  return (
    <div className="w-full h-screen first-color flex md:flex-row flex-col">
      <div className="md:w-1/2 w-full h-full flex justify-center items-center">
        <div className="max-w-[400px] w-full p-5 border-2 rounded-xl border-[#be3144] shadow-xl mx-5">
          <h2 className="md:text-3xl text-2xl mb-4 text-center font-medium">
            Sign In
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email here..."
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        className="focus:bg-[#c8ccd1] rounded-md"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password here..."
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        className="focus:bg-[#c8ccd1] rounded-md"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
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
                    height="27"
                    width="27"
                    color="#fff"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
          <div className="w-full text-center text-black mt-2">
            <p className="text-xs">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-blue-500 text-sm">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="md:w-1/2 md:flex hidden justify-center items-center h-full">
        <div className="w-[70%] h-[100%] relative">
          <Image
            src="/images/signin.svg"
            alt="Sign up"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
