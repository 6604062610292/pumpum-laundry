import { prisma } from "@/lib/prisma";
import { ZOrderSchema } from "@/lib/schema/order.schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const formBody = await req.json();
  const userBody = ZOrderSchema.safeParse(formBody);
  if (!userBody.success) {
    return NextResponse.json(
      {
        message: userBody.error.flatten(),
      },
      {
        status: 400,
      }
    );
  }

  try {
    const { user_id, booking_date, items } = userBody.data;

    const queue_date = new Date(booking_date).toISOString().split("T")[0];
    const queue_settings = await prisma.queueSettings.findUnique({
      where: {
        date: queue_date,
      },
    });
    if (!queue_settings) {
      return NextResponse.json(
        {
          message: "คิวจองวันนี้ยังไม่เปิด",
        },
        {
          status: 200,
        }
      );
    }

    // ตรวจสอบคิวในวันที่เลือก
    if (queue_settings.current_queue >= queue_settings.max_queue_per_day) {
      return NextResponse.json(
        {
          message: "คิวเต็ม",
        },
        {
          status: 400,
        }
      );
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        user_id,
        booking_date: new Date(booking_date),
        queue_number: (queue_settings.current_queue || 0) + 1,
        status: "PENDING",
        total_price: items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        items: {
          create: items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // Update queue
    if (queue_settings && order) {
      await prisma.queueSettings.update({
        where: {
          id: queue_settings.id,
        },
        data: {
          current_queue: queue_settings.current_queue + 1,
        },
      });
    }

    return NextResponse.json(
      {
        message: "จองสำเร็จ",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
};
