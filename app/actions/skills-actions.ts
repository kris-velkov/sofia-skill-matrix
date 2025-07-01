import {
  addEmployeeSkillInDb,
  updateEmployeeSkillInDb,
  deleteEmployeeSkillInDb,
} from "@/lib/skillsDB";
import { Employee } from "@/lib/types";

export async function addEmployeeSkill(
  employeeId: string,
  skill: { name: string; level: number }
): Promise<Employee | undefined> {
  return addEmployeeSkillInDb(employeeId, skill);
}

export async function updateEmployeeSkill(
  employeeId: string,
  skill: { name: string; level: number }
): Promise<Employee | undefined> {
  return updateEmployeeSkillInDb(employeeId, skill);
}

export async function deleteEmployeeSkill(
  employeeId: string,
  skillName: string
): Promise<Employee | undefined> {
  return deleteEmployeeSkillInDb(employeeId, skillName);
}
