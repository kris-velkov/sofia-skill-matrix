"use server";

import { updateEmployeePersonalInfoInDb } from "@/lib/employeeInfoDB";
import { Employee } from "@/types/employees";
import { revalidatePath } from "next/cache";

export async function updateEmployeePersonalInfo(
  employeeId: string,
  data: Partial<Employee>
) {
  try {
    const res = await updateEmployeePersonalInfoInDb(employeeId, data);
    revalidatePath("employees");
    revalidatePath("statistics");
    revalidatePath("/");
    return res;
  } catch (error) {
    console.error(
      `❌ Failed to update personal info for employee ${employeeId}:`,
      error
    );
    throw new Error("Unable to update employee information.");
  }
}
