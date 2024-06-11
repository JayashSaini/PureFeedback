import { z } from "zod";

export const userValidator = z.object({
  identifier: z.string(),
  password: z.string(),
});
