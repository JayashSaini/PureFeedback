import { z } from "zod";

export const verifyUsernameValidator = z.object({
  code: z.string().length(6, { message: "Please enter 6 digit code" }),
});
