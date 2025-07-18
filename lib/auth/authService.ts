"use client";

import { supabaseAuthClient } from "@/lib/supabase/supabaseAuthClient";
import { useAuthStore } from "@/store/use-auth-store";
import { Employee } from "@/types/employees";

export type AuthError = {
  message: string;
};

export type LoginResult = {
  success: boolean;
  error?: AuthError;
  user?: Employee | null;
  role?: "admin" | "user";
};

export async function signInWithEmail(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    const { data, error } = await supabaseAuthClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: { message: error.message },
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: { message: "User data not found" },
      };
    }

    const userRole = data.user.user_metadata?.role as
      | "admin"
      | "user"
      | undefined;

    const authUser = {
      id: data.user.id,
      email: data.user.email,
      user_metadata: {
        ...data.user.user_metadata,
        role: userRole || "user",
      },
      app_metadata: data.user.app_metadata,
    };

    const employeeData: Employee = {
      id: data.user.id,
      firstName: data.user.user_metadata.first_name || "",
      lastName: data.user.user_metadata.last_name || "",
      skills: [],
    };

    useAuthStore.getState().login(authUser, employeeData);

    return {
      success: true,
      user: employeeData,
      role: authUser.user_metadata.role,
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: { message: "An unexpected error occurred during sign in." },
    };
  }
}

export async function signOut(): Promise<{
  success: boolean;
  error?: AuthError;
}> {
  try {
    const { error } = await supabaseAuthClient.auth.signOut();

    if (error) {
      console.error("Supabase signOut error:", error.message);
      return {
        success: false,
        error: { message: error.message },
      };
    }

    useAuthStore.getState().logout();
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      success: false,
      error: { message: "An unexpected error occurred during sign out." },
    };
  }
}

export async function checkAuth(): Promise<boolean> {
  try {
    const {
      data: { session },
    } = await supabaseAuthClient.auth.getSession();
    return !!session;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
}
