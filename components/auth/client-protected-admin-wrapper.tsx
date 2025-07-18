"use client";

import ProtectedRoute from "./protected-route";

interface ClientProtectedAdminWrapperProps {
  children: React.ReactNode;
}

export default function ClientProtectedAdminWrapper({
  children,
}: ClientProtectedAdminWrapperProps) {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
}
