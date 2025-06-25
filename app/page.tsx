import { DashboardClient } from "@/components/dashboard/dashboard-client";
import type { Employee } from "@/lib/types";

async function fetchEmployees(): Promise<Employee[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/employees`);
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage() {
  const employees = await fetchEmployees();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="flex-1 p-4 md:p-6 mt-10">
        <div className="max-w-7xl mx-auto grid gap-10">
          <DashboardClient employees={employees} />
        </div>
      </main>
    </div>
  );
}
