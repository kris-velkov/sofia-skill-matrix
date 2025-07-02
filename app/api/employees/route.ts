export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getEmployees } from "@/lib/db";

export async function GET(): Promise<NextResponse> {
  try {
    const employees = await getEmployees();

    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error("Error fetching employees:", error);

    return NextResponse.json(
      { error: "Unable to retrieve employees at this time." },
      { status: 500 }
    );
  }
}
