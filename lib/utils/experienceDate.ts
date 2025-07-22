import { Employee } from "@/types/employees";

export function getExperienceFromDate(
  dateString: string | Date | null | undefined
): string {
  if (!dateString) return "0y 0m 0d";

  const start = dateString instanceof Date ? dateString : new Date(dateString);
  if (isNaN(start.getTime())) return "0y 0m 0d";

  const now = new Date();
  if (start > now) return "0y 0m 0d";

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }
  return `${years}y ${months}m ${days}d`;
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
