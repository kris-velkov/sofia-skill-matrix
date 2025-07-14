import { NextRequest, NextResponse } from "next/server";

const FLOAT_API_URL = process.env.FLOAT_API_URL;
const FLOAT_API_KEY = process.env.FLOAT_API_KEY;

export async function GET(req: NextRequest) {
  const floatId = req.nextUrl.searchParams.get("floatId");

  if (!floatId) {
    return NextResponse.json(
      { error: "Missing floatId", isBooked: null },
      { status: 400 }
    );
  }

  if (!FLOAT_API_URL || !FLOAT_API_KEY) {
    return NextResponse.json(
      { error: "Float API not configured", isBooked: null },
      { status: 500 }
    );
  }

  try {
    const today = new Date();
    const twoMonthsLater = new Date();
    twoMonthsLater.setMonth(today.getMonth() + 2);

    const start = today.toISOString().split("T")[0];
    const end = twoMonthsLater.toISOString().split("T")[0];

    const url = `${FLOAT_API_URL}/tasks?people_id=${encodeURIComponent(
      floatId
    )}&start_date=${start}&end_date=${end}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${FLOAT_API_KEY}`,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Float API request failed`, isBooked: null },
        { status: response.status }
      );
    }

    const tasks = await response.json();
    const isBooked = Array.isArray(tasks) && tasks.length > 0;

    return NextResponse.json(
      { isBooked },
      { status: 200, headers: { "Cache-Control": "s-maxage=60" } }
    );
  } catch (error) {
    console.error("Float API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected error occurred",
        isBooked: null,
      },
      { status: 500 }
    );
  }
}
