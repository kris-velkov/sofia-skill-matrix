import { EMPLOYEE_FULL_SELECT_QUERY } from "./supabase/queries";
import { SupabaseEmployee } from "../types/employees";
import { formatDepartment } from "./utils/normalize";
import { createSupabaseServerClient } from "./supabase/server";
import { ProgramValue } from "@/types/programs";

type FetchEmployeeFilter = {
  id?: string;
  department?: string;
  program?: ProgramValue;
};

type FetchEmployeeResult<T extends FetchEmployeeFilter | undefined> =
  T extends { id: string } ? SupabaseEmployee | null : SupabaseEmployee[];

export async function fetchEmployees<T extends FetchEmployeeFilter | undefined>(
  filter?: T
): Promise<FetchEmployeeResult<T>> {
  const supabase = await createSupabaseServerClient();
  const query = supabase
    .from("employees")
    .select(EMPLOYEE_FULL_SELECT_QUERY)
    .order("first_name");

  if (filter?.id) {
    const { data, error } = await query.eq("id", filter.id).single();

    if (error) {
      throw new Error(`Failed to fetch employee `);
    }

    if (data.employees_skill_levels?.length > 0) {
      data.employees_skill_levels.sort((a, b) => {
        const aOrderIndex =
          a.skills?.categories?.order_index ?? Number.MAX_SAFE_INTEGER;
        const bOrderIndex =
          b.skills?.categories?.order_index ?? Number.MAX_SAFE_INTEGER;
        return aOrderIndex - bOrderIndex;
      });
    }

    if (data.employees_ai_tools.length > 0) {
      data.employees_ai_tools.sort((a, b) => {
        const aLevel = a.level ?? Number.MAX_SAFE_INTEGER;
        const bLevel = b.level ?? Number.MAX_SAFE_INTEGER;
        return bLevel - aLevel;
      });
    }

    if (data.department) {
      data.department = formatDepartment(data.department);
    }

    return data as unknown as FetchEmployeeResult<T>;
  }

  if (filter?.department) {
    query.eq("department", filter.department);
  }

  if (filter?.program && filter?.program !== "all") {
    query.eq("program", filter.program);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase fetch error:", error.message);
    throw new Error(`Failed to fetch employees: ${error.message}`);
  }

  if (data && Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].department) {
        if (data[i] || data[i].department) {
          data[i].department = formatDepartment(data[i].department);
        }
      }
    }
  }
  return (data || []) as unknown as FetchEmployeeResult<T>;
}
