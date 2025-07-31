"use server";

import { getEmployees, getEmployeesByProgram } from "@/lib/employees";
import { requireEmployeeManagement } from "./auth-action";

export async function getAllEmployees() {
  try {
    const employees = await getEmployees();

    return employees;
  } catch (error) {
    console.error("Error fetching all employees:", error);
    throw error;
  }
}
export async function getEmployeesByProgramName() {
  try {
    const user = await requireEmployeeManagement();

    const employees = await getEmployeesByProgram(user.program);

    return employees;
  } catch (error) {
    console.error("Error fetching employees by program:", error);
    throw error;
  }
}
