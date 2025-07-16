"use server";

import { getEmployeeById, getEmployees } from "@/lib/employees";

export async function getEmployeesData() {
  try {
    return await getEmployees();
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    throw new Error("Failed to fetch employees.");
  }
}

export async function getEmployee(employeeId: string) {
  try {
    return await getEmployeeById(employeeId);
  } catch (error) {
    console.error("❌ Error fetching employee:", error);
    throw new Error("Failed to fetch employee.");
  }
}
