import { Employee } from "@/types/employees";

export function getExperienceFromDate(
  dateString: string | Date | null | undefined
): string {
  if (!dateString) return "0y 0m 0d";

  const start = dateString instanceof Date ? dateString : new Date(dateString);
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
export function prepareEmployeeDatesForDB(
  employee: Partial<Employee>
): Partial<Employee> {
  const result: Partial<Employee> = { ...employee };

  if (employee.careerExperience) {
    result.careerExperience =
      employee.careerExperience instanceof Date
        ? employee.careerExperience.toISOString()
        : new Date(employee.careerExperience).toISOString();
  } else {
    result.careerExperience = null;
  }

  if (employee.startDate) {
    result.startDate =
      employee.startDate instanceof Date
        ? employee.startDate.toISOString()
        : new Date(employee.startDate).toISOString();
  } else {
    result.startDate = null;
  }
  return result;
}
