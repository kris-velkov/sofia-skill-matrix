"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pencil, Plus, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import type { Employee } from "@/lib/types"
import { deleteEmployeeAction } from "@/app/actions" // Import the delete Server Action
import { useAuth } from "@/hooks/use-auth" // Import useAuth

interface EmployeeTableProps {
  initialEmployees: Employee[]
}

export function EmployeeTable({ initialEmployees }: EmployeeTableProps) {
  const { isAdmin } = useAuth() // Get isAdmin status
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Update employees state when initialEmployees prop changes (e.g., after add/edit)
  useMemo(() => {
    setEmployees(initialEmployees)
  }, [initialEmployees])

  const confirmDelete = (employee: Employee) => {
    setEmployeeToDelete(employee)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirmed = async () => {
    if (employeeToDelete) {
      const result = await deleteEmployeeAction(employeeToDelete.id)
      if (result?.success) {
        toast.success(result.message)
        setEmployees((prev) => prev.filter((emp) => emp.id !== employeeToDelete.id))
      } else {
        toast.error(result?.message || "Failed to delete employee.")
      }
      setEmployeeToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) {
      return employees
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        employee.department.toLowerCase().includes(lowerCaseSearchTerm) ||
        employee.badge?.toLowerCase().includes(lowerCaseSearchTerm),
    )
  }, [employees, searchTerm])

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Input
          type="text"
          placeholder="Search employees by name, department, or badge..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        {isAdmin && ( // Conditionally render Add New Employee button
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
            <Link href="/employees/add">
              <Plus className="mr-2 h-4 w-4" />
              Add New Employee
            </Link>
          </Button>
        )}
      </div>

      <div className="rounded-md border bg-white dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Badge</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}{" "}
              {/* Conditionally render Actions header */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 5 : 4} className="h-24 text-center text-gray-500 dark:text-gray-400">
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={employee.slackProfileImage || "/placeholder.svg?height=48&width=48&query=user+avatar"}
                        />
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-50">{employee.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{employee.department}</div>
                      </div>
                    </div>{" "}
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.careerExperience}</TableCell>
                  <TableCell>{employee.badge || "N/A"}</TableCell>
                  {isAdmin && ( // Conditionally render Actions column
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 rounded-full text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <Link href={`/employees/${employee.id}/edit`} aria-label={`Edit ${employee.name}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDelete(employee)}
                          aria-label={`Delete ${employee.name}`}
                          className="h-8 w-8 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {employeeToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteConfirmed}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
