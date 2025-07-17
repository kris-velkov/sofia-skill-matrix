"use server";

import {
  updateEmployeeSkillsInDb,
  deleteEmployeeSkillInDb,
  updateEmployeeCategoryNameInDb,
} from "@/lib/skillsDB";
import { Employee } from "@/types/employees";

type SkillCategory = {
  name: string;
  skills: { id?: string; name: string; level: number }[];
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
  skillId: string
): Promise<void> {
  console.log(employeeId, skillId);
  try {
    await deleteEmployeeSkillInDb(employeeId, skillId);
  } catch (error) {
    console.error(`❌ Failed to delete skill for ${employeeId}:`, error);
    throw new Error("Unable to delete employee skill.");
  }
}

export async function updateEmployeeCategoryName(
  employeeId: string,
  categoryId: string,
  oldName: string,
  newName: string
): Promise<void> {
  try {
    await updateEmployeeCategoryNameInDb(
      employeeId,
      categoryId,
      oldName,
      newName
    );
  } catch (error) {
    console.error(`❌ Failed to rename category for ${employeeId}:`, error);
    throw new Error("Unable to update category name.");
  }
}

export async function deleteCategory(
  categoryId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { deleteCategoryInDb } = await import("@/lib/skillsDB");
    const result = await deleteCategoryInDb(categoryId);

    if (result.success) {
      return {
        success: true,
        message: "Category and associated skills deleted successfully",
      };
    } else {
      if (result.isOriginal) {
        return {
          success: false,
          message: "Cannot delete original system categories",
        };
      }
      return {
        success: false,
        message: result.error?.message || "Failed to delete category",
      };
    }
  } catch (error) {
    console.error(`❌ Failed to delete category ${categoryId}:`, error);
    throw new Error("Unable to delete category.");
  }
}

export async function createOrFindCategory(
  categoryName: string,
  department: string
): Promise<{ id: string; name: string; departments: string[] }> {
  try {
    const { createOrFindCategoryInDb } = await import("@/lib/skillsDB");
    return await createOrFindCategoryInDb(categoryName, department);
  } catch (error) {
    console.error(`❌ Failed to create/find category ${categoryName}:`, error);
    throw new Error("Unable to create or find category.");
  }
}
