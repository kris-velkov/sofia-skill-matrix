import { Employee } from "@/types/employees";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "admin" | "user" | null;

interface AuthState {
  isLoggedIn: boolean;
  role: UserRole;
  hydrated: boolean;
  user: Employee | null;
}

interface AuthActions {
  login: (role: UserRole, user?: Employee) => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
  updateRole: (role: UserRole) => void;
}

interface AuthSelectors {
  isAdmin: () => boolean;
}

type AuthStore = AuthState & AuthActions & AuthSelectors;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      role: null,
      user: null,
      hydrated: false,
      login: (role, user?: Employee) =>
        set({ isLoggedIn: true, role, user: user ?? null }),
      logout: () => set({ isLoggedIn: false, role: null, user: null }),
      setHydrated: (hydrated) => set({ hydrated }),
      updateRole: (role) => set({ role }),
      isAdmin: () => get().isLoggedIn && get().role === "admin",
    }),
    {
      name: "auth-store",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
