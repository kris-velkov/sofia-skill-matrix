"use server";

import { supabaseClient } from "../supabase/supabaseClient";
import { normalizeDepartment, normalizeName } from "./normalize";
import { checkIfColumnExists } from "./skillsUtils";
import { CategoryResult, SkillData } from "@/types/skills";
import { Database } from "@/types/supabase";

export async function updateSkillName(
  skillId: string,
  skillName: string
): Promise<void> {
  const { error } = await supabaseClient
    .from("skills")
    .update({ name: normalizeName(skillName) })
    .eq("id", skillId);

  if (error) {
    throw error;
  }
}

export async function findOrCreateSkill(
  skillName: string,
  categoryId: string
): Promise<string | null> {
  const { data: existingSkill } = await supabaseClient
    .from("skills")
    .select("id")
    .ilike("name", normalizeName(skillName))
    .eq("category_id", categoryId)
    .maybeSingle();

  if (existingSkill) {
    return existingSkill.id;
  }

  return await createNewSkill(skillName, categoryId);
}

export async function createNewSkill(
  skillName: string,
  categoryId: string
): Promise<string | null> {
  const { data: newSkill, error: createError } = await supabaseClient
    .from("skills")
    .insert({
      name: normalizeName(skillName),
      category_id: categoryId,
    })
    .select("id")
    .single();

  if (createError || !newSkill) {
    console.error(
      `Failed to create skill '${normalizeName(skillName)}':`,
      createError?.message
    );
    return null;
  }

  return newSkill.id;
}

export async function updateEmployeeSkillLevel(
  employeeId: string,
  skillId: string,
  level: number
): Promise<void> {
  const { error } = await supabaseClient.from("employees_skill_levels").upsert({
    employee_id: employeeId,
    skill_id: skillId,
    level,
  });

  if (error) {
    console.error(
      `Failed to update skill level for employee ${employeeId}:`,
      error.message
    );
  }
}

export async function findExistingCategory(categoryName: string) {
  const { data } = await supabaseClient
    .from("categories")
    .select("id, name, departments, default")
    .ilike("name", normalizeName(categoryName))
    .maybeSingle();

  return data;
}

export async function updateCategoryDepartments(
  categoryId: string,
  departments: string[]
): Promise<void> {
  const { error } = await supabaseClient
    .from("categories")
    .update({ departments })
    .eq("id", categoryId);

  if (error) {
    throw new Error(`Failed to update category departments: ${error.message}`);
  }
}

export async function createNewCategory(
  categoryName: string,
  department: string
): Promise<CategoryResult> {
  const hasDefaultColumn = await checkIfColumnExists(
    "categories",
    "default",
    supabaseClient
  );

  const insertData: Database["public"]["Tables"]["categories"]["Insert"] = {
    name: normalizeName(categoryName),
    departments: [normalizeDepartment(department)],
  };

  if (hasDefaultColumn) {
    insertData.default = false;
  }

  const { data, error } = await supabaseClient
    .from("categories")
    .insert(insertData)
    .select("id, name, departments")
    .single();

  if (error || !data) {
    console.error("❌ Failed to create category:", error?.message);
    throw new Error(`Failed to create category: ${error?.message}`);
  }

  return {
    id: data.id,
    name: data.name,
    departments: data.departments || [],
  };
}

export async function checkIfOriginalCategory(
  categoryId: string
): Promise<boolean> {
  const { data, error } = await supabaseClient
    .from("categories")
    .select("default")
    .eq("id", categoryId)
    .single();

  if (error) {
    console.error(`Failed to fetch category ${categoryId}:`, error.message);
    throw error;
  }

  if (data?.default) {
    return true;
  }

  return false;
}

export async function getSkillIdsForCategory(
  categoryId: string
): Promise<string[]> {
  const { data } = await supabaseClient
    .from("skills")
    .select("id")
    .eq("category_id", categoryId);

  return data ? data.map((skill) => skill.id) : [];
}

export async function deleteSkillLevels(skillIds: string[]): Promise<void> {
  const { error } = await supabaseClient
    .from("employees_skill_levels")
    .delete()
    .in("skill_id", skillIds);

  if (error) {
    console.error(`Failed to delete skill levels:`, error.message);
    throw error;
  }
}

export async function deleteSkills(categoryId: string): Promise<void> {
  const { error } = await supabaseClient
    .from("skills")
    .delete()
    .eq("category_id", categoryId);

  if (error) {
    console.error(
      `Failed to delete skills for category ${categoryId}:`,
      error.message
    );
    throw error;
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const { error } = await supabaseClient
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    console.error(`Failed to delete category ${categoryId}:`, error.message);
    throw error;
  }
}

export async function getCategoryId(
  categoryName: string
): Promise<string | null> {
  const normalizedCategoryName = normalizeName(categoryName);
  const { data: categoryData, error: categoryError } = await supabaseClient
    .from("categories")
    .select("id")
    .ilike("name", normalizeName(normalizedCategoryName).trim())
    .maybeSingle();

  if (categoryError || !categoryData) {
    console.error(
      `Category '${normalizedCategoryName}' not found in DB, cannot add skills`
    );
    return null;
  }

  return categoryData.id;
}

export async function processSkills(
  employeeId: string,
  categoryId: string,
  skills: SkillData[]
): Promise<Promise<void>[]> {
  const skillUpdatePromises: Promise<void>[] = [];

  for (const skill of skills) {
    const skillId = await getOrCreateSkillId(skill, categoryId);
    if (!skillId) continue;

    skillUpdatePromises.push(
      updateEmployeeSkillLevel(employeeId, skillId, skill.level)
    );
  }

  return skillUpdatePromises;
}

export async function getOrCreateSkillId(
  skill: SkillData,
  categoryId: string
): Promise<string | null> {
  if (skill.id) {
    await updateSkillName(skill.id, skill.name);
    return skill.id;
  }

  return await findOrCreateSkill(skill.name, categoryId);
}

export async function handleExistingCategory(
  existingCategory: {
    id: string;
    name: string;
    departments: string[] | null;
    default?: boolean | null;
  },
  department: string
): Promise<CategoryResult> {
  const currentDepartments = existingCategory.departments || [];
  const normalizedDepartment = normalizeDepartment(department);

  if (!currentDepartments.includes(normalizedDepartment)) {
    const updatedDepartments = [...currentDepartments, normalizedDepartment];
    await updateCategoryDepartments(existingCategory.id, updatedDepartments);
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

export async function getSkillsForDepartment(
  department: string
): Promise<Array<{ id: string; name: string }>> {
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

export async function deleteRelatedSkillData(
  categoryId: string
): Promise<void> {
  const skillIds = await getSkillIdsForCategory(categoryId);

  if (skillIds.length > 0) {
    await deleteSkillLevels(skillIds);
    await deleteSkills(categoryId);
  }
}
