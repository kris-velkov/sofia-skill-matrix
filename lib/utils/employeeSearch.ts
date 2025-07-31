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
    // Early return if no name data
    if (!employee.firstName || !employee.lastName) {
      return false;
    }

    // Create searchable fields array
    const searchableFields = [
      employee.firstName,
      employee.lastName,
      `${employee.firstName} ${employee.lastName}`, // Full name search
      employee.department || "",
      employee.role || "",
      employee.program || "",
    ];

    // Check if any field contains the search term
    return searchableFields.some((field) =>
      field.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
