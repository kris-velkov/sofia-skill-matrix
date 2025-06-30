"use server";
import { updateEmployeePersonalInfoInDb } from "@/lib/db";
import { Employee } from "@/lib/types";

export async function updateEmployeePersonalInfo(
  employeeId: string,
  data: Partial<Employee>
) {
  return await updateEmployeePersonalInfoInDb(employeeId, data);
}
