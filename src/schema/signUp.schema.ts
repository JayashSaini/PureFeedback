import { z } from "zod";

const usernameValidator = z
  .string({
    required_error: "username is required",
    invalid_type_error: "username must be a string",
  })
  .min(3, { message: "Username must be at least 3 characters long" })
  .max(20, { message: "Username maximum 20 characters can long" })
  .regex(/^[a-zA-Z0-9]+$/, {
    message: "Username can only contain letters and numbers",
  });

export const userValidator = z.object({
  username: usernameValidator,
  email: z.string().email({
    message: "please provide valid email address",
  }),
  password: z.string(),
});
