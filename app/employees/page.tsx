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

  return (
    <section
      className="flex flex-col min-h-screen"
      aria-labelledby="employees-page-title"
    >
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto grid gap-8">
          <Card className="border-0 bg-white/90">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-3xl text-blue-900 mb-1">
                  Manage Employees
                </CardTitle>
                <CardDescription>
                  View, edit, add, and delete employee details and skills.
                </CardDescription>
              </div>
              <AddEmployeeButton />
            </CardHeader>
            <CardContent>
              <EmployeeTable initialEmployees={employees} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
