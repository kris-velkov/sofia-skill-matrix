"use server";

import {
  updateEmployeeSkillsInDb,
  deleteEmployeeSkillInDb,
  updateEmployeeCategoryNameInDb,
} from "@/lib/skillsDB";
import { canEditEmployees, requireAuth } from "./auth-action";

type SkillCategory = {
  name: string;
  skills: { id?: string; name: string; level: number }[];
};

export async function updateEmployeeSkills(
  employeeId: string,
  category: SkillCategory
): Promise<{ success: boolean; message: string }> {
  try {
    const hasEditPermission = await canEditEmployees();

    if (!hasEditPermission) {
      return {
        success: false,
        message: "Access denied. Employee editing permission required",
      };
    }

    const result = await updateEmployeeSkillsInDb(employeeId, category);
    if (!result.success) {
      return {
        success: false,
        message: result.error || "Failed to update employee skills",
      };
    }

    return {
      success: true,
      message: "Skills updated successfully",
    };
  } catch (error) {
    console.error(`Failed to update skills for ${employeeId}:`, error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update employee skills",
    };
  }
}

export async function deleteEmployeeSkill(
  employeeId: string,
  skillId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const hasEditPermission = await canEditEmployees();

    if (!hasEditPermission) {
      return {
        success: false,
        message: "Access denied. Employee editing permission required",
      };
    }

    if (!skillId || skillId.trim() === "") {
      return {
        success: true,
        message: "Please, save the category to be able to removed successfully",
      };
    }

    const result = await deleteEmployeeSkillInDb(employeeId, skillId);
    if (!result.success) {
      return {
        success: false,
        message: result.error?.message || "Failed to delete employee skill",
      };
    }
    return {
      success: true,
      message: "Skill deleted successfully",
    };
  } catch (error) {
    console.error(`Failed to delete skill:`, error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete employee skill",
    };
  }
}

export async function updateEmployeeCategoryName(
  categoryId: string,
  oldName: string,
  newName: string
): Promise<{ success: boolean; message: string }> {
  try {
    const hasEditPermission = await canEditEmployees();

    if (!hasEditPermission) {
      return {
        success: false,
        message: "Access denied. Employee editing permission required",
      };
    }

    const result = await updateEmployeeCategoryNameInDb(
      categoryId,
      oldName,
      newName
    );

    if (!result.success) {
      return {
        success: false,
        message: result.error || "Failed to update category name",
      };
    }

    return {
      success: true,
      message: `Category name updated from "${oldName}" to "${newName}"`,
    };
  } catch (error) {
    console.error(`Failed to rename category.`, error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update category name",
    };
  }
}

export async function deleteCategory(
  categoryId: string
): Promise<{ success: boolean; message: string }> {
  if (!categoryId) {
    return {
      success: false,
      message: "Invalid category ID provided",
    };
  }

  try {
    const hasEditPermission = await canEditEmployees();

    if (!hasEditPermission) {
      return {
        success: false,
        message: "Access denied. Employee editing permission required",
      };
    }

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
    console.error(`Failed to delete category ${categoryId}:`, error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to delete category",
    };
  }
}

export async function createOrFindCategory(
  categoryName: string,
  department: string
): Promise<{
  id: string;
  success: boolean;
  data?: { id: string; name: string; departments: string[] };
  message?: string;
}> {
  try {
    const hasEditPermission = await canEditEmployees();

    if (!hasEditPermission) {
      return {
        id: "",
        success: false,
        message: "Access denied. Employee editing permission required",
      };
    }

    const { createOrFindCategoryInDb } = await import("@/lib/skillsDB");
    const result = await createOrFindCategoryInDb(categoryName, department);

    return {
      id: result.id,
      success: true,
      data: result,
    };
  } catch (error) {
    console.error(`Failed to create/find category ${categoryName}:`, error);
    return {
      id: "",
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create or find category",
    };
  }
}
