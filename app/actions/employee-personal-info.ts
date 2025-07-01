"use server";
import { updateEmployeePersonalInfoInDb } from "@/lib/employeeInfoDB";
import { Employee } from "@/lib/types";

export async function updateEmployeePersonalInfo(
  employeeId: string,
  data: Partial<Employee>
) {
  return await updateEmployeePersonalInfoInDb(employeeId, data);
}
