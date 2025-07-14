"use server";

import { getDepartments } from "@/lib/db";

export async function getDepartmentsAction(): Promise<string[]> {
  try {
    const response = await getDepartments();

    if (Array.isArray(response)) {
      return response;
    }

    console.warn("⚠️ Invalid departments response:", response);
    return [];
  } catch (error) {
    console.error("❌ Failed to fetch departments:", error);
    return [];
  }
}
