import { z } from "zod";

export const userValidator = z.object({
  code: z.string().length(6, { message: "Please enter 6 digit code" }),
});
