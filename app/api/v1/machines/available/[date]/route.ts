import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ date: Date }> }
) => {
  try {
    const { date } = await params;
    // console.log(date);

    const reserved = await prisma.queue.findMany({
      where: {
        startTime: {
          gte: new Date(date),
          lte: new Date(date),
        },
        NOT: {
          machineId: null,
        },
      },
      select: {
        machineId: true,
      },
    });

    const available_machines = await prisma.machine.findMany({
      where: {
        id: {
          notIn: reserved.map((r) => r.machineId) as number[],
        },
      },
    });

    return NextResponse.json(
      {
        data: available_machines,
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
