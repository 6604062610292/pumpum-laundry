import { QueueStatus } from "@prisma/client";
import { z } from "zod";

export const ZCustomerQueueSchema = z.object({
  user_id: z.number().int().positive(),
  booking_date: z.date(),
  start_time: z.date(),
  machine_id: z.number().int().positive(),
});

export const ZManageQueueSchema = z.object({
  queue_id: z.string(),
  machine_id: z.number().int().positive(),
  status: z.nativeEnum(QueueStatus),
});
