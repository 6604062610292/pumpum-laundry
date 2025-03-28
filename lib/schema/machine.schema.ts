import { z } from "zod";

export const ZMachineSchema = z.object({
  name: z.string(),
});
