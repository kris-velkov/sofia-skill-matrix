"use server";

import { getEmployeeAiToolsInDb } from "@/lib/aiToolsDB";
import { requireStatisticsViewing } from "./auth-action";

export async function getAllEmployeesAiTools() {
  try {
    const user = await requireStatisticsViewing();

    return await getEmployeeAiToolsInDb(user.program);
  } catch (error) {
    console.error("Failed to fetch employee AI tools:", error);
    throw error;
  }
}
