import type { Employee } from "@/types/employees";

export function filterEmployees(
  employees: Employee[],
  searchTerm: string
): Employee[] {
  if (!searchTerm.trim()) {
    return employees;
  }

  const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();

  return employees.filter((employee) => {
    if (!employee.firstName || !employee.lastName) {
      return false;
    }

    const searchableFields = [
      employee.firstName,
      employee.lastName,
      `${employee.firstName} ${employee.lastName}`,
      employee.department || "",
      employee.role || "",
      employee.program || "",
    ];

    return searchableFields.some((field) =>
      field.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });
}

export function debounce<T extends (...args: string[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}
