"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { UserRole } from "@/store/use-auth-store";

type PermissionCheck =
  | "canManageEmployees"
  | "canViewStatistics"
  | "canEditEmployees"
  | "canViewEmployees";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: PermissionCheck;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
}: ProtectedRouteProps) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const hydrated = useAuthStore((s) => s.hydrated);
  const role = useAuthStore((s) => s.role);
  const canManageEmployees = useAuthStore((s) => s.canManageEmployees());
  const canViewStatistics = useAuthStore((s) => s.canViewStatistics());
  const canEditEmployees = useAuthStore((s) => s.canEditEmployees());
  const canViewEmployees = useAuthStore((s) => s.canViewEmployees());
  const router = useRouter();
  const pathname = usePathname();

  const getPermissionValue = (permission: PermissionCheck) => {
    switch (permission) {
      case "canManageEmployees":
        return canManageEmployees;
      case "canViewStatistics":
        return canViewStatistics;
      case "canEditEmployees":
        return canEditEmployees;
      case "canViewEmployees":
        return canViewEmployees;
      default:
        return false;
    }
  };

  const hasPermission = requiredPermission
    ? getPermissionValue(requiredPermission)
    : true;
  const hasRole = requiredRole ? role === requiredRole : true;

  useEffect(() => {
    if (!hydrated) return;

    if (!isLoggedIn && pathname !== "/login") {
      router.replace("/login");
      return;
    }

    if (isLoggedIn && pathname === "/login") {
      router.replace("/");
      return;
    }

    if (!hasPermission || !hasRole) {
      router.replace("/");
    }
  }, [isLoggedIn, pathname, router, hydrated, hasPermission, hasRole]);

  if (!hydrated) {
    return <LoadingSpinner />;
  }

  if (!isLoggedIn && pathname !== "/login") {
    return null;
  }

  if (!hasPermission || !hasRole) {
    return null;
  }

  return <>{children}</>;
}
