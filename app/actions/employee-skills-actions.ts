"use server";

import {
  updateEmployeeSkillsInDb,
  deleteEmployeeSkillInDb,
  updateEmployeeCategoryNameInDb,
} from "@/lib/skillsDB";
import { Employee } from "@/lib/types";

export async function updateEmployeeSkills(
  employeeId: string,
  category: { name: string; skills: { name: string; level: number }[] }
): Promise<Employee | undefined> {
  return updateEmployeeSkillsInDb(employeeId, category);
}

export async function deleteEmployeeSkill(
  employeeId: string,
  category: { name: string; skills: { name: string; level: number }[] }
): Promise<Employee | undefined> {
  return deleteEmployeeSkillInDb(employeeId, category);
}

export async function updateEmployeeCategoryName(
  employeeId: string,
  oldName: string,
  newName: string
): Promise<Employee | undefined> {
  return updateEmployeeCategoryNameInDb(employeeId, oldName, newName);
}
