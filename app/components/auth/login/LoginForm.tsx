"use client";

import { ZLoginSchema } from "@/lib/schema/auth.schema";
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

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof ZLoginSchema>>({
    resolver: zodResolver(ZLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ZLoginSchema>) {
    toast.loading("กำลังเข้าสู่ระบบ", {
      id: "login-toast",
    });
    await axios
      .post("/api/v1/auth/login", values)
      .then(() => {
        toast.success("เข้าสู่ระบบสำเร็จ", {
          id: "login-toast",
        });
        router.push("/");
      })
      .catch(() => {
        toast.error("เกิดข้อผิดพลาด", {
          id: "login-toast",
        });
      });
  }

  return (
    <div className="w-full max-w-xs md:max-w-[300px] border p-4 space-y-2 rounded-lg">
      <div className="flex gap-1 items-center">
        <h1 className="text-2xl">🫧</h1>
        <h1 className="text-2xl">เข้าสู่ระบบ</h1>
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
          <div className="grid grid-cols-2 gap-1">
            {/* Submit */}
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 w-full"
            >
              เข้าสู่ระบบ
            </Button>
            <Link href="/auth/register" passHref>
              <Button variant="link" className="w-full">
                สมัครสมาชิก
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
