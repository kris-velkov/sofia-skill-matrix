import { NextRequest, NextResponse } from "next/server";

const FLOAT_API_URL = process.env.FLOAT_API_URL;
const FLOAT_API_KEY = process.env.FLOAT_API_KEY;

console.log("FLOAT_API_URL:", FLOAT_API_URL);
console.log("FLOAT_API_KEY:", FLOAT_API_KEY);

async function checkFloatAuth(): Promise<boolean> {
  if (!FLOAT_API_URL || !FLOAT_API_KEY) return false;
  try {
    const res = await fetch(`${FLOAT_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${FLOAT_API_KEY}` },
      next: { revalidate: 60 },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json(
      { found: false, error: "Missing email" },
      { status: 400 }
    );
  }
  if (!FLOAT_API_URL || !FLOAT_API_KEY) {
    return NextResponse.json(
      { found: false, error: "Float API not configured" },
      { status: 500 }
    );
  }

  const isAuth = await checkFloatAuth();
  if (!isAuth) {
    return NextResponse.json(
      { found: false, error: "Float API authentication failed" },
      { status: 401 }
    );
  }

  try {
    // Correct endpoint: /users?email=...
    const userRes = await fetch(
      `${FLOAT_API_URL}/users?email=${encodeURIComponent(email)}`,
      {
        headers: { Authorization: `Bearer ${FLOAT_API_KEY}` },
        next: { revalidate: 60 },
      }
    );
    if (!userRes.ok) {
      return NextResponse.json(
        { found: false, error: `Float user fetch failed: ${userRes.status}` },
        { status: userRes.status }
      );
    }

    const userData = await userRes.json();
    const user = userData?.data?.[0];

    if (!user) {
      return NextResponse.json(
        { found: false, error: "User not found in Float" },
        { status: 404 }
      );
    }

    // Correct endpoint: /assignments?user_id=...&status=active
    const assignmentsRes = await fetch(
      `${FLOAT_API_URL}/assignments?user_id=${user.id}&status=active`,
      {
        headers: { Authorization: `Bearer ${FLOAT_API_KEY}` },
        next: { revalidate: 60 },
      }
    );
    if (!assignmentsRes.ok) {
      return NextResponse.json(
        {
          found: false,
          error: `Float assignments fetch failed: ${assignmentsRes.status}`,
        },
        { status: assignmentsRes.status }
      );
    }
    const assignmentsData = await assignmentsRes.json();
    const assignments: { project_name?: string }[] =
      assignmentsData?.data || [];
    const isFree = assignments.length === 0;
    const projects = Array.from(
      new Set(
        assignments
          .map((a: { project_name?: string }) => a.project_name)
          .filter(Boolean)
      )
    ).sort();

    return NextResponse.json({ found: true, isFree, projects });
  } catch (e: unknown) {
    console.error("Float API error:", e);
    let errorMsg = "Unknown error";
    if (
      typeof e === "object" &&
      e &&
      "message" in e &&
      typeof (e as { message?: unknown }).message === "string"
    ) {
      errorMsg = (e as { message: string }).message;
    }
    return NextResponse.json(
      { found: false, error: errorMsg },
      { status: 500 }
    );
  }
}
