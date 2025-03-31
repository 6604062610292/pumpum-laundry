import { z } from "zod";

export const ZMachineSchema = z.object({
  name: z.string().min(1, "โปรดระบุชื่อเครื่องอย่างน้อย 1 ตัวอักษร"),
});

export const ZMachineEditSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  is_active: z.union([z.number(), z.boolean()]),
});
