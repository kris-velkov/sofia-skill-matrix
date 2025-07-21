import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const floatId = req.nextUrl.searchParams.get("floatId");
  const FLOAT_API_URL = process.env.FLOAT_API_URL;
  const FLOAT_API_KEY = process.env.FLOAT_API_KEY;

  if (!floatId?.trim()) {
    return NextResponse.json(
      {
        error: "Missing floatId",
        isBooked: null,
        found: false,
        message: "Float ID is required",
      },
      { status: 400 }
    );
  }

  if (!FLOAT_API_URL || !FLOAT_API_KEY) {
    return NextResponse.json(
      {
        error: "Float API not configured",
        isBooked: null,
        found: false,
        message:
          "The server is not properly configured to connect to Float API",
      },
      { status: 500 }
    );
  }

  try {
    const userResponse = await fetch(
      `${FLOAT_API_URL}/people/${encodeURIComponent(floatId)}`,
      {
        headers: {
          Authorization: `Bearer ${FLOAT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

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
          message: "Failed to retrieve user data from Float API",
        },
        { status: 200 }
      );
    }

    const userData = await userResponse.json();

    const today = new Date();
    const twoMonthsLater = new Date();
    twoMonthsLater.setMonth(today.getMonth() + 2);

    const start = today.toISOString().split("T")[0];
    const end = twoMonthsLater.toISOString().split("T")[0];

    const tasksResponse = await fetch(
      `${FLOAT_API_URL}/tasks?people_id=${encodeURIComponent(
        floatId
      )}&start_date=${start}&end_date=${end}`,
      {
        headers: {
          Authorization: `Bearer ${FLOAT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

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
          message: "User found but unable to retrieve booking information",
        },
        { status: 200 }
      );
    }

    const tasks = await tasksResponse.json();
    const isBooked = Array.isArray(tasks) && tasks.length > 0;
    const taskCount = Array.isArray(tasks) ? tasks.length : 0;

    return NextResponse.json(
      {
        isBooked,
        found: true,
        userData: {
          name: userData.name || "Unknown",
          email: userData.email || "No email provided",
          jobTitle: userData.job_title || undefined,
          department: userData.department || undefined,
        },
        taskCount,
        message: isBooked
          ? `User has ${taskCount} tasks in the next 2 months`
          : "User has no tasks in the next 2 months",
      },
      { status: 200 }
    );
  } catch (error) {
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
