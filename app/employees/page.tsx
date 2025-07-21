import { EmployeeTable } from "@/components/employees/employee-table";
import AddEmployeeButton from "@/components/employees/add/add-employee-button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Metadata } from "next";
import { getEmployees } from "@/lib/employees";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const revalidate = 0;

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

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Manage Employees" },
  ];

  return (
    <section
      className="flex flex-col min-h-screen"
      aria-labelledby="employees-page-title"
    >
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-7xl mx-auto grid gap-4 sm:gap-6 md:gap-8">
          <Breadcrumbs items={breadcrumbItems} />
          <Card className="border-0 bg-white/90">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl sm:text-2xl md:text-3xl text-blue-900 mb-1">
                  Manage Employees
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm md:text-base">
                  View, edit, add, and delete employee details and skills.
                </CardDescription>
              </div> 
              <div className="w-full sm:w-auto mt-2 sm:mt-0">
                <AddEmployeeButton />
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto px-2 sm:px-6">
              <div className="min-w-full">
                <EmployeeTable initialEmployees={employees} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
