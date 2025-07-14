"use server";

import { getEmployees } from "@/lib/db";

export async function getAllEmployees() {
  try {
    return await getEmployees();
  } catch (error) {
    console.error("❌ Failed to fetch employees:", error);
    throw new Error("Unable to load employees at this time.");
  }
}
