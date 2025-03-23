import { prisma } from "@/lib/prisma";
import { ZUserSchema } from "@/lib/schema/user.schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const formBody = await req.json();
  const userBody = ZUserSchema.safeParse(formBody);
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
    const { user_id, name, email, address, phone } = userBody.data;
    // Find user
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });
    // Invalid user
    if (!user) {
      return NextResponse.json(
        {
          message: "ไม่พบผู้ใช้",
        },
        {
          status: 400,
        }
      );
    }

    // Update user
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        email,
        // TODO: address
        phone,
      },
    });

    return NextResponse.json(
      {
        message: "อัพเดตข้อมูลสำเร็จ",
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
