import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ZLoginSchema } from "@/lib/schema/auth.schema";
import { NextRequest, NextResponse } from "next/server";
import { Scrypt } from "oslo/password";

export const POST = async (req: NextRequest) => {
  const formBody = await req.json();
  const userBody = ZLoginSchema.safeParse(formBody);
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
    const { email, password } = userBody.data;
    // Valid user
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return NextResponse.json(
        {
          message: "ไม่พบบัญชีผู้ใช้",
        },
        {
          status: 409,
        }
      );
    }

    // Verify password
    const scrypt = new Scrypt();
    const is_password_valid = await scrypt.verify(
      user.hashed_password,
      password
    );
    if (!is_password_valid) {
      return NextResponse.json(
        {
          message: "รหัสผ่านไม่ถูกต้อง",
        },
        {
          status: 409,
        }
      );
    }

    // Create session
    const token = generateSessionToken();
    const session = await createSession(token, user.id);
    await setSessionTokenCookie(token, session.expiresAt);

    // Response
    return NextResponse.json(
      {
        message: "เข้าสู่ระบบสำเร็จ",
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
