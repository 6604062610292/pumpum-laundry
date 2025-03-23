"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ZUserSchema } from "@/lib/schema/user.schema";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  user: User;
};

export default function UserForm({ user }: Props) {
  const form = useForm<z.infer<typeof ZUserSchema>>({
    defaultValues: {
      address: "",
      email: user.email,
      name: user.name,
      phone: user.phone ?? "",
      user_id: user.id,
    },
  });

  async function onSubmit(values: z.infer<typeof ZUserSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อ</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>อีเมล</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>เบอร์โทรศัพท์</FormLabel>
              <FormControl>
                <Input type="tel" inputMode="tel" maxLength={10} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ที่อยู่</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Submit */}
        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
          บันทึก
        </Button>
      </form>
    </Form>
  );
}
