import { EmployeeTable } from "@/components/employees/employee-table";
import AddEmployeeButton from "@/components/employees/add/add-employee-button";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { getEmployeesByProgramName } from "../actions/employees-action";
import { Employee } from "@/types/employees";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata: Metadata = {
  title: "Manage Employees – Jakala Skill Matrix",
  description: "View, edit, add, and delete employee details and skills.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

async function EmployeesContent() {
  let employees: Employee[] = [];

  try {
    employees = await getEmployeesByProgramName();
  } catch (error) {
    console.error("Failed to load employees:", error);
    employees = [];
  }

  return <EmployeeTable initialEmployees={employees} />;
}

export default function EmployeesPage() {
  const breadcrumbItems = [{ label: "Manage Employees" }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} className="mb-4" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Manage Employees
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
                View, edit, add and delete employee details and skills.
              </p>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <AddEmployeeButton />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            }
          >
            <EmployeesContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
