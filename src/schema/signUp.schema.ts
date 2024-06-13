import { z } from "zod";
import UserModel, { User } from "@/models/user.models";
import { maxHeaderSize } from "http";

const usernameValidator = z
  .string({
    required_error: "username is required",
    invalid_type_error: "username must be a string",
  })
  .min(3, { message: "Username must be at least 3 characters long" })
  .max(20, { message: "Username maximum 20 characters can long" })
  .regex(/^[a-zA-Z0-9]+$/, {
    message: "Username can only contain letters and numbers",
  })
  .refine(
    async (username) => {
      const user: User | null = await UserModel.findOne({ username });
      if (user) {
        if (user.isVerified) {
          return false;
        }
        return true;
      }
      return true;
    },
    {
      message: "username is already exists",
    }
  );

const emailValidator = z
  .string()
  .email({
    message: "please provide valid email address",
  })
  .refine(
    async (email) => {
      const user: User | null = await UserModel.findOne({ email });
      if (user) {
        if (user.isVerified) {
          return false;
        }
        return true;
      }
      return true;
    },
    {
      message: "email is already exists",
    }
  );

const passwordValidator = z
  .string()
  .min(8, {
    message: "password must be 8 characters long",
  })
  .max(20, { message: "password must be at least 20 characters long" });

export const userValidator = z.object({
  username: usernameValidator,
  email: emailValidator,
  password: passwordValidator,
});
