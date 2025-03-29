import { QueueStatus } from "@prisma/client";
import { z } from "zod";

export const ZCustomerQueueSchema = z.object({
  user_id: z.number().int().positive(),
  booking_date: z.coerce.date(),
});

export const ZManageQueueSchema = z.object({
  queue_id: z.string(),
  machine_id: z.number().int().positive(),
  status: z.nativeEnum(QueueStatus),
});
