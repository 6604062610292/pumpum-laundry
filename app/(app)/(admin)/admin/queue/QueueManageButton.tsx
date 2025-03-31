"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ZManageQueueSchema, ZStatusEnum } from "@/lib/schema/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Queue, QueueStatus, User } from "@prisma/client";
import axios from "axios";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  queue: Queue & { user: User };
}

export default function QueueManageButton(props: Props) {
  const { queue } = props;

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof ZManageQueueSchema>>({
    resolver: zodResolver(ZManageQueueSchema),
    defaultValues: {
      machine_id: queue.machineId ?? undefined,
      queue_id: queue.id,
      status: queue.status,
    },
  });

  async function onSubmit(values: z.infer<typeof ZManageQueueSchema>) {
    setIsSubmitting(true);
    const response = await axios.patch("/api/v1/queues", values);
    const { error, message } = response.data;
    if (error) {
      toast.error(error ?? "เกิดข้อผิดพลาด");
    } else {
      toast.success(message);
    }
    setIsSubmitting(false);
    router.refresh();
  }

  async function deleteQueue() {
    setIsSubmitting(true);
    const response = await axios.delete(`/api/v1/queues/${queue.id}`);
    const { error, message } = response.data;
    if (error) {
      toast.error(error ?? "เกิดข้อผิดพลาด");
    } else {
      toast.success(message);
    }
    setIsSubmitting(false);
    router.refresh();
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
            คิว {queue.id.slice(0, 5)}
          </AlertDialogTitle>
          <AlertDialogDescription className="w-full grid grid-cols-2">
            {`${queue.user.name.split(" ")[0]}`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>สถานะ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(QueueStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2 md:gap-3 w-fit">
              {/* Delete */}
              <AlertDialogAction asChild>
                <Button
                  onClick={deleteQueue}
                  disabled={isSubmitting}
                  className="bg-red-500 hover:bg-red-600"
                >
                  ลบออกจากระบบ
                </Button>
              </AlertDialogAction>
              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-500 hover:bg-green-600"
              >
                บันทึก
              </Button>
            </div>
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel>ปิด</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
