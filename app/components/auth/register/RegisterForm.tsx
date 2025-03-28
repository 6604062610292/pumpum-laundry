"use client";

import { ZRegisterSchema } from "@/lib/schema/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof ZRegisterSchema>>({
    resolver: zodResolver(ZRegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      phone_number: "",
      surname: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ZRegisterSchema>) {
    toast.loading("กำลังสมัครสมาชิก", {
      id: "register-toast",
    });
    await axios
      .post("/api/v1/auth/register", values)
      .then(() => {
        toast.success("สมัครสมาชิกสำเร็จ", {
          id: "register-toast",
        });
        router.push("/");
      })
      .catch(() => {
        toast.error("เกิดข้อผิดพลาด", {
          id: "register-toast",
        });
      });
  }

  return (
    <div className="w-full max-w-xs md:max-w-[300px] border p-4 space-y-2 rounded-lg">
      <div className="flex gap-1 items-center">
        <h1 className="text-2xl">🫧</h1>
        <h1 className="text-2xl">สมัครสมาชิก</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>อีเมล</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@gmail.com"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อจริง (ไม่มีคำนำหน้า)</FormLabel>
                <FormControl>
                  <Input placeholder="กรอกชื่อเล่น" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Surname */}
          <FormField
            control={form.control}
            name="surname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>นามสกุล</FormLabel>
                <FormControl>
                  <Input placeholder="นามสกุล" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>รหัสผ่าน</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="กรอกรหัสผ่าน"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>เบอร์โทรศัพท์</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="tel"
                    placeholder="กรอกเบอร์โทรศัพท์"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-1">
            {/* Submit */}
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 w-full"
            >
              สมัครสมาชิก
            </Button>
            <Link href="/auth/login" passHref>
              <Button variant="link" className="w-full">
                เข้าสู่ระบบ
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
