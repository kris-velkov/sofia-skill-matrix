"use server";

import { getEmployees } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { EmployeeTable } from "@/components/employees/employee-table";

export default async function EmployeesPage() {
  const employees = await getEmployees();
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto grid gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight mb-1">
                Manage Employees
              </h2>
              <p className="text-gray-600 text-base">
                View, edit, add, and delete employee details and skills.
              </p>
            </div>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow flex items-center gap-2"
            >
              <Link href="/employees/add">
                <Plus className="mr-2 h-5 w-5" />
                Add New Employee
              </Link>
            </Button>
          </div>
          <EmployeeTable initialEmployees={employees} />
        </div>
      </div>
    </div>
  );
}
