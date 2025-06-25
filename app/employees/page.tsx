"use client"
import { DashboardHeader } from "@/components/dashboard/header"
import { EmployeeTable } from "@/components/employees/employee-table"
import { getEmployees } from "@/lib/db"
import { Button } from "@/components/ui/button" // Ensure Button is imported
import Link from "next/link" // Ensure Link is imported
import { Plus } from "lucide-react" // Ensure Plus icon is imported

export default async function EmployeesPage() {
  const employees = await getEmployees()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid gap-6">
          <div className="flex items-center justify-between">
            {" "}
            {/* This is the target div */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Manage Employees</h2>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Link href="/employees/add">
                <Plus className="mr-2 h-4 w-4" />
                Add New Employee
              </Link>
            </Button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">View, edit, add, and delete employee details and skills.</p>

          <EmployeeTable initialEmployees={employees} />
        </div>
      </main>
    </div>
  )
}
