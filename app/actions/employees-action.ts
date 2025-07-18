"use server";

import { getEmployees } from "@/lib/employees";

export async function getEmployeesData() {
  try {
    return await getEmployees();
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    throw new Error("Failed to fetch employees.");
  }
}
