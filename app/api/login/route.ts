import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const userPassword = process.env.USER_PASSWORD;

  if (password === adminPassword) {
    return NextResponse.json({ success: true, role: "admin" });
  }
  if (password === userPassword) {
    return NextResponse.json({ success: true, role: "user" });
  }
  return NextResponse.json(
    { success: false, message: "Invalid password" },
    { status: 401 }
  );
}
