import { z } from "zod";

export const userValidator = z.object({
  isAcceptingMessage: z.boolean(),
});
