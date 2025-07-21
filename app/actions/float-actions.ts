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
  if (!floatId?.trim()) {
    return {
      found: false,
      isBooked: null,
      message: "No Float ID provided",
    };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(
      `${baseUrl}/float-user?floatId=${encodeURIComponent(floatId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          revalidate: 120,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        isBooked: null,
        found: false,
        error: `API request failed with status ${response.status}`,
        message: `Failed to fetch Float data: ${errorText}`,
      };
    }

    const data = await response.json();

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
