import { z } from "zod";

const ZEmail = z.string().email();
const ZName = z.string();
const ZSurname = z.string();
const ZPassword = z.string();
const ZPhoneNumber = z.string().length(10);

export const ZRegisterSchema = z.object({
  email: ZEmail,
  name: ZName,
  surname: ZSurname,
  password: ZPassword,
  phone_number: ZPhoneNumber,
});

export const ZLoginSchema = z.object({
  email: ZEmail,
  password: ZPassword,
});
