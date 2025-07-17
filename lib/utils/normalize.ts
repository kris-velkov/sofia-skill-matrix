export function normalizeString(str: string): string {
  return str.trim().toLowerCase(); // normalize for comparison
}

export function normalizeDepartment(dept: string): string {
  return dept.trim().toLowerCase().replace(/\s+/g, "-");
}
