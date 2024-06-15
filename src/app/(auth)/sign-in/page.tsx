"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useDebounceValue } from "usehooks-ts";
import { ApiResponse } from "@/types/ApiResponse.types";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { userValidator } from "@/schema/signUp.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { TailSpin } from "react-loader-spinner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Page = () => {
  const [username, setUsername] = useState<string>("");
  const [isUsernameChecking, setIsUsernameChecking] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const debouncedUsername = useDebounceValue(username, 500);

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

  // const checkUsernameUnique = useCallback(() => {
  //   if (debouncedUsername && !isUsernameChecking) {
  //     setIsUsernameChecking(true);
  //     axios
  //       .get(`/api/unique-username?username=${debouncedUsername}`)
  //       .then((res: AxiosResponse<ApiResponse>) => {
  //         setUsernameMessage(res.data.message);
  //       })
  //       .catch((err: AxiosError<ApiResponse>) => {
  //         setUsernameMessage(
  //           err.response?.data.message ?? "Error checking username"
  //         );
  //       })
  //       .finally(() => {
  //         setIsUsernameChecking(false);
  //       });
  //   } else {
  //     setUsernameMessage("");
  //   }
  // }, [debouncedUsername]);

  // useEffect(() => {
  //   checkUsernameUnique();
  // }, [debouncedUsername, checkUsernameUnique]);

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
    <div className="w-full h-screen first-color flex md:flex-row flex-col ">
      <div className="md:w-1/2 w-full h-full flex justify-center items-center">
        <div className="max-w-[400px] w-full p-5 border-2 rounded-xl border-[#be3144] shadow-xl mx-5">
          <h2 className="md:text-3xl text-2xl mb-4 text-center font-medium">
            Sign Up
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                          setUsername(e.target.value);
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
                className="w-full text-center bg-[#be3144] text-white rounded-lg hover:bg-[#a32032] "
              >
                {isSubmitting ? (
                  <TailSpin
                    visible={true}
                    height="33"
                    width="33"
                    color="#fff"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="md:w-1/2 md:flex hidden justify-center items-center h-full">
        <div className="w-[80%] h-[100%] relative">
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
