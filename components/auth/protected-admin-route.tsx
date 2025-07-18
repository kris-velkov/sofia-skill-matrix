"use client";

import { ReactNode } from "react";
import ProtectedRoute from "./protected-route";

type ProtectedAdminRouteProps = {
  children: ReactNode;
};

export default function ProtectedAdminRoute({
  children,
}: Readonly<ProtectedAdminRouteProps>) {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
}
