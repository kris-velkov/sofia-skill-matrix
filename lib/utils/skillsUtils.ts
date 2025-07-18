import { RawSkillData, GroupedCategory } from "@/types/skills";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

export function groupSkillsByCategoryWithAverage(
  rawSkills: RawSkillData[]
): GroupedCategory[] {
  const grouped = new Map<
    string,
    {
      name: string;
      skills: { name: string; level: number }[];
      totalLevel: number;
      count: number;
    }
  >();

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

    const categoryGroup = grouped.get(categoryName)!;

    categoryGroup.skills.push({ name: skillName, level: skillLevel });
    categoryGroup.totalLevel += skillLevel;
    categoryGroup.count += 1;
  }

  return Array.from(grouped.values()).map((group) => ({
    name: group.name,
    skills: group.skills,
    averageLevel:
      group.count > 0
        ? parseFloat((group.totalLevel / group.count).toFixed(2))
        : 0,
  }));
}

export async function checkIfColumnExists(
  table:
    | "categories"
    | "certificates"
    | "employees"
    | "employees_skill_levels"
    | "skills",
  columnName: string,
  supabaseClient: ReturnType<typeof createClient<Database>>
): Promise<boolean> {
  try {
    const { error } = await supabaseClient
      .from(table)
      .select(columnName)
      .limit(1);

    return !(error && error.message.includes("column"));
  } catch (e) {
    console.error(e);
    return false;
  }
}
