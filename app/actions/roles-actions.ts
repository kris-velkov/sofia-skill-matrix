"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "./auth-action";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { RoleFormData, Role } from "@/types/roles";
import { validateRole } from "@/lib/utils/validation";

export async function getAllRoles(): Promise<Role[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("roles")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch roles: ${error.message}`);
    }

    return (data || []).map((role) => ({
      id: role.id,
      name: role.name,
      departament: role.departament,
      roleId: role.role_id,
      order_index: role.order_index || 0,
      created_at: role.created_at,
      updated_at: role.updated_at,
    }));
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    throw error;
  }
}

export async function getRolesByDepartment(
  department: string
): Promise<Role[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("roles")
      .select("*")
      .eq("departament", department)
      .order("order_index", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch roles for department: ${error.message}`);
    }

    return (data || []).map((role) => ({
      id: role.id,
      name: role.name,
      departament: role.departament,
      roleId: role.role_id,
      order_index: role.order_index || 0,
      created_at: role.created_at,
      updated_at: role.updated_at,
    }));
  } catch (error) {
    console.error("Failed to fetch roles by department:", error);
    throw error;
  }
}

export async function createRole(formData: RoleFormData) {
  try {
    await requireRole("admin");

    const validation = validateRole(formData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }

    const supabase = await createSupabaseServerClient();

    const { data: existing } = await supabase
      .from("roles")
      .select("id")
      .eq("role_id", formData.roleId.trim().toLowerCase())
      .single();

    if (existing) {
      throw new Error("Role with this ID already exists");
    }

    let orderIndex = formData.orderIndex;
    if (orderIndex === undefined) {
      const { data: maxData } = await supabase
        .from("roles")
        .select("order_index")
        .eq("departament", formData.departament)
        .order("order_index", { ascending: false })
        .limit(1);

      orderIndex = (maxData?.[0]?.order_index || 0) + 1;
    }

    const { data, error } = await supabase
      .from("roles")
      .insert({
        name: formData.name.trim(),
        departament: formData.departament,
        role_id: formData.roleId.trim().toLowerCase(),
        order_index: orderIndex,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create role: ${error.message}`);
    }

    revalidatePath("/admin");
    return { success: true, data, message: "Role created successfully" };
  } catch (error) {
    console.error("Failed to create role:", error);
    throw error;
  }
}

export async function updateRole(id: number, formData: RoleFormData) {
  try {
    await requireRole("admin");

    const validation = validateRole(formData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }

    const supabase = await createSupabaseServerClient();

    const { data: existing } = await supabase
      .from("roles")
      .select("id")
      .eq("role_id", formData.roleId.trim().toLowerCase())
      .neq("id", id)
      .single();

    if (existing) {
      throw new Error("Role with this ID already exists");
    }

    const updateData: {
      name: string;
      departament: string;
      role_id: string;
      order_index?: number;
    } = {
      name: formData.name.trim(),
      departament: formData.departament,
      role_id: formData.roleId.trim().toLowerCase(),
    };

    if (formData.orderIndex !== undefined) {
      updateData.order_index = formData.orderIndex;
    }

    const { error } = await supabase
      .from("roles")
      .update(updateData)
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to update role: ${error.message}`);
    }

    revalidatePath("/admin");
    return { success: true, message: "Role updated successfully" };
  } catch (error) {
    console.error("Failed to update role:", error);
    throw error;
  }
}

export async function deleteRole(id: number) {
  try {
    await requireRole("admin");

    const supabase = await createSupabaseServerClient();

    const { data: roleData, error: fetchError } = await supabase
      .from("roles")
      .select("role_id")
      .eq("id", id)
      .single();

    if (fetchError && fetchError.code === "PGRST116") {
      revalidatePath("/admin");
      return { success: true, message: "Role deleted successfully" };
    }

    if (fetchError) {
      throw new Error(`Failed to fetch role: ${fetchError.message}`);
    }

    if (roleData?.role_id) {
      const { data: employees } = await supabase
        .from("employees")
        .select("id")
        .eq("role", roleData.role_id)
        .limit(1);

      if (employees && employees.length > 0) {
        throw new Error("Cannot delete role that is assigned to employees");
      }
    }

    const { error } = await supabase.from("roles").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete role: ${error.message}`);
    }

    revalidatePath("/admin");
    return { success: true, message: "Role deleted successfully" };
  } catch (error) {
    console.error("Failed to delete role:", error);
    throw error;
  }
}
