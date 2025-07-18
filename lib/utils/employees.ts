import { FilterState } from "@/store/use-skills-store";
import {
  SupabaseSkillLevel,
  SupabaseEmployee,
  Employee,
  NormalizedSkillCategory,
  SkillCategoryGroup,
} from "@/types/employees";

export function normalizeSkills(
  rawSkills: SupabaseSkillLevel[]
): NormalizedSkillCategory[] {
  if (!rawSkills?.length) return [];

  const grouped = new Map<string, SkillCategoryGroup>();

  for (const item of rawSkills) {
    const categoryName = item.skills?.categories?.name;
    const categoryId = item.skills.categories?.id;
    const categoryDefault = item.skills.categories.default;
    const skillName = item.skills?.name;
    const skillLevel = item.level;
    const skillId = item.skills?.id;

    if (
      !categoryName ||
      !skillName ||
      typeof skillLevel !== "number" ||
      !skillId
    ) {
      continue;
    }

    if (!grouped.has(categoryName)) {
      grouped.set(categoryName, {
        id: categoryId,
        default: categoryDefault,
        name: categoryName,
        skills: [],
        total: 0,
        count: 0,
      });
    }

    const categoryGroup = grouped.get(categoryName)!;
    categoryGroup.skills.push({
      id: skillId,
      name: skillName,
      level: skillLevel,
    });
    categoryGroup.total += skillLevel;
    categoryGroup.count += 1;
  }

  return Array.from(grouped.values()).map((group) => ({
    id: group.id,
    name: group.name,
    default: group.default,
    skills: group.skills,
    averageLevel:
      group.count > 0 ? Math.round((group.total / group.count) * 100) / 100 : 0,
  }));
}

export function mapSupabaseEmployee(emp: SupabaseEmployee): Employee {
  if (!emp) {
    throw new Error("Employee data is required");
  }

  const skillCategories = normalizeSkills(emp.employees_skill_levels || []);

  return {
    id: emp.id,
    firstName: emp.first_name || "",
    lastName: emp.last_name || "",
    bio: emp.bio ?? "",
    country: emp.country || "",
    city: emp.city || "",
    program: emp.program || "",
    profileImage: emp.profile_image || "",
    slackUrl: emp.slack_url || undefined,
    linkedinUrl: emp.linkedin_url || undefined,
    careerExperience: emp.career_experience || "",
    startDate: emp.start_date,
    department: emp.department || "",
    role: emp.role || "",
    floatId: emp.float_id || undefined,
    skills: skillCategories,
    certificates: emp.certificates || [],
  };
}

export function mapSupabaseEmployees(
  employees: SupabaseEmployee[]
): Employee[] {
  if (!Array.isArray(employees)) return [];

  return employees.filter((emp) => emp && emp.id).map(mapSupabaseEmployee);
}

export function getEmployeeFullName(
  firstName?: string,
  lastName?: string
): string {
  if (firstName !== undefined && lastName !== undefined) {
    return `${firstName} ${lastName}`.trim();
  }
  return "";
}

export function calculateOverallSkillAverage(
  skills: NormalizedSkillCategory[]
): number {
  if (!skills?.length) return 0;

  const totalAverage = skills.reduce(
    (sum, category) => sum + category.averageLevel,
    0
  );
  return Math.round((totalAverage / skills.length) * 100) / 100;
}

type Filter = FilterState;

export function getFilteredEmployees(
  employees: Employee[],
  filter: Filter
): Employee[] {
  return employees.filter((e) => {
    const matchesEmployee =
      !filter.selectedEmployees.length ||
      filter.selectedEmployees.includes(e.id);

    const matchesDepartment =
      !filter.selectedDepartment ||
      filter.selectedDepartment === "all" ||
      e.department === filter.selectedDepartment;

    const matchesSkillCategory =
      !filter.selectedSkillCategory ||
      filter.selectedSkillCategory === "all" ||
      e.skills.some(
        (cat) =>
          cat.name === filter.selectedSkillCategory &&
          (filter.minimumSkillLevel === null ||
            cat.averageLevel >= filter.minimumSkillLevel)
      );

    const matchesSkills =
      !filter.selectedSkills.length && filter.minimumSkillLevel === null
        ? true
        : e.skills.some((cat) =>
            cat.skills.some((skill) => {
              const matchSkill =
                !filter.selectedSkills.length ||
                filter.selectedSkills.includes(skill.name);
              const matchLevel =
                filter.minimumSkillLevel === null ||
                skill.level >= filter.minimumSkillLevel;
              return matchSkill && matchLevel;
            })
          );

    return (
      matchesEmployee &&
      matchesDepartment &&
      matchesSkillCategory &&
      matchesSkills
    );
  });
}
