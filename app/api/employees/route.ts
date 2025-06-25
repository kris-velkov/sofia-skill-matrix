export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getEmployees } from "@/lib/db";

export async function GET() {
  const employees = await getEmployees();

  return NextResponse.json(employees);
}
