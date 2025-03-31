import { prisma } from "@/lib/prisma";
import { ZMachineSchema } from "@/lib/schema/machine.schema";
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
      { status: 200 },
    )
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    )
  }
}