"use client";
import React, { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useDebounceCallback } from "usehooks-ts";
import { ApiResponse } from "@/types/ApiResponse.types";
import * as z from "zod";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { userValidator } from "@/schema/signUp.schema";
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

const Page = () => {
  const [username, setUsername] = useState<string>("");
  const [isUsernameChecking, setIsUsernameChecking] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const debounce = useDebounceCallback(setUsername, 500);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof userValidator>>({
    resolver: zodResolver(userValidator),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  useEffect(() => {
    let isMounted = true;

    if (username) {
      setIsUsernameChecking(true);
      axios
        .get(`/api/unique-username?username=${username}`)
        .then((res: AxiosResponse<ApiResponse>) => {
          if (isMounted) {
            setUsernameMessage(res.data.message);
          }
        })
        .catch((err: AxiosError<ApiResponse>) => {
          if (isMounted) {
            setUsernameMessage(
              err.response?.data.message ?? "Error checking username"
            );
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsUsernameChecking(false);
          }
        });
    } else {
      setUsernameMessage("");
    }

    return () => {
      isMounted = false;
    };
  }, [username]);

  const onSubmit = (data: z.infer<typeof userValidator>) => {
    setIsSubmitting(true);
    axios
      .post("/api/sign-up", data)
      .then((res: AxiosResponse<ApiResponse>) => {
        if (res.data.success) {
          toast.success(res.data.message);

          router.replace(`/verify/${data.username}`);
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
    <div className="w-full h-[85vh] flex md:flex-row flex-col">
      <div className="md:w-1/2 w-full h-full flex justify-center items-center">
        <div className="max-w-[400px] w-full p-5 border-2 rounded-xl border-[#283618] shadow-xl mx-5">
          <h2 className="md:text-3xl text-2xl mb-4 text-center font-medium text-[#181f11]">
            Sign Up
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4 overflow-hidden "
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username here..."
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounce(e.target.value);
                        }}
                        className="focus:bg-transparent rounded-md"
                      />
                    </FormControl>

                    {isUsernameChecking && (
                      <TailSpin
                        visible={true}
                        height="27"
                        width="27"
                        color="#000"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{}}
                        wrapperClass=""
                      />
                    )}
                    {usernameMessage && (
                      <div
                        className={`${
                          usernameMessage === "Username is available"
                            ? "text-green-700"
                            : "text-[#be3144]"
                        } text-sm`}
                      >
                        {usernameMessage}
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
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
                className="max-w-[323px] w-full text-center bg-[#283618] text-white rounded-lg hover:bg-[#222c17] cursor-pointer"
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
                  "Sign up"
                )}
              </Button>
            </form>
          </Form>
          <div className="w-full text-center text-[#283618] mt-2">
            <p className="text-xs">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-blue-500 text-sm">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="md:w-1/2 md:flex hidden justify-center items-center h-full">
        <div className="w-[70%] h-[100%] relative">
          <Image
            src="/images/signup.svg"
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
