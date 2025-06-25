"use client";
import { DashboardHeader } from "@/components/dashboard/header";
import { getEmployees } from "@/lib/db"; // This import might be problematic if getEmployees is a server function and this is a client component.
import type { Employee } from "@/lib/types";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { useAuth } from "@/hooks/use-auth"; // Import useAuth
import { LoginForm } from "@/components/auth/login-form"; // Import LoginForm
import { LoadingSpinner } from "@/components/loading-spinner"; // Import LoadingSpinner
import { useEffect, useState } from "react"; // Import useEffect and useState for client-side data fetching

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeesData = async () => {
      if (isAuthenticated) {
        setDataLoading(true);
        try {
          // Fetch initial data on the client side if authenticated
          const fetchedEmployees: Employee[] = await getEmployees(); // This will need to be a client-callable API route or a Server Action
          setEmployees(fetchedEmployees);
        } catch (error) {
          console.error("Failed to fetch employees:", error);
          // Handle error, maybe show a toast
        } finally {
          setDataLoading(false);
        }
      } else {
        setDataLoading(false); // If not authenticated, no data to load
      }
    };
    fetchEmployeesData();
  }, [isAuthenticated]); // Re-run when authentication status changes

  if (isLoading || dataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
        <LoadingSpinner />
      </div>
    );
  }

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
