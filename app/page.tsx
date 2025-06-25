"use client";
import { useEffect, useState } from "react";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/hooks/use-auth";
import { getEmployees } from "@/lib/db";
import type { Employee } from "@/lib/types";
import DashboardHeader from "@/components/dashboard/header";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    getEmployees()
      .then(setEmployees)
      .catch(() => setEmployees([]));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 mt-10">
        <div className="max-w-7xl mx-auto grid gap-10">
          <DashboardClient employees={employees} />
        </div>
      </main>
    </div>
  );
}
