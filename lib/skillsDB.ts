"use server";

import { supabaseClient } from "./supabase/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";
import { normalizeDepartment } from "@/lib/utils/normalize";

export async function deleteEmployeeSkillInDb(
  employeeId: string,
  skillId: string
): Promise<{ success: boolean; error: PostgrestError | null }> {
  try {
    const { error } = await supabaseClient
      .from("employees_skill_levels")
      .delete()
      .eq("employee_id", employeeId)
      .eq("skill_id", skillId);

    return {
      success: !error,
      error: error,
    };
  } catch (e) {
    console.error("Failed to delete employee skill:", e);
    return {
      success: false,
      error: e as PostgrestError,
    };
  }
}

export async function updateEmployeeCategoryNameInDb(
  categoryId: string,
  oldName: string,
  newName: string
): Promise<PostgrestError | null> {
  const { error } = await supabaseClient
    .from("categories")
    .update({ name: newName })
    .eq("id", categoryId);

  if (error) {
    console.error(
      `Failed to update category name from ${oldName} to ${newName}:`,
      error.message
    );
    return error;
  }

  return null;
}

export async function updateEmployeeSkillsInDb(
  employeeId: string,
  category: {
    name: string;
    skills: { id?: string; name: string; level: number }[];
  }
): Promise<PostgrestError | null> {
  try {
    const { data: categoryData, error: categoryError } = await supabaseClient
      .from("categories")
      .select("id")
      .ilike("name", category.name.trim())
      .maybeSingle();

    if (categoryError || !categoryData) {
      console.error(
        `Category '${category.name}' not found in DB, cannot add skills`
      );
      return categoryError ?? null;
    }

    const categoryId = categoryData.id;
    const skillUpdates = [];

    for (const skill of category.skills) {
      let skillId: string;

      if (skill.id) {
        skillId = skill.id;

        skillUpdates.push(
          supabaseClient
            .from("skills")
            .update({ name: skill.name.trim() })
            .eq("id", skillId)
            .then(({ error }) => {
              if (error) {
                console.error(
                  `Failed to update skill name for ${skillId}:`,
                  error.message
                );
              }
            })
        );
      } else {
        const { data: skillData } = await supabaseClient
          .from("skills")
          .select("id")
          .ilike("name", skill.name.trim())
          .eq("category_id", categoryId)
          .maybeSingle();

        if (skillData) {
          skillId = skillData.id;
        } else {
          const { data: newSkill, error: createError } = await supabaseClient
            .from("skills")
            .insert({
              name: skill.name.trim(),
              category_id: categoryId,
            })
            .select("id")
            .single();

          if (createError || !newSkill) {
            console.error(
              `Failed to create skill '${skill.name}':`,
              createError?.message
            );
            continue;
          }

          skillId = newSkill.id;
        }
      }

      skillUpdates.push(
        supabaseClient
          .from("employees_skill_levels")
          .upsert({
            employee_id: employeeId,
            skill_id: skillId,
            level: skill.level,
          })
          .then(({ error }) => {
            if (error) {
              console.error(
                `Failed to update ${skill.name} for employee ${employeeId}:`,
                error.message
              );
            }
          })
      );
    }
    await Promise.all(skillUpdates);
    return null;
  } catch (error) {
    console.error(`Error updating employee skills:`, error);
    return error as PostgrestError;
  }
}

export async function getEmployeeSkillsGrouped(employeeId: string) {
  const { data, error } = await supabaseClient
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
    console.error("❌ Failed to fetch skills:", error.message);
    return [];
  }

  return groupSkillsByCategoryWithAverage(data);
}

async function getSkillsForDepartment(department: string) {
  const { data, error } = await supabaseClient
    .from("categories")
    .select(
      `
        id,
        name,
        skills (
          id,
          name
        )
      `
    )
    .contains("departments", [department.toLowerCase()]);

  if (error) {
    console.error(
      `❌ Failed to load categories for ${department}:`,
      error.message
    );
    return [];
  }

  return data.flatMap((cat) => cat.skills);
}

export async function assignDefaultLevelsToEmployee(
  employeeId: string,
  department: string
) {
  const skills = await getSkillsForDepartment(department);

  if (skills.length === 0) {
    console.warn(`No skills found for department ${department}`);
    return;
  }

  const payload = skills.map((s) => ({
    employee_id: employeeId,
    skill_id: s.id,
    level: 0,
  }));

  const { error } = await supabaseClient
    .from("employees_skill_levels")
    .insert(payload);

  if (error) {
    console.error(
      `Failed to assign default skill levels for employee ${employeeId}:`,
      error.message
    );
  } else {
    console.log(
      `Assigned ${payload.length} default skills for employee ${employeeId}`
    );
  }
}

export async function groupSkillsByCategoryWithAverage(rawSkills: unknown[]) {
  const grouped = new Map();

  for (const item of rawSkills) {
    const categoryName = item.skills.categories.name;
    const skillName = item.skills.name;
    const skillLevel = item.level;

    if (!grouped.has(categoryName)) {
      grouped.set(categoryName, {
        name: categoryName,
        skills: [],
        totalLevel: 0,
        count: 0,
      });
    }

    const categoryGroup = grouped.get(categoryName);

    categoryGroup.skills.push({ name: skillName, level: skillLevel });
    categoryGroup.totalLevel += skillLevel;
    categoryGroup.count += 1;
  }

  console.log(grouped.values);
  return Array.from(grouped.values()).map((group) => ({
    name: group.name,
    skills: group.skills,
    averageLevel:
      group.count > 0
        ? parseFloat((group.totalLevel / group.count).toFixed(2))
        : 0,
  }));
}

export async function createOrFindCategoryInDb(
  categoryName: string,
  department: string
): Promise<{ id: string; name: string; departments: string[] }> {
  const { data: existingCategory } = await supabaseClient
    .from("categories")
    .select("id, name, departments, default")
    .ilike("name", categoryName.trim())
    .maybeSingle();

  if (existingCategory) {
    const currentDepartments = existingCategory.departments || [];
    const normalizedDepartment = normalizeDepartment(department);

    if (!currentDepartments.includes(normalizedDepartment)) {
      const updatedDepartments = [...currentDepartments, normalizedDepartment];

      const { error: updateError } = await supabaseClient
        .from("categories")
        .update({ departments: updatedDepartments })
        .eq("id", existingCategory.id);

      if (updateError) {
        throw new Error(
          `Failed to update category departments: ${updateError.message}`
        );
      }

      return {
        id: existingCategory.id,
        name: existingCategory.name,
        departments: updatedDepartments,
      };
    }

    return {
      id: existingCategory.id,
      name: existingCategory.name,
      departments: currentDepartments,
    };
  }

  let hasIsOriginalColumn = true;
  try {
    const { error: columnCheckError } = await supabaseClient
      .from("categories")
      .select("default")
      .limit(1);

    if (columnCheckError && columnCheckError.message.includes("column")) {
      hasIsOriginalColumn = false;
    }
  } catch (e) {
    hasIsOriginalColumn = false;
    console.log("Error checking type column:", e);
  }

  const insertData = {
    name: categoryName.trim(),
    departments: [department.toLowerCase().trim()],
  };

  if (hasIsOriginalColumn) {
    insertData["default"] = false;
  }

  const { data: newCategory, error: createError } = await supabaseClient
    .from("categories")
    .insert(insertData)
    .select("id, name, departments")
    .single();

  if (createError || !newCategory) {
    console.error("❌ Failed to create category:", createError?.message);
    throw new Error(`Failed to create category: ${createError?.message}`);
  }

  return {
    id: newCategory.id,
    name: newCategory.name,
    departments: newCategory.departments,
  };
}
export async function deleteCategoryInDb(categoryId: string): Promise<{
  success: boolean;
  isOriginal?: boolean;
  error?: PostgrestError;
}> {
  try {
    let hasIsOriginalColumn = true;
    try {
      const { error: columnCheckError } = await supabaseClient
        .from("categories")
        .select("default")
        .limit(1);

      if (columnCheckError && columnCheckError.message.includes("column")) {
        hasIsOriginalColumn = false;
        console.log("default column does not exist, skipping original check");
      }
    } catch (e) {
      hasIsOriginalColumn = false;
      console.log("Error checking default column:", e);
    }

    if (hasIsOriginalColumn) {
      const { data: categoryData, error: fetchError } = await supabaseClient
        .from("categories")
        .select("default")
        .eq("id", categoryId)
        .single();

      if (fetchError) {
        console.error(
          `Failed to fetch category ${categoryId}:`,
          fetchError.message
        );
        return { success: false, error: fetchError };
      }

      if (categoryData?.default) {
        console.log(
          `Category ${categoryId} is an original category and cannot be deleted`
        );
        return { success: false, isOriginal: true };
      }
    }

    const { data: skillsData } = await supabaseClient
      .from("skills")
      .select("id")
      .eq("category_id", categoryId);

    if (skillsData && skillsData.length > 0) {
      const skillIds = skillsData.map((skill) => skill.id);

      const { error: deleteSkillLevelsError } = await supabaseClient
        .from("employees_skill_levels")
        .delete()
        .in("skill_id", skillIds);

      if (deleteSkillLevelsError) {
        console.error(
          `Failed to delete skill levels for category ${categoryId}:`,
          deleteSkillLevelsError.message
        );
        return { success: false, error: deleteSkillLevelsError };
      }

      const { error: deleteSkillsError } = await supabaseClient
        .from("skills")
        .delete()
        .eq("category_id", categoryId);

      if (deleteSkillsError) {
        console.error(
          `Failed to delete skills for category ${categoryId}:`,
          deleteSkillsError.message
        );
        return { success: false, error: deleteSkillsError };
      }
    }

    const { error: deleteCategoryError } = await supabaseClient
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (deleteCategoryError) {
      console.error(
        `Failed to delete category ${categoryId}:`,
        deleteCategoryError.message
      );
      return { success: false, error: deleteCategoryError };
    }
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
