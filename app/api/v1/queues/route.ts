// import { nowInThai } from "@/lib/date/thai/provider";
import { prisma } from "@/lib/prisma";
import { ZManageQueueSchema } from "@/lib/schema/order.schema";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const formBody = await req.json();
  // const userBody = ZCustomerQueueSchema.safeParse(formBody);
  // console.log(userBody);
  // if (!userBody.success) {
  // 	return NextResponse.json(
  // 		{
  // 			message: userBody.error.flatten(),
  // 		},
  // 		{
  // 			status: 400,
  // 		}
  // 	);
  // }

  try {
    const { user_id, start_time } = formBody;

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

    const startTime = new Date(start_time);
    const endTime = new Date(startTime.getTime() + 29 * 60 * 1000);
    const avalibleMachines = await prisma.machine.findMany({
      where: {
        is_active: true,
        is_available: true,
        queues: {
          none: {
            AND: [
              {
                startTime: {
                  lt: endTime,
                },
              },
              {
                endTime: {
                  gt: startTime,
                },
              },
            ],
          },
        },
      },
    });

    if (!avalibleMachines || avalibleMachines.length == 0) {
      return NextResponse.json(
        { message: "Machine Not Avalible" },
        { status: 400 }
      );
    }

    // Create queue
    const newQueue = await prisma.queue.create({
      data: {
        userId: user_id,
        queue_date: new Date(),
        startTime: startTime,
        endTime: new Date(startTime.getTime() + 29 * 60 * 1000),
        machineId: avalibleMachines[0].id,
      },
    });

    // Mark machine as busy
    await prisma.machine.update({
      where: {
        id: avalibleMachines[0].id,
      },
      data: {
        is_available: false,
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

// utility function for check booking date
function isInvalidBookingDate(inputDateStr: string): boolean {
  const today = moment().tz("Asia/Bangkok").startOf("day");
  const inputDate = moment.tz(inputDateStr, "YYYY-MM-DD", "Asia/Bangkok");

  return inputDate.isBefore(today);
}

// query queue via date
export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date");

  if (dateStr == null) {
    return NextResponse.json(
      {
        message: "Required date format YYYY-MM-DD (2024-12-01) for query queue",
      },
      { status: 400 }
    );
  } else if (isInvalidBookingDate(dateStr)) {
    return NextResponse.json(
      { message: "Invalid booking date" },
      { status: 400 }
    );
  }

  try {
    const startOfDay = moment(dateStr)
      .tz("Asia/Bangkok")
      .startOf("day")
      .toDate();
    const endOfDay = moment(dateStr).tz("Asia/Bangkok").endOf("day").toDate();

    const queues = await prisma.queue.findMany({
      where: {
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        machine: true,
      },
    });

    return NextResponse.json({ success: true, queues }, { status: 200 });
  } catch (err: unknown) {
    console.log(err);
  }
};

export const PATCH = async (req: NextRequest) => {
  const formBody = await req.json();
  const userBody = ZManageQueueSchema.safeParse(formBody);
  if (!userBody.success) {
    return NextResponse.json(
      {
        error: userBody.error.flatten(),
      },
      {
        status: 400,
      }
    );
  }

  try {
    const { machine_id, queue_id, status } = userBody.data;
    // Is queue exist?
    const queue = await prisma.queue.findUnique({
      where: {
        id: queue_id,
      },
      select: {
        id: true,
      },
    });
    if (!queue) {
      return NextResponse.json(
        {
          error: "ไม่พบคิวดังกล่าว",
        },
        {
          status: 409,
        }
      );
    }

    // update
    await prisma.queue.update({
      where: {
        id: queue.id,
      },
      data: {
        machineId: machine_id,
        status,
      },
    });

    return NextResponse.json(
      {
        message: "อัพเดตสำเร็จ",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
};
