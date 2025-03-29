"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ZCustomerQueueSchema } from "@/lib/schema/order.schema";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TimePickerDemo } from "../datetime-picker/time-picker-demo";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  user_id: number;
};

export default function CustomerQueueForm({ user_id }: Props) {
  const router = useRouter();

  const form = useForm<z.infer<typeof ZCustomerQueueSchema>>({
    defaultValues: {
      booking_date: new Date(),
      user_id: user_id,
    },
  });

  async function onSubmit(values: z.infer<typeof ZCustomerQueueSchema>) {
    toast.loading("กำลังจองคิว", {
      id: "form-toast",
    });
    await axios
      .post("/api/v1/queues", values)
      .then(() => {
        toast.success("จองคิวสำเร็จ", {
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

  return (
    <div className="space-y-2">
      <h1 className="text-4xl">จองคิว</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Book date picker */}
          <FormField
            control={form.control}
            name="booking_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-left text-lg">เลือกเวลา</FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP HH:mm")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <TimePickerDemo
                        setDate={field.onChange}
                        date={field.value}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          {/* Submit */}
          <Button size="lg" className="btn-blue text-lg w-full">
            จองคิว
          </Button>
        </form>
      </Form>
    </div>
  );
}
