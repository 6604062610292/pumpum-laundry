import { z } from "zod";

const ZEmail = z.string().email();
const ZName = z.string().min(1);
const ZSurname = z.string().min(1);
const ZPassword = z.string().min(6);
const ZAddress = z.string().min(5);
const ZPhoneNumber = z.string().length(10);

export const ZRegisterSchema = z.object({
  email: ZEmail,
  name: ZName,
  surname: ZSurname,
  password: ZPassword,
  address: ZAddress,
  phone_number: ZPhoneNumber,
});

export const ZLoginSchema = z.object({
  email: ZEmail,
  password: ZPassword,
});
