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
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const hydrated = useAuthStore((s) => s.hydrated);
  const role = useAuthStore((s) => s.role);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated) return;

    // If not logged in and not on login page, redirect to login
    if (!isLoggedIn && pathname !== "/login") {
      console.log("Not logged in, redirecting to login");
      router.replace(`/login?redirectedFrom=${encodeURIComponent(pathname)}`);
      return;
    }

    // If logged in and on login page, redirect to home
    if (isLoggedIn && pathname === "/login") {
      console.log("Already logged in, redirecting to home");
      router.replace("/");
      return;
    }

    // If role is required and user doesn't have it, redirect
    if (requiredRole && role !== requiredRole) {
      console.log(
        `Required role: ${requiredRole}, user role: ${role}, redirecting`
      );
      if (requiredRole === "admin") {
        // If admin role required but user is not admin, redirect to home
        router.replace("/");
      } else {
        // For other role requirements, redirect to login
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
