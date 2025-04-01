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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

export default function RegisterForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof ZRegisterSchema>>({
    resolver: zodResolver(ZRegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      phone_number: "",
      address: "",
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
    <div className="w-full bg-white shadow-lg max-w-xs md:max-w-[300px] border p-4 space-y-2 rounded-lg">
      <div className="flex flex-col gap-1 items-center">
        <Image src={"/logo.png"} alt="Logo" width={256} height={256} />
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
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>ชื่อจริง</FormLabel>
                <FormControl>
                  <Input placeholder="ชื่อจริง" {...field} />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          {/* Surname */}
          <FormField
            control={form.control}
            name="surname"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>นามสกุล</FormLabel>
                <FormControl>
                  <Input placeholder="นามสกุล" {...field} />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>รหัสผ่าน</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="กรอกรหัสผ่าน"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>ที่อยู่</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field, fieldState }) => (
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
                <FormMessage>{fieldState.error?.message}</FormMessage>
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
