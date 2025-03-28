import { z } from "zod";

export const ZCustomerQueueSchema = z.object({
  user_id: z.number().int().positive(),
  booking_date: z.coerce.date(),
});
