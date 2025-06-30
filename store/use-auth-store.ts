import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "admin" | "user" | null;

interface AuthState {
  isLoggedIn: boolean;
  role: UserRole;
  hydrated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
}
export const useAuthStore = create<AuthState & { isAdmin: () => boolean }>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      role: null,
      hydrated: false,
      login: (role) => set({ isLoggedIn: true, role }),
      logout: () => set({ isLoggedIn: false, role: null }),
      setHydrated: (hydrated) => set({ hydrated }),
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
