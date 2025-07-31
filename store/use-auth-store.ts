import { Employee } from "@/types/employees";
import { ProgramValue } from "@/constants/programs";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "admin" | "editor" | "analyst" | "member" | null;

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata: {
    role?: UserRole;
    first_name?: string;
    last_name?: string;
    program?: ProgramValue | "all";
    [key: string]: unknown;
  };
  app_metadata?: Record<string, unknown>;
  aud?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  role: UserRole;
  program: ProgramValue | "all" | null;
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
  updateProgram: (program: ProgramValue | "all") => void;
}

interface AuthSelectors {
  isAdmin: () => boolean;
  hasRole: (requiredRole: UserRole) => boolean;
  canViewAllPrograms: () => boolean;
  getUserProgram: () => ProgramValue | "all" | null;
  canManageEmployees: () => boolean;
  canViewStatistics: () => boolean;
  canEditEmployees: () => boolean;
  canViewEmployees: () => boolean;
}

type AuthStore = AuthState & AuthActions & AuthSelectors;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      role: null,
      program: null,
      user: null,
      employeeData: null,
      hydrated: false,

      login: (user: AuthUser, employeeData?: Employee | null) => {
        const role = user?.user_metadata?.role || "member";
        const program = (user?.user_metadata?.program ||
          employeeData?.program ||
          null) as ProgramValue | "all";

        set({
          isLoggedIn: true,
          role,
          program,
          user,
          employeeData: employeeData || null,
        });
      },

      logout: () =>
        set({
          isLoggedIn: false,
          role: null,
          program: null,
          user: null,
          employeeData: null,
        }),

      setHydrated: (hydrated) => set({ hydrated }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
          role: userData.user_metadata?.role || state.role,
          program: userData.user_metadata?.program || state.program,
        })),

      updateEmployeeData: (employeeData) =>
        set((state) => ({
          employeeData,
          program:
            (employeeData?.program as ProgramValue | "all") || state.program,
        })),

      updateProgram: (program) => set({ program }),

      isAdmin: () => get().isLoggedIn && get().role === "admin",

      hasRole: (requiredRole) => {
        if (requiredRole === null) return true;
        return get().isLoggedIn && get().role === requiredRole;
      },

      canViewAllPrograms: () => {
        const state = get();
        return (
          state.isLoggedIn &&
          (state.role === "admin" || state.program === "all")
        );
      },

      getUserProgram: () => get().program,

      canManageEmployees: () => {
        const state = get();
        return (
          state.isLoggedIn &&
          (state.role === "admin" || state.role === "editor")
        );
      },

      canViewStatistics: () => {
        const state = get();
        return (
          state.isLoggedIn &&
          (state.role === "admin" ||
            state.role === "editor" ||
            state.role === "analyst")
        );
      },

      canEditEmployees: () => {
        const state = get();
        return (
          state.isLoggedIn &&
          (state.role === "admin" || state.role === "editor")
        );
      },

      canViewEmployees: () => {
        const state = get();
        return (
          state.isLoggedIn &&
          (state.role === "admin" || state.role === "editor")
        );
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
