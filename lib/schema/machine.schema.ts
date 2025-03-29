import { z } from "zod";

export const ZMachineSchema = z.object({
  name: z.string().min(1, "โปรดระบุชื่อเครื่องอย่างน้อย 1 ตัวอักษร"),
});
