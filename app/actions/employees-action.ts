"use server";

import { getEmployees, getEmployeesByProgram } from "@/lib/employees";
import { requireAuth } from "./auth-action";

export async function getAllEmployees() {
  try {
    const employees = await getEmployees();

    return employees;
  } catch (error) {
    console.error("Error fetching all employees:", error);
    throw new Error("Failed to fetch all employees.");
  }
}
export async function getEmployeesByProgramName() {
  try {
    const user = await requireAuth();

    const employees = await getEmployeesByProgram(user.program);

    return employees;
  } catch (error) {
    console.error("Error fetching employees by program:", error);
    throw new Error("Failed to fetch employees by program.");
  }
}
