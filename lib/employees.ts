import { mapSupabaseEmployee } from "./utils/employees";
import { fetchEmployees } from "./getEmployees";
import { Employee, SupabaseEmployee } from "@/types/employees";
import { cache } from "react";

export const getEmployees = cache(async (): Promise<Employee[]> => {
  const data = await fetchEmployees();

  if (!data || !(data as SupabaseEmployee[]).length) return [];

  return (data as SupabaseEmployee[]).map(mapSupabaseEmployee);
});

export const getEmployeeById = cache(
  async (id: string): Promise<Employee | undefined> => {
    const data = await fetchEmployees({ id });
    if (!data) return undefined;

    const res = mapSupabaseEmployee(data);
    return res;
    // return mapSupabaseEmployee(data as SupabaseEmployee);
  }
);
