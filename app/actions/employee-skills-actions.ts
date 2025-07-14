"use server";

import {
  updateEmployeeSkillsInDb,
  deleteEmployeeSkillInDb,
  updateEmployeeCategoryNameInDb,
} from "@/lib/skillsDB";
import { Employee } from "@/lib/types";

type SkillCategory = {
  name: string;
  skills: { name: string; level: number }[];
};

export async function updateEmployeeSkills(
  employeeId: string,
  category: SkillCategory
): Promise<Employee | undefined> {
  try {
    return await updateEmployeeSkillsInDb(employeeId, category);
  } catch (error) {
    console.error(`❌ Failed to update skills for ${employeeId}:`, error);
    throw new Error("Unable to update employee skills.");
  }
}

export async function deleteEmployeeSkill(
  employeeId: string,
  category: SkillCategory
): Promise<Employee | undefined> {
  try {
    return await deleteEmployeeSkillInDb(employeeId, category);
  } catch (error) {
    console.error(`❌ Failed to delete skill for ${employeeId}:`, error);
    throw new Error("Unable to delete employee skill.");
  }
}

export async function updateEmployeeCategoryName(
  employeeId: string,
  oldName: string,
  newName: string
): Promise<Employee | undefined> {
  try {
    return await updateEmployeeCategoryNameInDb(employeeId, oldName, newName);
  } catch (error) {
    console.error(`❌ Failed to rename category for ${employeeId}:`, error);
    throw new Error("Unable to update category name.");
  }
}
