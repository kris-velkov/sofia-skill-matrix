"use server";

import { Employee } from "@/types/employees";
import { supabaseClient } from "./supabase/supabaseClient";
import { getEmployeeById } from "./employees";

export async function deleteEmployeeSkillInDb(
  employeeId: string,
  category: { name: string; skills: { name: string; level: number }[] }
): Promise<Employee | undefined> {
  const { data: group, error: groupError } = await supabaseClient
    .from("skill_groups")
    .select("id")
    .eq("employee_id", employeeId)
    .eq("name", category.name)
    .single();

  if (groupError || !group) return undefined;

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

export async function updateEmployeeSkillsInDb(
  employeeId: string,
  category: { name: string; skills: { name: string; level: number }[] }
): Promise<void> {
  for (const skill of category.skills) {
    const { data: skillData } = await supabaseClient
      .from("skills")
      .select("id")
      .eq("name", skill.name)
      .maybeSingle();

    if (!skillData) {
      console.warn(`Skill '${skill.name}' not found in DB, skipping.`);
      continue;
    }

    const skillId = skillData.id;

    const { error } = await supabaseClient
      .from("employee_skill_levels")
      .upsert({
        employee_id: employeeId,
        skill_id: skillId,
        level: skill.level,
      });

    if (error) {
      console.error(
        `Failed to update ${skill.name} for employee ${employeeId}:`,
        error.message
      );
    } else {
      console.log(`Updated ${skill.name} (${skill.level})`);
    }
  }
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

export async function getEmployeeSkillsGrouped(employeeId: string) {
  const { data, error } = await supabaseClient
    .from("employee_skill_levels")
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
    .from("employee_skill_levels")
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

export async function groupSkillsByCategoryWithAverage(rawSkills) {
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
