import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{
    queue_id: string;
  }>;
}

export const DELETE = async (req: NextRequest, { params }: Props) => {
  try {
    const { queue_id } = await params;
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

    // Delete
    await prisma.queue.delete({
      where: {
        id: queue.id,
      },
    });

    return NextResponse.json(
      {
        message: "ลบคิวสำเร็จ",
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
