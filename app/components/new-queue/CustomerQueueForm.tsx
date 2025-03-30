"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import moment from "moment";
import { useState } from "react";
import { Machine } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  user_id: number;
};

export default function CustomerQueueForm({ user_id }: Props) {
  const router = useRouter();
  const [availableMachine, setAvailableMachine] = useState<Machine[]>([]);

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
        router.push("/my-queue");
        form.reset();
      })
      .catch(() => {
        toast.error("เกิดข้อผิดพลาด", {
          id: "form-toast",
        });
      });
  }

  async function getAvailableMachines() {
    try {
      const response = await axios.get(
        `/api/v1/machines/available/${form.getValues().booking_date}`
      );
      console.log(response.data);
      setAvailableMachine(response.data["data"] ?? []);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <h1 className="text-3xl">จองคิว</h1>
        <BackButton />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Book date picker */}
          <FormField
            control={form.control}
            name="booking_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>วันที่จอง</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        moment(date)
                          .startOf("day")
                          .isBefore(moment().startOf("day"))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Machine dropdown */}
          <FormField
            control={form.control}
            name="machine_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>เครื่องซัก</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableMachine &&
                      availableMachine.map((am) => (
                        <SelectItem key={am.id} value={am.id.toString()}>
                          {am.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Check available machine */}
          <Button
            className="bg-orange-400 hover:bg-orange-500"
            onClick={() => getAvailableMachines()}
          >
            ดูเครื่องพร้อมใช้งาน
          </Button>
          {/* Submit */}
          <Button
            disabled={form.getValues().machine_id}
            size="lg"
            className="btn-blue text-lg w-full"
          >
            จองคิว
          </Button>
        </form>
      </Form>
    </div>
  );
}
