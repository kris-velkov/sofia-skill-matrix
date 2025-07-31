"use server";

import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
import { AiTool, EmployeeAiTool, EmployeeAiToolData } from "@/types/employees";
import { createSupabaseServerClient } from "./supabase/server";
import { ProgramValue } from "@/constants/programs";

const EMPLOYEE_AI_TOOL_QUERY = `
  *,
  ai_tools!inner (
    id,
    name,
    order_number
  ),
  employees!inner (
    id,
    first_name,
    last_name,
    profile_image,
    program,
    department,
    role
  )
`;

export async function getEmployeeAiTools(
  employeeId: string
): Promise<EmployeeAiTool[] | undefined> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("employees_ai_tools")
    .select(
      `
      *,
      ai_tools (
        id,
        name,
        order_number
      )
    `
    )
    .eq("employee_id", employeeId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error getting AI tools:", error);
    throw new Error("Failed to get employee AI tools");
  }

  return camelcaseKeys(data, { deep: true }) as unknown as EmployeeAiTool[];
}

export async function addEmployeeAiToolInDb(
  aiTool: Omit<EmployeeAiTool, "id">
): Promise<EmployeeAiTool[] | undefined> {
  const payload = snakecaseKeys(aiTool);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("employees_ai_tools")
    .insert(payload).select(`
      *,
      ai_tools (
        id,
        name,
        order_number
      )
    `);

  if (error) {
    console.error("Error adding AI tool:", error);
    throw new Error("Failed to add AI tool");
  }

  return camelcaseKeys(data, { deep: true }) as EmployeeAiTool[];
}

export async function deleteEmployeeAiToolInDb(
  employeeId: string,
  toolId: string
): Promise<EmployeeAiTool[] | undefined> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("employees_ai_tools")
    .delete()
    .match({ employee_id: employeeId, tool_id: toolId }).select(`
      *,
      ai_tools (
        id,
        name,
        order_number
      )
    `);

  if (error) {
    console.error("Error deleting AI tool:", error);
    throw new Error("Failed to delete AI tool");
  }

  return camelcaseKeys(data, { deep: true }) as EmployeeAiTool[];
}

export async function updateEmployeeAiToolInDb(
  aiTool: Partial<EmployeeAiTool>
): Promise<EmployeeAiTool[] | undefined> {
  if (!aiTool) {
    throw new Error("AI tool data is missing.");
  }

  const payload = snakecaseKeys(aiTool);

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("employees_ai_tools")
    .update(payload)
    .match({ employee_id: aiTool.employeeId, tool_id: aiTool.toolId }).select(`
      *,
      ai_tools (
        id,
        name,
        order_number
      )
    `);

  if (error) {
    console.error("Failed to update AI tool:", error.message);
    throw new Error("Database update failed");
  }

  return camelcaseKeys(data, { deep: true }) as EmployeeAiTool[];
}

export async function getEmployeeAiToolsInDb(
  program: ProgramValue
): Promise<EmployeeAiToolData[]> {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("employees_ai_tools")
    .select(EMPLOYEE_AI_TOOL_QUERY)
    .order("created_at", { ascending: false });

  if (program && program !== "all") {
    query = query.eq("employees.program", program);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching employee AI tools:", error);
    throw new Error("Failed to fetch employee AI tools");
  }

  return camelcaseKeys(data, {
    deep: true,
  }) as unknown as EmployeeAiToolData[];
}

export async function getAllAiTools(): Promise<AiTool[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ai_tools")
    .select("*")
    .order("order_number", { ascending: true });

  if (error) {
    console.error("Error fetching AI tools:", error);
    throw new Error("Failed to fetch AI tools");
  }

  return camelcaseKeys(data) as unknown as AiTool[];
}

export async function createAiToolInDb(toolName: string): Promise<AiTool> {
  const supabase = await createSupabaseServerClient();

  const { data: existingTools } = await supabase
    .from("ai_tools")
    .select("order_number")
    .order("order_number", { ascending: false })
    .limit(1);

  const nextOrderNumber =
    existingTools && existingTools.length > 0
      ? existingTools[0].order_number + 1
      : 1;

  const { data, error } = await supabase
    .from("ai_tools")
    .insert({
      name: toolName.trim(),
      order_number: nextOrderNumber,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating AI tool:", error);
    throw new Error("Failed to create AI tool");
  }

  return camelcaseKeys(data) as unknown as AiTool;
}

export async function findOrCreateAiTool(toolName: string): Promise<AiTool> {
  const supabase = await createSupabaseServerClient();

  const { data: existingTool, error: findError } = await supabase
    .from("ai_tools")
    .select("*")
    .ilike("name", toolName.trim())
    .single();

  if (findError && findError.code !== "PGRST116") {
    console.error("Error searching for AI tool:", findError);
    throw new Error("Failed to search for AI tool");
  }

  if (existingTool) {
    return camelcaseKeys(existingTool) as unknown as AiTool;
  }

  return await createAiToolInDb(toolName);
}
