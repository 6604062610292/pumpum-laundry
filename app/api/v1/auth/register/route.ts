import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ZRegisterSchema } from "@/lib/schema/auth.schema";
import { NextRequest, NextResponse } from "next/server";
import { Scrypt } from "oslo/password";

export const POST = async (req: NextRequest) => {
  const formBody = await req.json();
  const userBody = ZRegisterSchema.safeParse(formBody);
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
    const { name, surname, email, password, address, phone_number } =
      userBody.data;

    // Check if email is in-use
    const email_exist = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (email_exist) {
      return NextResponse.json(
        {
          message: "มีผู้ใช้อีเมลดังกล่าวแล้ว",
        },
        {
          status: 409,
        }
      );
    }

    // Check if name already exist
    const name_exist = await prisma.user.findFirst({
      where: {
        name: name + " " + surname,
      },
    });
    if (name_exist) {
      return NextResponse.json(
        {
          message: "มีชื่อผู้ใช้อยู่ในระบบแล้ว",
        },
        {
          status: 409,
        }
      );
    }

    // Hash password
    const scrypt = new Scrypt();
    const hashed_password = await scrypt.hash(password);

    // Create an user
    const new_user = await prisma.user.create({
      data: {
        email,
        name: name + " " + surname,
        hashed_password,
        phone: phone_number,
        address,
      },
    });

    // Create session
    const token = generateSessionToken();
    const session = await createSession(token, new_user.id);
    await setSessionTokenCookie(token, session.expiresAt);

    // Response
    return NextResponse.json(
      {
        message: "สร้างบัญชีสำเร็จ",
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
