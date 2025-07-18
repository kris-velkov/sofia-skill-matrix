"use server";

import { updateEmployeePersonalInfoInDb } from "@/lib/employeeInfoDB";
import { Employee } from "@/types/employees";

export async function updateEmployeePersonalInfo(
  employeeId: string,
  data: Partial<Employee>
) {
  try {
    const res = await updateEmployeePersonalInfoInDb(employeeId, data);

    return res;
  } catch (error) {
    console.error(
      `❌ Failed to update personal info for employee ${employeeId}:`,
      error
    );
    throw new Error("Unable to update employee information.");
  }
}
