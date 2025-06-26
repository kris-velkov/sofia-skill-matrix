import { updateEmployee } from "@/lib/db";
export function updateEmployeeSkillsAction(
  employeeId: string,
  skills: { name: string; level: string }[]
) {
  return updateEmployee(employeeId, { skills });
}
