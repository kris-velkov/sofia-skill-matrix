"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "./auth-action";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProgramFormData, Program } from "@/types/programs";
import { validateProgram } from "@/lib/utils/validation";

export async function getAllPrograms(): Promise<Program[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch programs: ${error.message}`);
    }

    return (data || []).map((program) => ({
      id: program.id,
      label: program.label,
      value: program.value,
      order_index: program.order_index || 0,
      created_at: program.created_at,
      updated_at: program.updated_at,
    }));
  } catch (error) {
    console.error("Failed to fetch programs:", error);
    throw error;
  }
}

export async function createProgram(formData: ProgramFormData) {
  try {
    await requireRole("admin");

    const validation = validateProgram(formData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }

    const supabase = await createSupabaseServerClient();

    const { data: existing } = await supabase
      .from("programs")
      .select("id")
      .eq("value", formData.value.trim().toLowerCase())
      .single();

    if (existing) {
      throw new Error("Program with this value already exists");
    }

    let orderIndex = formData.orderIndex;
    if (orderIndex === undefined) {
      const { data: maxData } = await supabase
        .from("programs")
        .select("order_index")
        .order("order_index", { ascending: false })
        .limit(1);

      orderIndex = (maxData?.[0]?.order_index || 0) + 1;
    }

    const { data, error } = await supabase
      .from("programs")
      .insert({
        label: formData.label.trim(),
        value: formData.value.trim().toLowerCase(),
        order_index: orderIndex,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create program: ${error.message}`);
    }

    revalidatePath("/admin");
    return { success: true, data, message: "Program created successfully" };
  } catch (error) {
    console.error("Failed to create program:", error);
    throw error;
  }
}

export async function updateProgram(id: number, formData: ProgramFormData) {
  try {
    await requireRole("admin");

    const validation = validateProgram(formData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }

    const supabase = await createSupabaseServerClient();

    const { data: existing } = await supabase
      .from("programs")
      .select("id")
      .eq("value", formData.value.trim().toLowerCase())
      .neq("id", id)
      .single();

    if (existing) {
      throw new Error("Program with this value already exists");
    }

    const updateData: {
      label: string;
      value: string;
      order_index?: number;
    } = {
      label: formData.label.trim(),
      value: formData.value.trim().toLowerCase(),
    };

    if (formData.orderIndex !== undefined) {
      updateData.order_index = formData.orderIndex;
    }

    const { error } = await supabase
      .from("programs")
      .update(updateData)
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to update program: ${error.message}`);
    }

    revalidatePath("/admin");
    return { success: true, message: "Program updated successfully" };
  } catch (error) {
    console.error("Failed to update program:", error);
    throw error;
  }
}

export async function deleteProgram(id: number) {
  try {
    await requireRole("admin");

    const supabase = await createSupabaseServerClient();

    const { data: programData, error: fetchError } = await supabase
      .from("programs")
      .select("value")
      .eq("id", id)
      .single();

    if (fetchError && fetchError.code === "PGRST116") {
      revalidatePath("/admin");
      return { success: true, message: "Program deleted successfully" };
    }

    if (fetchError) {
      throw new Error(`Failed to fetch program: ${fetchError.message}`);
    }

    if (programData?.value) {
      const { data: employees } = await supabase
        .from("employees")
        .select("id")
        .eq("program", programData.value)
        .limit(1);

      if (employees && employees.length > 0) {
        throw new Error("Cannot delete program that is assigned to employees");
      }
    }

    const { error } = await supabase.from("programs").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete program: ${error.message}`);
    }

    revalidatePath("/admin");
    return { success: true, message: "Program deleted successfully" };
  } catch (error) {
    console.error("Failed to delete program:", error);
    throw error;
  }
}
