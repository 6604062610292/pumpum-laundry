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
import moment from "moment-timezone";
import { useState } from "react";
import { Queue } from "@prisma/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import BackButton from "../BackButton";
import { ScrollArea } from "@radix-ui/react-scroll-area";

type Props = {
  user_id: number;
};

type TimeSlot = {
  startTime: Date;
  endTime: Date;
};

function generateTimeSlots(
  startTime: Date,
  endTime: Date,
  slotMinutes = 29
): { id: number; time: TimeSlot }[] {
  const slots = [];
  const end = moment(startTime).endOf("day");
  let current = moment(endTime).startOf("day");
  let id = 1;

  while (current.isBefore(end)) {
    const next = current.clone();
    next.add(slotMinutes, "minutes");
    slots.push({
      id,
      time: { startTime: current.toDate(), endTime: next.toDate() },
    });
    next.add(1, "minutes");
    id += 1;
    current = next;
  }

  return slots;
}

export default function CustomerQueueForm({ user_id }: Props) {
  const router = useRouter();
  const [totalMachine, setTotalMachine] = useState<number>(-1);
  const [timeSlots, setTimeSlots] = useState<{ id: number; time: TimeSlot }[]>(
    []
  );
  const [queues, setQueues] = useState<Queue[]>([]);

  const form = useForm<z.infer<typeof ZCustomerQueueSchema>>({
    defaultValues: {
      booking_date: new Date(),
      user_id: user_id,
    },
  });

  async function onSubmit(values: z.infer<typeof ZCustomerQueueSchema>) {
    values.start_time = moment(values.start_time).toDate();
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
        setTimeSlots([]);
      })
      .catch((err) => {
        console.error(err);
        toast.error("เกิดข้อผิดพลาด", {
          id: "form-toast",
        });
      });
  }

  async function getAvalibleSlotsTime() {
    setTimeSlots([]);
    try {
      const today = moment(form.getValues().booking_date).format("YYYY-MM-DD");
      console.log("today:", today);

      toast.loading("กำลังโหลดข้อมูลของคิว", {
        id: "form-toast",
      });

      let response = await axios.get(`/api/v1/queues?date=${today}`);

      toast.success("โหลดข้อมูลเสร็จสิ้น", {
        id: "form-toast",
      });

      const { queues } = response.data;
      setQueues(queues);

      const start = moment(form.getValues().booking_date)
        .startOf("day")
        .toDate();
      const end = moment(form.getValues().booking_date).endOf("day").toDate();

      const slots = generateTimeSlots(start, end);
      setTimeSlots(slots);

      if (totalMachine <= -1) {
        console.log("fetch");
        response = await axios.get(`/api/v1/machines`);
        setTotalMachine(response.data.count);
      }
    } catch (err) {
      toast.error("เกิดข้อผิดพลาด", {
        id: "form-toast",
      });
      console.error(err);
    }
  }

  function countOverlapQueue(timeSlot: TimeSlot): number {
    const overlappingQueues = queues.filter((q) => {
      const qStart = moment(q.startTime);
      const qEnd = moment(q.endTime);
      return (
        qStart.isBefore(timeSlot.endTime) && qEnd.isAfter(timeSlot.startTime)
      );
    });

    return overlappingQueues.length;
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
          {/* Check available time slot */}
          <Button
            type="button"
            className="bg-orange-400 hover:bg-orange-500"
            onClick={() => getAvalibleSlotsTime()}
          >
            ดูช่วงเวลาที่ว่าง
          </Button>
          {/* Time slot */}
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <>
                {timeSlots.length > 0 && (
                  <FormItem>
                    <FormLabel>
                      วันที่{" "}
                      {moment(timeSlots[0].time.startTime)
                        .tz("Asia/Bangkok")
                        .format("DD MMMM YYYY")}
                    </FormLabel>
                    <FormLabel>เลือกเวลาที่ต้องการ (1 รอบ/30 นาที)</FormLabel>
                    <RadioGroup
                      onValueChange={field.onChange}
                      className="flex flex-col"
                    >
                      <ScrollArea className="h-72 w-full rounded-md border overflow-scroll space-y-2">
                        <div className="p-4 space-y-4">
                          {timeSlots.map((timeSlot, key) => (
                            <div
                              className="flex items-center space-x-2"
                              key={key}
                            >
                              <RadioGroupItem
                                disabled={
                                  moment()
                                    .tz("Asia/Bangkok")
                                    .isAfter(moment(timeSlot.time.startTime)) ||
                                  countOverlapQueue(timeSlot.time) >=
                                    totalMachine
                                }
                                value={timeSlot.time.startTime.toString()}
                                id={key.toString()}
                              />
                              <Label htmlFor={key.toString()}>
                                {moment(timeSlot.time.startTime)
                                  .tz("Asia/Bangkok")
                                  .format("h:mm a")}{" "}
                                -{" "}
                                {moment(timeSlot.time.endTime)
                                  .tz("Asia/Bangkok")
                                  .format("h:mm a")}
                                {moment()
                                  .tz("Asia/Bangkok")
                                  .isAfter(moment(timeSlot.time.startTime))
                                  ? " ปิด ❌"
                                  : countOverlapQueue(timeSlot.time) >=
                                    totalMachine
                                  ? " คิวเต็ม ❌"
                                  : ""}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </RadioGroup>
                  </FormItem>
                )}
              </>
            )}
          />
          {/* Check available machine */}
          {/* <Button
						className="bg-orange-400 hover:bg-orange-500"
						onClick={() => getAvalibleSlotsTime()}
					>
						ดูช่วงเวลาที่ว่าง
					</Button> */}
          {/* Submit */}
          <Button
            // disabled={form.getValues().start_time == null}
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
