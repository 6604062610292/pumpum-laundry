"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ZMachineSchema } from "@/lib/schema/machine.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function MachineForm() {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof ZMachineSchema>>({
    resolver: zodResolver(ZMachineSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ZMachineSchema>) {
    toast.loading("กำลังบันทึก", {
      id: "form-toast",
    });
    await axios
      .post("/api/v1/machines", values)
      .then(() => {
        toast.success("บันทึกเครื่องสำเร็จ", {
          id: "form-toast",
        });
        router.refresh();
        form.reset();
      })
      .catch(() => {
        toast.error("เกิดข้อผิดพลาด", {
          id: "form-toast",
        });
      });
  }

  function toggleWindow() {
    setOpen(!open);
  }

  return (
    <div className="space-y-2">
      <div>
        <Button onClick={() => toggleWindow()} className="btn-blue">
          เพิ่มเครื่องซัก
        </Button>
      </div>
      <div className={open ? "block" : "hidden"}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-lg">ชื่อเครื่อง</FormLabel>
                  <Input {...field} />
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
            {/* Submit */}
            <Button className="btn-blue">บันทึก</Button>
          </form>
          <Separator className="mt-4" />
        </Form>
      </div>
    </div>
  );
}
