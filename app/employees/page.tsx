import { EmployeeTable } from "@/components/employees/employee-table";
import AddEmployeeButton from "@/components/employees/add/add-employee-button";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { getEmployeesByProgramName } from "../actions/employees-action";
import { Employee } from "@/types/employees";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SectionHeader } from "@/components/ui/section-header";
import { Zap } from "lucide-react";

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
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />
        <SectionHeader
          title="Manage Employees"
          description="View, edit, add and delete employee details and skills"
          icon={<Zap className="h-6 w-6 text-blue-600" />}
          gradient="from-blue-200 to-indigo-100"
        >
          <AddEmployeeButton />
        </SectionHeader>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden my-10">
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
