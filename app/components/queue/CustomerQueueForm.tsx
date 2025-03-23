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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ZOrderSchema } from "@/lib/schema/order.schema";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Trash, X } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  user_id: number;
};

export default function CustomerQueueForm({ user_id }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof ZOrderSchema>>({
    defaultValues: {
      booking_date: new Date().toString(),
      items: [],
      user_id: user_id,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  async function onSubmit(values: z.infer<typeof ZOrderSchema>) {
    console.log(values);
  }

  function toggleOpen() {
    setOpen(!open);
  }

  return (
    <div className={cn(open && "space-y-4")}>
      <div>
        {open ? (
          <Button onClick={toggleOpen}>
            <X />
            ย่อหน้าต่าง
          </Button>
        ) : (
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={toggleOpen}
          >
            จองคิว
          </Button>
        )}
      </div>
      <div className={cn(open ? "block border p-4 rounded-md" : "hidden")}>
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
                        selected={new Date(field.value)}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Product */}
            {/* <FormField
              control={form.control}
              name="items"
              render={({field}) => (
                <FormItem>
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="items"
              render={() => (
                <div>
                  {fields.map((field, index) => (
                    <FormItem
                      key={field.id}
                      className="flex items-end space-x-4 mb-4"
                    >
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>คำอธิบาย</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., เสื้อยืด" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>จำนวน</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 1)
                                }
                                className="max-w-[80px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash />
                      </Button>
                    </FormItem>
                  ))}
                  <Button
                    type="button"
                    className="hover:cursor-pointer bg-green-600 hover:bg-green-700"
                    onClick={() =>
                      append({ description: "", quantity: 1, price: 10 })
                    }
                  >
                    เพิ่มรายการ
                  </Button>
                </div>
              )}
            />
            {/* Summary */}
            <div className="p-2 border rounded-md">
              <div>
                <p className="text-zinc-600">ยอดรวม</p>
                <p className="text-lg">
                  {form
                    .getValues("items")
                    .reduce((sum, item) => sum + item.quantity * item.price, 0)
                    .toFixed(2)}{" "}
                  บาท
                </p>
              </div>
            </div>
            {/* Submit */}
            <Button
              className="btn-blue w-full"
              disabled={form.getValues("items").length === 0}
            >
              บันทึก
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
