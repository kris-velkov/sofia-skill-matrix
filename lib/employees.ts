import { mapSupabaseEmployee } from "./utils/employees";
import { fetchEmployees } from "./getEmployees";
import { Employee, SupabaseEmployee } from "@/types/employees";

export async function getEmployees(): Promise<Employee[]> {
  const data = await fetchEmployees();

  if (!data || !(data as SupabaseEmployee[]).length) return [];

  return (data as SupabaseEmployee[]).map(mapSupabaseEmployee);
}

export async function getEmployeeById(
  id: string
): Promise<Employee | undefined> {
  const data = await fetchEmployees({ id });

  if (!data) return undefined;

  return mapSupabaseEmployee(data as SupabaseEmployee);
}
