"use server";

import snakecaseKeys from "snakecase-keys";
import { getEmployeeById } from "./db";
import { supabaseClient } from "./supabase/supabaseClient";
import type { Employee, Skill, SkillCategory, SkillLevel } from "./types";
import { DEFAULT_CATEGORIES_FE_BE } from "@/constants/employeeDefaultsSkills";

export async function deleteEmployeeSkillInDb(
  employeeId: string,
  category: { name: string; skills: { name: string; level: number }[] }
): Promise<Employee | undefined> {
  // Get the group ID
  const { data: group, error: groupError } = await supabaseClient
    .from("skill_groups")
    .select("id")
    .eq("employee_id", employeeId)
    .eq("name", category.name)
    .single();

  if (groupError || !group) return undefined;

  // Delete group and cascade delete skills
  const { error } = await supabaseClient
    .from("skill_groups")
    .delete()
    .eq("id", group.id);

  if (error) {
    console.error("Error deleting skill group:", error);
    return undefined;
  }

  return getEmployeeById(employeeId);
}

// 🔁 Update or insert a skill group for an employee
export async function updateEmployeeSkillsInDb(
  employeeId: string,
  category: { name: string; skills: { name: string; level: number }[] }
): Promise<Employee | undefined> {
  const averageLevel =
    category.skills.length > 0
      ? Math.round(
          (category.skills.reduce((acc, s) => acc + s.level, 0) /
            category.skills.length) *
            10
        ) / 10
      : 0;

  // Check if group exists
  const { data: existingGroup, error: groupError } = await supabaseClient
    .from("skill_groups")
    .select("id")
    .eq("employee_id", employeeId)
    .eq("name", category.name)
    .single();

  let groupId: string;

  if (existingGroup) {
    groupId = existingGroup.id;

    await supabaseClient.from("skills").delete().eq("group_id", groupId);

    await supabaseClient
      .from("skill_groups")
      .update({ average_level: averageLevel })
      .eq("id", groupId);
  } else {
    const { data: newGroup, error: insertGroupError } = await supabaseClient
      .from("skill_groups")
      .insert([
        {
          employee_id: employeeId,
          name: category.name,
          average_level: averageLevel,
        },
      ])
      .select()
      .single();

    if (insertGroupError || !newGroup) return undefined;
    groupId = newGroup.id;
  }

  const skills = category.skills.map((s) => ({
    group_id: groupId,
    name: s.name,
    level: s.level as SkillLevel,
  }));

  const { error: insertSkillsError } = await supabaseClient
    .from("skills")
    .insert(skills);

  if (insertSkillsError) {
    console.error("Error inserting skills:", insertSkillsError);
    return undefined;
  }

  return getEmployeeById(employeeId);
}

export async function updateEmployeeCategoryNameInDb(
  employeeId: string,
  oldName: string,
  newName: string
): Promise<Employee | undefined> {
  const { error } = await supabaseClient
    .from("skill_groups")
    .update({ name: newName })
    .eq("employee_id", employeeId)
    .eq("name", oldName);

  if (error) {
    console.error("Error renaming skill group:", error);
    return undefined;
  }

  return getEmployeeById(employeeId);
}

export async function getEmployeeSkills(
  employeeId: string
): Promise<SkillCategory[]> {
  const { data, error } = await supabaseClient
    .from("employee_skills")
    .select(
      `
        id,
        name,
        average_level
        skills:skills (
          name,
          level
        )
      `
    )
    .eq("employee_id", employeeId);

  if (error) throw error;

  return snakecaseKeys(data, { deep: true });
}

export async function createDefaultSkillsForEmployee(
  employeeId: string,
  categories: typeof DEFAULT_CATEGORIES_FE_BE
) {
  for (const category of categories) {
    const { data: group, error: groupError } = await supabaseClient
      .from("employee_skills")
      .insert({
        employee_id: employeeId,
        name: category.name,
        average_level: 0,
      })
      .select("id")
      .single();

    if (groupError || !group)
      throw new Error(`Failed to create group ${category.name}`, groupError);

    const groupId = group.id;

    const skillPayload = category.skills.map((s) => ({
      group_id: groupId,
      name: s.name,
      level: s.level,
    }));

    const { error: skillsError } = await supabaseClient
      .from("skills")
      .insert(skillPayload);

    if (skillsError)
      throw new Error(`Failed to insert skills for group ${category.name}`);
  }
}

type DefaultCategory = {
  id: string;
  name: string;
  skills: { name: string; level: number }[];
};

export async function seedCategories(
  defaultCategories: DefaultCategory[],
  newDepartments: string[]
) {
  for (const cat of defaultCategories) {
    const { data: existingCategory } = await supabaseClient
      .from("categories")
      .select("id, departments")
      .eq("name", cat.name)
      .single();

    let categoryId: string;

    if (existingCategory) {
      const mergedDepartments = Array.from(
        new Set([...(existingCategory.departments || []), ...newDepartments])
      );

      await supabaseClient
        .from("categories")
        .update({ departments: mergedDepartments })
        .eq("id", existingCategory.id);

      categoryId = existingCategory.id;
    } else {
      const { data: newCat, error: catError } = await supabaseClient
        .from("categories")
        .insert({
          name: cat.name,
          departments: newDepartments,
        })
        .select("id")
        .single();

      if (catError) {
        console.error(
          `❌ Failed to insert category ${cat.name}:`,
          catError.message
        );
        continue;
      }

      categoryId = newCat.id;
    }

    const { data: existingSkills } = await supabaseClient
      .from("skills")
      .select("name")
      .eq("category_id", categoryId);

    const existingSkillNames = new Set(
      existingSkills?.map((s: { name: string }) => s.name) || []
    );

    const newSkills = cat.skills.filter((s) => !existingSkillNames.has(s.name));

    if (newSkills.length > 0) {
      const skillPayload = newSkills.map((s, idx) => ({
        category_id: categoryId,
        name: s.name,
        order_index: idx,
      }));

      const { error: skillsError } = await supabaseClient
        .from("skills")
        .insert(skillPayload);

      if (skillsError) {
        console.error(
          `❌ Failed to insert skills for ${cat.name}:`,
          skillsError.message
        );
      } else {
        console.log(
          `✅ Added ${newSkills.length} missing skills for category: ${cat.name}`
        );
      }
    } else {
      console.log(`ℹ️ All skills already exist for ${cat.name}, skipping.`);
    }
  }
}
