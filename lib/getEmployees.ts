import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { EMPLOYEE_FULL_SELECT_QUERY } from "./supabase/queries";
import { SupabaseEmployee } from "../types/employees";

type FetchEmployeeFilter = {
  id?: string;
  department?: string;
};

type FetchEmployeeResult<T extends FetchEmployeeFilter | undefined> =
  T extends { id: string } ? SupabaseEmployee | null : SupabaseEmployee[];

export async function fetchEmployees<T extends FetchEmployeeFilter | undefined>(
  filter?: T
): Promise<FetchEmployeeResult<T>> {
  const query = supabaseClient
    .from("employees")
    .select(EMPLOYEE_FULL_SELECT_QUERY);

  if (filter?.id) {
    const { data, error } = await query.eq("id", filter.id).maybeSingle();

    if (error) {
      console.error("❌ Supabase fetch error:", error.message);
      throw new Error(`Failed to fetch employee with ID ${filter.id}`);
    }

    return data as FetchEmployeeResult<T>;
  }

  const { data, error } = await query;

  if (error) {
    console.error("❌ Supabase fetch error:", error.message);
    throw new Error(`Failed to fetch employees: ${error.message}`);
  }

  return (data ?? []) as FetchEmployeeResult<T>;
}
