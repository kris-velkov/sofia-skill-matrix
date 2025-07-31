"use client";

import ProtectedRoute from "./protected-route";

interface StatisticsViewerWrapperProps {
  children: React.ReactNode;
}

export default function StatisticsViewerWrapper({
  children,
}: StatisticsViewerWrapperProps) {
  return (
    <ProtectedRoute requiredPermission="canViewStatistics">
      {children}
    </ProtectedRoute>
  );
}
