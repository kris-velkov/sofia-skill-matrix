import { NextRequest, NextResponse } from "next/server";

const FLOAT_API_URL = process.env.FLOAT_API_URL;
const FLOAT_API_KEY = process.env.FLOAT_API_KEY;

export async function GET(req: NextRequest) {
  const floatId = req.nextUrl.searchParams.get("floatId");

  if (!floatId) {
    return NextResponse.json(
      { error: "Missing floatId", isBooked: null, found: false },
      { status: 400 }
    );
  }

  if (!FLOAT_API_URL || !FLOAT_API_KEY) {
    return NextResponse.json(
      { error: "Float API not configured", isBooked: null, found: false },
      { status: 500 }
    );
  }

  try {
    const userUrl = `${FLOAT_API_URL}/people/${encodeURIComponent(floatId)}`;
    const userResponse = await fetch(userUrl, {
      headers: {
        Authorization: `Bearer ${FLOAT_API_KEY}`,
      },
      next: { revalidate: 60 },
    });

    if (userResponse.status === 404) {
      return NextResponse.json(
        {
          error: "User not found in Float",
          isBooked: null,
          found: false,
          message: `No user with ID ${floatId} found in Float system`,
        },
        { status: 200 }
      );
    }

    if (!userResponse.ok) {
      return NextResponse.json(
        {
          error: `Float API user request failed with status ${userResponse.status}`,
          isBooked: null,
          found: false,
        },
        { status: userResponse.status }
      );
    }

    const userData = await userResponse.json();

    const today = new Date();
    const twoMonthsLater = new Date();
    twoMonthsLater.setMonth(today.getMonth() + 2);

    const start = today.toISOString().split("T")[0];
    const end = twoMonthsLater.toISOString().split("T")[0];

    const tasksUrl = `${FLOAT_API_URL}/tasks?people_id=${encodeURIComponent(
      floatId
    )}&start_date=${start}&end_date=${end}`;
    const tasksResponse = await fetch(tasksUrl, {
      headers: {
        Authorization: `Bearer ${FLOAT_API_KEY}`,
      },
      next: { revalidate: 60 },
    });

    if (!tasksResponse.ok) {
      return NextResponse.json(
        {
          error: `Float API tasks request failed with status ${tasksResponse.status}`,
          isBooked: null,
          found: true,
          userData: {
            name: userData.name || "Unknown",
            email: userData.email || "No email provided",
          },
        },
        { status: 200 }
      );
    }

    const tasks = await tasksResponse.json();
    const isBooked = Array.isArray(tasks) && tasks.length > 0;

    return NextResponse.json(
      {
        isBooked,
        found: true,
        userData: {
          name: userData.name || "Unknown",
          email: userData.email || "No email provided",
          jobTitle: userData.job_title || "No job title",
          department: userData.department || "No department",
        },
        taskCount: Array.isArray(tasks) ? tasks.length : 0,
      },
      { status: 200, headers: { "Cache-Control": "s-maxage=60" } }
    );
  } catch (error) {
    console.error("Float API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected error occurred",
        isBooked: null,
        found: false,
        message: "An error occurred while fetching data from Float",
      },
      { status: 500 }
    );
  }
}
