"use client";

import ProtectedRoute from "./protected-route";

interface AdminOnlyWrapperProps {
  children: React.ReactNode;
}

export default function AdminOnlyWrapper({ children }: AdminOnlyWrapperProps) {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
}
