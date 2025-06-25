import { NextResponse } from "next/server";
import { EMPLOYEES_DATA, COMPETENCY_LEVELS } from "@/lib/data"; // Import your hardcoded data

export async function GET() {
  try {
    const data = EMPLOYEES_DATA;

    return NextResponse.json({
      employees: data,
      competencyLevels: COMPETENCY_LEVELS,
    });
  } catch (error) {
    console.error("Error fetching skills data:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills data" },
      { status: 500 }
    );
  }
}
