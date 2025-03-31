import { prisma } from "@/lib/prisma";
import {
  ZMachineEditSchema,
  ZMachineSchema,
} from "@/lib/schema/machine.schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const formBody = await req.json();
  const userBody = ZMachineSchema.safeParse(formBody);
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
    const { name } = userBody.data;
    await prisma.machine.create({
      data: {
        name,
      },
    });

    return NextResponse.json(
      {
        success: true,
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

export const GET = async () => {
  try {
    const numberOfMachine = await prisma.machine.count();
    return NextResponse.json(
      { success: true, count: numberOfMachine },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const PATCH = async (req: NextRequest) => {
  const formBody = await req.json();
  const userBody = ZMachineEditSchema.safeParse(formBody);
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
    const { id, is_active, name } = userBody.data;
    // Is machine valid?
    const machine = await prisma.machine.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
    if (!machine) {
      return NextResponse.json(
        {
          message: "ไม่พบเครื่องดังกล่าว",
        },
        {
          status: 409,
        }
      );
    }

    // Update
    await prisma.machine.update({
      where: {
        id: machine.id,
      },
      data: {
        name,
        is_active: Boolean(is_active),
      },
    });

    return NextResponse.json(
      {
        message: "อัพเดตข้อมูลเครื่องสำเร็จ",
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
