"use server";

import { updateEmployeePersonalInfoInDb } from "@/lib/employeeInfoDB";
import { Employee } from "@/types/employees";
import { revalidatePath } from "next/cache";
import { canEditEmployees } from "./auth-action";

export async function updateEmployeePersonalInfo(
  employeeId: string,
  data: Partial<Employee>
) {
  try {
    const hasEditPermission = await canEditEmployees();

    if (!hasEditPermission) {
      throw new Error("Access denied. Employee editing permission required");
    }

    const res = await updateEmployeePersonalInfoInDb(employeeId, data);

    revalidatePath("/employees");
    revalidatePath("/");
    revalidatePath(`employees/${employeeId}`);

    return res;
  } catch (error) {
    console.error(
      `Failed to update personal info for employee ${employeeId}:`,
      error
    );
    throw new Error("Unable to update employee information.");
  }
}
