"use server";

import { getEmployeeAiToolsInDb } from "@/lib/aiToolsDB";
import { requireAuth } from "./auth-action";

export async function getAllEmployeesAiTools() {
  try {
    const user = await requireAuth();

    if (user.role !== "admin" && !user.program) {
      throw new Error(
        "Access denied: Admin role required or valid program not found."
      );
    }

    return await getEmployeeAiToolsInDb(user.program);
  } catch (error) {
    console.error("Failed to fetch employee AI tools:", error);
    throw new Error("Unable to load employee AI tools at this time.");
  }
}
