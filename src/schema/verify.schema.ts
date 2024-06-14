import { z } from "zod";

export const verifyUsernameValidator = z.object({
  username: z.string(),
  code: z.string().length(6, { message: "Please enter 6 digit code" }),
});
