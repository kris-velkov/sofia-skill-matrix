"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "./auth-action";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getAllUsers() {
  try {
    await requireRole("admin");

    const adminClient = createSupabaseAdminClient();
    const regularClient = await createSupabaseServerClient();

    const { data: authData, error: authError } =
      await adminClient.auth.admin.listUsers();

    if (authError) {
      throw new Error(`Failed to fetch users: ${authError.message}`);
    }

    const { data: employeeData } = await regularClient
      .from("employees")
      .select("id, first_name, last_name, program");

    const employeeMap = new Map(
      (employeeData || []).map((emp) => [emp.id, emp])
    );

    return authData.users.map((user) => {
      const employee = employeeMap.get(user.id);
      return {
        id: user.id,
        email: user.email || "",
        firstName: user.user_metadata?.first_name || employee?.first_name || "",
        lastName: user.user_metadata?.last_name || employee?.last_name || "",
        role: user.user_metadata?.role || "member",
        program: user.user_metadata?.program || employee?.program || "all",
        createdAt: user.created_at,
        lastSignIn: user.last_sign_in_at || null,
      };
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    await requireRole("admin");

    const adminClient = createSupabaseAdminClient();
    const { error } = await adminClient.auth.admin.updateUserById(userId, {
      user_metadata: { role },
    });

    if (error) {
      throw new Error(`Failed to update user role: ${error.message}`);
    }

    revalidatePath("/admin");
    return { success: true, message: "User role updated successfully" };
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw error;
  }
}

export async function updateUserProgram(userId: string, program: string) {
  try {
    await requireRole("admin");

    const adminClient = createSupabaseAdminClient();
    const regularClient = await createSupabaseServerClient();

    const { error: authError } = await adminClient.auth.admin.updateUserById(
      userId,
      {
        user_metadata: { program },
      }
    );

    if (authError) {
      console.warn("Failed to update auth metadata:", authError);
    }

    const { error: employeeError } = await regularClient
      .from("employees")
      .update({ program })
      .eq("id", userId);

    if (employeeError) {
      console.warn("Failed to update employee program:", employeeError);
    }

    revalidatePath("/admin");
    return { success: true, message: "User program updated successfully" };
  } catch (error) {
    console.error("Failed to update user program:", error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    await requireRole("admin");

    const adminClient = createSupabaseAdminClient();
    const regularClient = await createSupabaseServerClient();

    const { error: authError } = await adminClient.auth.admin.deleteUser(
      userId
    );

    if (authError) {
      throw new Error(`Failed to delete user: ${authError.message}`);
    }

    const { error: employeeError } = await regularClient
      .from("employees")
      .delete()
      .eq("id", userId);

    if (employeeError) {
      console.warn("Failed to delete employee record:", employeeError);
    }

    revalidatePath("/admin");
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
}

export async function getAllCategories() {
  try {
    await requireRole("admin");

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("order_index");

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
}

export async function createCategory(
  name: string,
  departments: string[],
  isDefault: boolean = false,
  orderIndex?: number
) {
  try {
    await requireRole("admin");

    const supabase = await createSupabaseServerClient();

    let nextOrderIndex = orderIndex;
    if (nextOrderIndex === undefined) {
      const { data: maxData } = await supabase
        .from("categories")
        .select("order_index")
        .order("order_index", { ascending: false })
        .limit(1);

      nextOrderIndex = (maxData?.[0]?.order_index || 0) + 1;
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name,
        departments,
        default: isDefault,
        order_index: nextOrderIndex,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }

    revalidatePath("/admin");
    return { success: true, data, message: "Category created successfully" };
  } catch (error) {
    console.error("Failed to create category:", error);
    throw error;
  }
}

export async function updateCategory(
  id: string,
  name: string,
  departments: string[],
  isDefault: boolean,
  orderIndex: number
) {
  try {
    await requireRole("admin");

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("categories")
      .update({
        name,
        departments,
        default: isDefault,
        order_index: orderIndex,
      })
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }

    revalidatePath("/admin");
    return { success: true, message: "Category updated successfully" };
  } catch (error) {
    console.error("Failed to update category:", error);
    throw error;
  }
}

export async function deleteCategory(id: string) {
  try {
    await requireRole("admin");

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }

    revalidatePath("/admin");
    return { success: true, message: "Category deleted successfully" };
  } catch (error) {
    console.error("Failed to delete category:", error);
    throw error;
  }
}

export async function getAllAiToolsAdmin() {
  try {
    await requireRole("admin");

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("ai_tools")
      .select("*")
      .order("order_number");

    if (error) {
      throw new Error(`Failed to fetch AI tools: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch AI tools:", error);
    throw error;
  }
}

export async function createAiTool(name: string, orderNumber?: number) {
  try {
    await requireRole("admin");

    const supabase = await createSupabaseServerClient();

    let nextOrderNumber = orderNumber;
    if (nextOrderNumber === undefined) {
      const { data: maxData } = await supabase
        .from("ai_tools")
        .select("order_number")
        .order("order_number", { ascending: false })
        .limit(1);

      nextOrderNumber = (maxData?.[0]?.order_number || 0) + 1;
    }

    const { data, error } = await supabase
      .from("ai_tools")
      .insert({
        name,
        order_number: nextOrderNumber,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create AI tool: ${error.message}`);
    }

    revalidatePath("/admin");
    return { success: true, data, message: "AI tool created successfully" };
  } catch (error) {
    console.error("Failed to create AI tool:", error);
    throw error;
  }
}

export async function updateAiTool(
  id: string,
  name: string,
  orderNumber: number
) {
  try {
    await requireRole("admin");

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("ai_tools")
      .update({
        name,
        order_number: orderNumber,
      })
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to update AI tool: ${error.message}`);
    }

    revalidatePath("/admin");
    return { success: true, message: "AI tool updated successfully" };
  } catch (error) {
    console.error("Failed to update AI tool:", error);
    throw error;
  }
}

export async function deleteAiTool(id: string) {
  try {
    await requireRole("admin");

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("ai_tools").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete AI tool: ${error.message}`);
    }

    revalidatePath("/admin");
    return { success: true, message: "AI tool deleted successfully" };
  } catch (error) {
    console.error("Failed to delete AI tool:", error);
    throw error;
  }
}
