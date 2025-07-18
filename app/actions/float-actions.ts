"use server";

interface FloatUserResponse {
  isBooked: boolean | null;
  found: boolean;
  error?: string;
  message?: string;
  userData?: {
    name: string;
    email: string;
    jobTitle?: string;
    department?: string;
  };
  taskCount?: number;
}

export async function fetchFloatUserInfo(
  floatId: string
): Promise<FloatUserResponse> {
  if (!floatId) {
    return {
      found: false,
      isBooked: null,
      message: "No Float ID provided",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const url = `${baseUrl}/api/float-user?floatId=${encodeURIComponent(
    floatId
  )}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      cache: "no-cache",
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(
        `Float API request failed: ${res.status} ${res.statusText}`
      );
      return {
        isBooked: null,
        found: false,
        error: data.error || `Request failed with status ${res.status}`,
        message: data.message || "Failed to fetch user information from Float",
      };
    }

    if (data.found === false) {
      return {
        isBooked: null,
        found: false,
        message:
          data.message || `No user with ID ${floatId} found in Float system`,
        error: data.error,
      };
    }

    return {
      isBooked: data.isBooked,
      found: data.found,
      userData: data.userData,
      taskCount: data.taskCount,
      message: data.message,
    };
  } catch (error) {
    return {
      found: false,
      isBooked: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
      message: "Failed to communicate with Float API",
    };
  }
}
