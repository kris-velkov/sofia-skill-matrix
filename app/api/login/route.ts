import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const password = body?.password;

    if (typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Password must be a string." },
        { status: 400 }
      );
    }

    const adminPassword = process.env.ADMIN_PASSWORD ?? "";
    const userPassword = process.env.USER_PASSWORD ?? "";

    const isAdmin =
      adminPassword &&
      password.length === adminPassword.length &&
      timingSafeEqual(Buffer.from(password), Buffer.from(adminPassword));

    if (isAdmin) {
      return NextResponse.json({ success: true, role: "admin" });
    }

    const isUser =
      userPassword &&
      password.length === userPassword.length &&
      timingSafeEqual(Buffer.from(password), Buffer.from(userPassword));

    if (isUser) {
      return NextResponse.json({ success: true, role: "user" });
    }

    return NextResponse.json(
      { success: false, message: "Invalid password." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
