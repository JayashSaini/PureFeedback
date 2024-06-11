import { z } from "zod";

export const userValidator = z.object({
  content: z
    .string()
    .min(10, {
      message: "content must be 10 characters long",
    })
    .max(5000, {
      message: "content maximum 5000 characters long",
    }),
});
