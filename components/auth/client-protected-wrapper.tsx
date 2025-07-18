"use client";

import ProtectedRoute from "./protected-route";
import type { UserRole } from "@/store/use-auth-store";

interface ClientProtectedWrapperProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function ClientProtectedWrapper({
  children,
  requiredRole,
}: ClientProtectedWrapperProps) {
  return (
    <ProtectedRoute requiredRole={requiredRole}>{children}</ProtectedRoute>
  );
}
