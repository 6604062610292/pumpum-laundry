"use client";

import { ZMachineEditSchema } from "@/lib/schema/machine.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Machine } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface Props {
  machine: Machine;
}

export default function MachineManageModal(props: Props) {
  const { machine } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof ZMachineEditSchema>>({
    resolver: zodResolver(ZMachineEditSchema),
    defaultValues: {
      id: machine.id,
      is_active: machine.is_active,
      name: machine.name,
    },
  });

  async function onSubmit(values: z.infer<typeof ZMachineEditSchema>) {
    setIsSubmitting(true);
    const response = await axios.patch("/api/v1/machines", values);
    const { error, message } = response.data;
    if (error) {
      toast.error(error ?? "เกิดข้อผิดพลาด");
    } else {
      toast.success(message);
    }
    router.refresh();
    setIsSubmitting(false);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant={"ghost"}>
          <Menu size={24} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="w-full flex justify-start">
            {machine.name}
          </AlertDialogTitle>
          <AlertDialogDescription className="w-full grid grid-cols-2">
            ID: {machine.id}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* Form */}
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อเครื่อง</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Is active */}
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      สถานะเครื่อง (พร้อมใช้งาน / เลิกใช้งาน)
                    </FormLabel>
                    <Switch
                      className="data-[state=checked]:bg-green-500"
                      checked={Boolean(field.value)}
                      onCheckedChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Submit */}
              <Button
                disabled={isSubmitting}
                type="submit"
                className="bg-green-500 hover:bg-green-600"
              >
                บันทึก
              </Button>
            </form>
          </Form>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>ปิด</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
