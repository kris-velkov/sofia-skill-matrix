"use server";

/**
 * Interface for Float user information response
 */
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

/**
 * Fetches user information from Float API
 * @param floatId The Float user ID
 * @returns User information including booking status and user details
 */
export async function fetchFloatUserInfo(
  floatId: string
): Promise<FloatUserResponse> {
  // Return early if no floatId is provided
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
      // Add cache control to prevent stale data
      cache: "no-cache",
    });

    // Parse the response data
    const data = await res.json();

    // Even if the response is not OK, we still want to return the data
    // as our API now returns meaningful error messages with status 200
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

    // If user is not found in Float
    if (data.found === false) {
      return {
        isBooked: null,
        found: false,
        message:
          data.message || `No user with ID ${floatId} found in Float system`,
        error: data.error,
      };
    }

    // Return the successful response with all data
    return {
      isBooked: data.isBooked,
      found: data.found,
      userData: data.userData,
      taskCount: data.taskCount,
      message: data.message,
    };
  } catch (error) {
    console.error("Float API error:", error);
    return {
      found: false,
      isBooked: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
      message: "Failed to communicate with Float API",
    };
  }
}
