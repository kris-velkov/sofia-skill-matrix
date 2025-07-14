"use server";

import { updateEmployeePersonalInfoInDb } from "@/lib/employeeInfoDB";
import { Employee } from "@/lib/types";

export async function updateEmployeePersonalInfo(
  employeeId: string,
  data: Partial<Employee>
) {
  try {
    return await updateEmployeePersonalInfoInDb(employeeId, data);
  } catch (error) {
    console.error(
      `❌ Failed to update personal info for employee ${employeeId}:`,
      error
    );
    throw new Error("Unable to update employee information.");
  }
}
