import { z } from "zod";

const ZOrderItem = z.object({
  description: z.string().min(1),
  quantity: z.number().min(1),
  price: z.number().min(0),
});

export const ZOrderSchema = z.object({
  user_id: z.number().int().positive(),
  booking_date: z.string().datetime(),
  items: z.array(ZOrderItem).min(1),
});
