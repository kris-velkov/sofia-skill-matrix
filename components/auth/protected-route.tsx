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

    if (!isLoggedIn && pathname !== "/login") {
      router.replace(`/login?redirectedFrom=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isLoggedIn && pathname === "/login") {
      router.replace("/");
      return;
    }

    if (requiredRole && role !== requiredRole) {
      if (requiredRole === "admin") {
        router.replace("/");
      } else {
        router.replace(`/login?redirectedFrom=${encodeURIComponent(pathname)}`);
      }
    }
  }, [isLoggedIn, pathname, router, hydrated, role, requiredRole]);

  if (!hydrated) {
    return <LoadingSpinner />;
  }

  if (!isLoggedIn && pathname !== "/login") {
    return null;
  }

  if (requiredRole && role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
