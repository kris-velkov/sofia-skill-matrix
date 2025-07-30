"use server";

import { ProgramValue } from "@/constants/programs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: "admin" | "user";
  program: ProgramValue | "all";
}

export type AuthError = {
  message: string;
  code?: string;
};

export type LoginResult = {
  success: boolean;
  error?: AuthError;
  user?: AuthUser;
};

export type SignOutResult = {
  success: boolean;
  error?: AuthError;
};

function createAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    firstName: user.user_metadata?.first_name || "",
    lastName: user.user_metadata?.last_name || "",
    email: user.email,
    role: (user.user_metadata?.role as "admin" | "user") || "user",
    program: (user.user_metadata?.program as ProgramValue | "all") || "all",
  };
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<LoginResult> {
  if (!email || !password) {
    return {
      success: false,
      error: { message: "Email and password are required" },
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.name || "AUTH_ERROR",
        },
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: { message: "Authentication failed - user data not found" },
      };
    }

    revalidatePath("/");

    return {
      success: true,
      user: createAuthUser(data.user),
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: {
        message: "An unexpected error occurred during sign in",
        code: "UNEXPECTED_ERROR",
      },
    };
  }
}
export async function signOut(): Promise<SignOutResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Supabase signOut error:", error.message);
      return {
        success: false,
        error: {
          message: error.message,
          code: error.name || "SIGNOUT_ERROR",
        },
      };
    }

    redirect("/login");
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      success: false,
      error: {
        message: "An unexpected error occurred during sign out",
        code: "UNEXPECTED_ERROR",
      },
    };
  }
}

export async function checkUserRole(
  requiredRole: "admin" | "user"
): Promise<boolean> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return false;
    }
    if (user.role === "admin") {
      return true;
    }
    return user.role === requiredRole;
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
}

export async function checkUserProgram(
  requiredProgram: ProgramValue
): Promise<boolean> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return false;
    }

    if (user.role === "admin" || user.program === "all") {
      return true;
    }

    return user.program === requiredProgram;
  } catch (error) {
    console.error("Error checking user program:", error);
    return false;
  }
}

export async function requireRole(
  requiredRole: "admin" | "user"
): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  const hasRole = await checkUserRole(requiredRole);

  if (!hasRole) {
    throw new Error(`Access denied. Required role: ${requiredRole}`);
  }

  return user;
}

export async function requireProgram(
  requiredProgram: ProgramValue
): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  const hasProgram = await checkUserProgram(requiredProgram);
  if (!hasProgram) {
    throw new Error(`Access denied. Required program: ${requiredProgram}`);
  }

  return user;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error getting user:", error);
      return null;
    }

    if (!user) {
      return null;
    }

    return createAuthUser(user);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}
