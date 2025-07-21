"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { UserRole } from "@/store/use-auth-store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  // Always use hooks at the top level, regardless of conditions
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const hydrated = useAuthStore((s) => s.hydrated);
  const role = useAuthStore((s) => s.role);
  const router = useRouter();
  const pathname = usePathname();

  // Handle authentication and authorization
  useEffect(() => {
    // Skip if not hydrated yet
    if (!hydrated) return;

    // Redirect if not logged in
    if (!isLoggedIn && pathname !== "/login") {
      console.log("Not logged in, redirecting to login");
      router.replace(`/login?redirectedFrom=${encodeURIComponent(pathname)}`);
      return;
    }

    // Redirect if logged in but on login page
    if (isLoggedIn && pathname === "/login") {
      console.log("Already logged in, redirecting to home");
      router.replace("/");
      return;
    }

    // Redirect if role requirement not met
    if (requiredRole && role !== requiredRole) {
      console.log(
        `Required role: ${requiredRole}, user role: ${role}, redirecting`
      );
      if (requiredRole === "admin") {
        router.replace("/");
      } else {
        router.replace(`/login?redirectedFrom=${encodeURIComponent(pathname)}`);
      }
    }
  }, [isLoggedIn, pathname, router, hydrated, role, requiredRole]);

  // Show loading spinner while hydrating
  if (!hydrated) {
    return <LoadingSpinner />;
  }

  // Don't render anything if not logged in (except on login page)
  if (!isLoggedIn && pathname !== "/login") {
    return null;
  }

  // Don't render if role requirement not met
  if (requiredRole && role !== requiredRole) {
    return null;
  }

  // Otherwise render children
  return <>{children}</>;
}
