import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Employee, FilterState } from "./types";
import { Department, SupabaseEmployee } from "@/types/employees";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEmployeeFullName(
  firstName: string,
  lastName: string
): string {
  return `${firstName} ${lastName}`.trim();
}

export function getExperienceFromDate(
  dateString: string | undefined
): string | undefined {
  if (!dateString) return "0y 0m 0d";

  const start = new Date(dateString);
  if (isNaN(start.getTime())) return "0y 0m 0d";

  const now = new Date();

  if (start > now) return "0y 0m 0d";

  const years = now.getFullYear() - start.getFullYear();
  const months = now.getMonth() - start.getMonth();
  const days = now.getDate() - start.getDate();

  const rdYears = years - (months < 0 || (months === 0 && days < 0) ? 1 : 0);
  const rdMonths = ((months + 12) % 12) - (days < 0 ? 1 : 0);
  const rdDays = (days + (days < 0 ? 30 : 0)) % 31;

  return `${rdYears}y ${rdMonths}m ${rdDays}d`;
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

export function normalizeDepartment(department: string): Department {
  const normalized = department
    .toLowerCase()
    .trim()
    .replace(/\-/g, "")
    .replace(/\s+/g, "");
  if (normalized === "frontend" || normalized === "fe") return "fe";
  if (normalized === "backend" || normalized === "be") return "be";
  if (normalized === "quality assurance" || normalized === "qa") return "qa";
  if (normalized === "projectmanager" || normalized === "pm") return "pm";

  throw new Error(`Invalid department: ${department}, ${normalized}`);
}

export function normalizeSkillName(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s*\/\s*/g, "/")
    .replace(/\s+/g, " ");
}

export function getSortedEmployeesData(
  data: SupabaseEmployee[]
): SupabaseEmployee[] {
  if (!data) return data;

  return data.map((employee) => {
    // Sort the skill levels based on their category's order_index
    if (employee.employees_skill_levels) {
      employee.employees_skill_levels = employee.employees_skill_levels.sort(
        (a, b) => {
          const aOrderIndex =
            a.skills?.categories?.order_index ?? Number.MAX_SAFE_INTEGER;
          const bOrderIndex =
            b.skills?.categories?.order_index ?? Number.MAX_SAFE_INTEGER;

          return aOrderIndex - bOrderIndex;
        }
      );
    }

    return employee;
  });
}
