import { z } from "zod";

export const ZUserSchema = z.object({
  user_id: z.number().int().positive(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().length(10),
  address: z.string(),
});
