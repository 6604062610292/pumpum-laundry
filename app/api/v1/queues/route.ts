import { prisma } from "@/lib/prisma";
import { ZCustomerQueueSchema } from "@/lib/schema/order.schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const formBody = await req.json();
  const userBody = ZCustomerQueueSchema.safeParse(formBody);
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
    const { booking_date, user_id } = userBody.data;
    // Validate user
    const validUser = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });
    if (!validUser) {
      return NextResponse.json(
        {
          message: "ไม่พบผู้ใช้งาน",
        },
        {
          status: 400,
        }
      );
    }

    // Create queue
    const newQueue = await prisma.queue.create({
      data: {
        userId: user_id,
        queue_date: new Date(),
        startTime: booking_date,
      },
    });

    return NextResponse.json(
      {
        success: true,
        queue_id: newQueue.id,
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
