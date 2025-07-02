"use server";

import { getEmployees } from "@/lib/db";

export async function getAllEmployees() {
  try {
    const employees = await getEmployees();
    return employees;
  } catch (error) {
    throw new Error("Failed to fetch employees");
  }
}
