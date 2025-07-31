"use client";

import ProtectedRoute from "./protected-route";

interface EmployeeManagementWrapperProps {
  children: React.ReactNode;
}

export default function EmployeeManagementWrapper({
  children,
}: EmployeeManagementWrapperProps) {
  return (
    <ProtectedRoute requiredPermission="canManageEmployees">
      {children}
    </ProtectedRoute>
  );
}
