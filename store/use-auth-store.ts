import { Employee } from "@/types/employees";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "admin" | "user" | null;

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata: {
    role?: UserRole;
    first_name?: string;
    last_name?: string;
    [key: string]: unknown;
  };
  app_metadata?: Record<string, unknown>;
  aud?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  role: UserRole;
  hydrated: boolean;
  user: AuthUser | null;
  employeeData: Employee | null;
}

interface AuthActions {
  login: (user: AuthUser, employeeData?: Employee | null) => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
  updateUser: (user: Partial<AuthUser>) => void;
  updateEmployeeData: (employeeData: Employee | null) => void;
}

interface AuthSelectors {
  isAdmin: () => boolean;
  hasRole: (requiredRole: UserRole) => boolean;
}

type AuthStore = AuthState & AuthActions & AuthSelectors;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      role: null,
      user: null,
      employeeData: null,
      hydrated: false,

      login: (user: AuthUser, employeeData?: Employee | null) => {
        const role = user?.user_metadata?.role || "user";
        set({
          isLoggedIn: true,
          role,
          user,
          employeeData: employeeData || null,
        });
      },

      logout: () =>
        set({
          isLoggedIn: false,
          role: null,
          user: null,
          employeeData: null,
        }),

      setHydrated: (hydrated) => set({ hydrated }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
          role: userData.user_metadata?.role || state.role,
        })),

      updateEmployeeData: (employeeData) => set({ employeeData }),

      isAdmin: () => get().isLoggedIn && get().role === "admin",

      hasRole: (requiredRole) => {
        if (requiredRole === null) return true;
        return get().isLoggedIn && get().role === requiredRole;
      },
    }),
    {
      name: "auth-store",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
