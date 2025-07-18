"use server";

import { getEmployees } from "@/lib/employees";

export async function getEmployeesData() {
  try {
    const data = await getEmployees();
    return data;
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    throw new Error("Failed to fetch employees.");
  }
}
