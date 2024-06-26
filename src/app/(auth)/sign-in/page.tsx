"use client";

import React, { useState } from "react";
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
    router.replace("/dashboard");
  };

  return (
    <div className="w-full h-[85vh] flex md:flex-row flex-col">
      <div className="md:w-1/2 w-full h-full flex justify-center items-center">
        <div className="max-w-[400px] w-full p-5 border-2 rounded-xl border-[#283618] shadow-xl mx-5">
          <h2 className="md:text-3xl text-2xl mb-4 text-center font-medium text-[#181f11]">
            Sign In
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 overflow-hidden"
            >
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
                        className="focus:bg-transparent rounded-md"
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
                        className="focus:bg-transparent rounded-md"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="md:w-[323px] w-full text-center bg-[#283618] text-white rounded-lg hover:bg-[#222c17] cursor-pointer"
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
          <div className="w-full text-center text-[#283618] mt-2">
            <p className="text-xs">
              Don&apos;t have an account?{" "}
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
            src="/images/signIn.svg"
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
