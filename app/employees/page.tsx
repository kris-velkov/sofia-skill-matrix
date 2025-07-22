import { EmployeeTable } from "@/components/employees/employee-table";
import AddEmployeeButton from "@/components/employees/add/add-employee-button";
import { Metadata } from "next";
import { getEmployees } from "@/lib/employees";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

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

export default async function EmployeesPage() {
  const employees = await getEmployees();

  const breadcrumbItems = [{ label: "Manage Employees" }];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />

        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Manage Employees
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                View, edit, add, and delete employee details and skills.
              </p>
            </div>
            <div className="w-full sm:w-auto mt-3 sm:mt-0">
              <AddEmployeeButton />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <EmployeeTable initialEmployees={employees} />
          </div>
        </div>
      </div>
    </div>
  );
}
