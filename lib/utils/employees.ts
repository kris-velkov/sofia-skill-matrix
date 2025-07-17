import {
  SupabaseSkillLevel,
  SupabaseEmployee,
  Employee,
  NormalizedSkillCategory,
} from "@/types/employees";

interface SkillCategoryGroup {
  name: string;
  skills: { name: string; level: number }[];
  total: number;
  count: number;
}

export function normalizeSkills(
  rawSkills: SupabaseSkillLevel[]
): NormalizedSkillCategory[] {
  if (!rawSkills?.length) return [];

  const grouped = new Map<string, SkillCategoryGroup>();

  for (const item of rawSkills) {
    const categoryName = item.skills.categories?.name;
    const skillName = item.skills.name;
    const skillLevel = item.level;

    // Skip invalid entries
    if (!categoryName || !skillName || typeof skillLevel !== "number") {
      continue;
    }

    if (!grouped.has(categoryName)) {
      grouped.set(categoryName, {
        name: categoryName,
        skills: [],
        total: 0,
        count: 0,
      });
    }

    const categoryGroup = grouped.get(categoryName)!;
    categoryGroup.skills.push({ name: skillName, level: skillLevel });
    categoryGroup.total += skillLevel;
    categoryGroup.count += 1;
  }

  return Array.from(grouped.values()).map((group) => ({
    name: group.name,
    skills: group.skills,
    averageLevel:
      group.count > 0 ? Math.round((group.total / group.count) * 100) / 100 : 0,
  }));
}

export function mapSupabaseEmployee(emp: SupabaseEmployee): Employee {
  if (!emp) {
    throw new Error("Employee data is required");
  }

  const skillCategories = normalizeSkills(emp.employees_skill_levels);

  return {
    id: emp.id,
    firstName: emp.first_name,
    lastName: emp.last_name,
    bio: emp.bio ?? "",
    country: emp.country,
    city: emp.city,
    program: emp.program,
    profileImage: emp.profile_image,
    slackUrl: emp.slack_url || undefined,
    linkedinUrl: emp.linkedin_url || undefined,
    careerExperience: emp.career_experience,
    startDate: emp.start_date,
    department: emp.department,
    role: emp.role,
    floatId: emp.float_id || undefined,
    skills: skillCategories,
    certificates: emp.certificates || [],
  };
}

/**
 * Maps multiple Supabase employee records to normalized Employee interfaces
 */
export function mapSupabaseEmployees(
  employees: SupabaseEmployee[]
): Employee[] {
  if (!Array.isArray(employees)) return [];

  return employees
    .filter((emp) => emp && emp.id) // Filter out invalid entries
    .map(mapSupabaseEmployee);
}

/**
 * Gets the full name of an employee
 */
export function getEmployeeFullName(
  employee: Employee | SupabaseEmployee
): string {
  if ("firstName" in employee) {
    return `${employee.firstName} ${employee.lastName}`.trim();
  }
  return `${employee.first_name} ${employee.last_name}`.trim();
}

/**
 * Calculates the overall skill average for an employee
 */
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
