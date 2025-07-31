"use server";

import { PostgrestError } from "@supabase/supabase-js";
import {
  groupSkillsByCategoryWithAverage,
  checkIfColumnExists,
} from "@/lib/utils/skillsUtils";
import {
  findExistingCategory,
  createNewCategory,
  checkIfOriginalCategory,
  deleteCategory,
  deleteRelatedSkillData,
  getCategoryId,
  getSkillsForDepartment,
  handleExistingCategory,
  processSkills,
} from "@/lib/utils/skillsDbOperations";
import {
  CategoryData,
  CategoryResult,
  CategoryOperationResult,
  SkillOperationResult,
  RawSkillData,
  GroupedCategory,
} from "@/types/skills";
import { createSupabaseServerClient } from "./supabase/server";

export async function deleteEmployeeSkillInDb(
  employeeId: string,
  skillId: string
): Promise<SkillOperationResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("employees_skill_levels")
      .delete()
      .eq("employee_id", employeeId)
      .eq("skill_id", skillId);

    if (error) {
      return {
        success: false,
        error: error,
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    throw new Error(`Failed to delete employee skill: ${errorMessage}`);
  }
}

export async function updateEmployeeCategoryNameInDb(
  categoryId: string,
  oldName: string,
  newName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("categories")
      .update({ name: newName })
      .eq("id", categoryId);

    if (error) {
      return {
        success: false,
        error: `Failed to update category name from ${oldName} to ${newName}: ${error.message}`,
      };
    }

    return { success: true };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    throw new Error(`Failed to update category name: ${errorMessage}`);
  }
}

export async function updateEmployeeSkillsInDb(
  employeeId: string,
  category: CategoryData
): Promise<{ success: boolean; error?: string }> {
  try {
    const categoryId = await getCategoryId(category.name);
    if (!categoryId) {
      return {
        success: false,
        error: `Category '${category.name}' not found in database`,
      };
    }

    const skillUpdatePromises = await processSkills(
      employeeId,
      categoryId,
      category.skills
    );

    await Promise.all(skillUpdatePromises);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update employee skills: ${errorMessage}`);
  }
}

export async function getEmployeeSkillsGrouped(
  employeeId: string
): Promise<{ success: boolean; data?: GroupedCategory[]; error?: string }> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("employees_skill_levels")
      .select(
        `
          level,
          skills (
            name,
            categories (
              name
            )
          )
        `
      )
      .eq("employee_id", employeeId);

    if (error) {
      return {
        success: false,
        error: `Failed to fetch skills: ${error.message}`,
      };
    }

    const groupedData = groupSkillsByCategoryWithAverage(
      data as RawSkillData[]
    );
    return {
      success: true,
      data: groupedData,
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    throw new Error(`Failed to fetch employee skills: ${errorMessage}`);
  }
}

export async function assignDefaultLevelsToEmployee(
  employeeId: string,
  department: string
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const skills = await getSkillsForDepartment(department);

    if (skills.length === 0) {
      return {
        success: false,
        error: `No skills found for department ${department}`,
      };
    }

    const payload = skills.map((s) => ({
      employee_id: employeeId,
      skill_id: s.id,
      level: 0,
    }));

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("employees_skill_levels")
      .insert(payload);

    if (error) {
      return {
        success: false,
        error: `Failed to assign default skill levels: ${error.message}`,
      };
    }

    return {
      success: true,
      count: payload.length,
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    throw new Error(`Failed to assign default skill levels: ${errorMessage}`);
  }
}

export async function createOrFindCategoryInDb(
  categoryName: string,
  department: string
): Promise<CategoryResult> {
  const existingCategory = await findExistingCategory(categoryName);
  if (existingCategory) {
    return handleExistingCategory(existingCategory, department);
  }

  return createNewCategory(categoryName, department);
}

export async function deleteCategoryInDb(
  categoryId: string
): Promise<CategoryOperationResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const hasDefaultColumn = await checkIfColumnExists(
      "categories",
      "default",
      supabase
    );

    if (hasDefaultColumn) {
      const isOriginalCategory = await checkIfOriginalCategory(categoryId);
      if (isOriginalCategory) {
        return { success: false, isOriginal: true };
      }
    }

    await deleteRelatedSkillData(categoryId);
    await deleteCategory(categoryId);

    return { success: true };
  } catch (e) {
    console.error(`Unexpected error deleting category ${categoryId}:`, e);
    return {
      success: false,
      error:
        e instanceof Error
          ? ({ message: e.message } as PostgrestError)
          : undefined,
    };
  }
}
