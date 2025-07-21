"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { supabaseAuthClient } from "@/lib/supabase/supabaseAuthClient";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setHydrated = useAuthStore((state) => state.setHydrated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        const {
          data: { session },
        } = await supabaseAuthClient.auth.getSession();

        if (session?.user) {
          console.log("Session found during initialization:", session.user.id);

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
        } else {
          console.log("No session found during initialization");
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
    const {
      data: { subscription },
    } = supabaseAuthClient.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);

      if (
        (event === "SIGNED_IN" || event === "USER_UPDATED") &&
        session?.user
      ) {
        console.log("User signed in:", session.user.id);

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
        console.log("User signed out");
        logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [login, logout]);

  // Show a loading spinner while initializing auth
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
