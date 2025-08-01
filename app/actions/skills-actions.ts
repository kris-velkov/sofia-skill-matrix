"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "./auth-action";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SkillFormData, Skill } from "@/types/skills";
import { validateSkill } from "@/lib/utils/validation";

export async function getAllSkills(): Promise<Skill[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("skills")
      .select(
        `
        *,
        categories (
          id,
          name
        )
      `
      )
      .order("order_index", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch skills: ${error.message}`);
    }

    return (data || []).map((skill) => ({
      id: skill.id,
      name: skill.name,
      category_id: skill.category_id,
      order_index: skill.order_index || 0,
      created_at: skill.created_at,
      category: skill.categories
        ? {
            id: skill.categories.id,
            name: skill.categories.name,
          }
        : undefined,
    }));
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    throw error;
  }
}

export async function getSkillsByCategory(
  categoryId: string
): Promise<Skill[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("skills")
      .select(
        `
        *,
        categories (
          id,
          name
        )
      `
      )
      .eq("category_id", categoryId)
      .order("order_index", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch skills for category: ${error.message}`);
    }

    return (data || []).map((skill) => ({
      id: skill.id,
      name: skill.name,
      category_id: skill.category_id,
      order_index: skill.order_index || 0,
      created_at: skill.created_at,
      category: skill.categories
        ? {
            id: skill.categories.id,
            name: skill.categories.name,
          }
        : undefined,
    }));
  } catch (error) {
    console.error("Failed to fetch skills by category:", error);
    throw error;
  }
}

export async function createSkill(formData: SkillFormData) {
  try {
    await requireRole("admin");

    const validation = validateSkill(formData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }

    const supabase = await createSupabaseServerClient();

    let orderIndex = formData.order_index;
    if (orderIndex === undefined) {
      const { data: maxData } = await supabase
        .from("skills")
        .select("order_index")
        .eq("category_id", formData.category_id)
        .order("order_index", { ascending: false })
        .limit(1);

      orderIndex = (maxData?.[0]?.order_index || 0) + 1;
    }

    const { data, error } = await supabase
      .from("skills")
      .insert({
        name: formData.name.trim(),
        category_id: formData.category_id,
        order_index: orderIndex,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create skill: ${error.message}`);
    }

    revalidatePath("/admin");
    return { success: true, data, message: "Skill created successfully" };
  } catch (error) {
    console.error("Failed to create skill:", error);
    throw error;
  }
}

export async function updateSkill(id: string, formData: SkillFormData) {
  try {
    await requireRole("admin");

    const validation = validateSkill(formData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }

    const supabase = await createSupabaseServerClient();

    const updateData: {
      name: string;
      category_id: string;
      order_index?: number;
    } = {
      name: formData.name.trim(),
      category_id: formData.category_id,
    };

    if (formData.order_index !== undefined) {
      updateData.order_index = formData.order_index;
    }

    const { error } = await supabase
      .from("skills")
      .update(updateData)
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to update skill: ${error.message}`);
    }

    revalidatePath("/admin");
    return { success: true, message: "Skill updated successfully" };
  } catch (error) {
    console.error("Failed to update skill:", error);
    throw error;
  }
}

export async function deleteSkill(id: string) {
  try {
    await requireRole("admin");

    const supabase = await createSupabaseServerClient();

    const { error: fetchError } = await supabase
      .from("skills")
      .select("name")
      .eq("id", id)
      .single();

    if (fetchError && fetchError.code === "PGRST116") {
      revalidatePath("/admin");
      return { success: true, message: "Skill deleted successfully" };
    }

    if (fetchError) {
      throw new Error(`Failed to fetch skill: ${fetchError.message}`);
    }

    const { data: employeeSkills } = await supabase
      .from("employees_skill_levels")
      .select("employee_id")
      .eq("skill_id", id)
      .limit(1);

    if (employeeSkills && employeeSkills.length > 0) {
      throw new Error("Cannot delete skill that is assigned to employees");
    }

    const { error } = await supabase.from("skills").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete skill: ${error.message}`);
    }

    revalidatePath("/admin");
    return { success: true, message: "Skill deleted successfully" };
  } catch (error) {
    console.error("Failed to delete skill:", error);
    throw error;
  }
}
