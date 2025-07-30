"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { createClient } from "@/lib/supabase/client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setHydrated = useAuthStore((state) => state.setHydrated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const supabase = await createClient();
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const userRole = session.user.user_metadata?.role as
            | "admin"
            | "user"
            | undefined;

          const authUser = {
            id: session.user.id,
            email: session.user.email,
            user_metadata: {
              ...session.user.user_metadata,
              role: userRole || "user",
            },
            app_metadata: session.user.app_metadata,
          };

          const employeeData = {
            id: session.user.id,
            firstName: session.user.user_metadata?.first_name || "",
            lastName: session.user.user_metadata?.last_name || "",
            skills: [],
          };

          login(authUser, employeeData);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setHydrated(true);
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [login, setHydrated]);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (
        (event === "SIGNED_IN" || event === "USER_UPDATED") &&
        session?.user
      ) {
        const userRole = session.user.user_metadata?.role as
          | "admin"
          | "user"
          | undefined;

        const authUser = {
          id: session.user.id,
          email: session.user.email,
          user_metadata: {
            ...session.user.user_metadata,
            role: userRole || "user",
          },
          app_metadata: session.user.app_metadata,
        };

        const employeeData = {
          id: session.user.id,
          firstName: session.user.user_metadata?.first_name || "",
          lastName: session.user.user_metadata?.last_name || "",
          skills: [],
        };

        login(authUser, employeeData);
      } else if (event === "SIGNED_OUT") {
        logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [login, logout]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
