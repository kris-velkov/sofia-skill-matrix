"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import type { Employee } from "@/lib/types";
import { EmployeeAvatar } from "./employee-avatar";
import { deleteEmployeeAction } from "@/app/actions/delete-user-actions";

interface EmployeeTableProps {
  initialEmployees: Employee[];
}

export function EmployeeTable({ initialEmployees }: EmployeeTableProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  useMemo(() => {
    setEmployees(initialEmployees);
  }, [initialEmployees]);

  const confirmDelete = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (employeeToDelete) {
      const result = await deleteEmployeeAction(employeeToDelete.id);
      if (result?.success === false) {
        toast.error(result.message);
      } else {
        setEmployees((prev) =>
          prev.filter((emp) => emp.id !== employeeToDelete.id)
        );
        toast.success(
          `${employeeToDelete.firstName} ${employeeToDelete.lastName} ${result.message}`
        );
      }
      setEmployeeToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) {
      return employees;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return employees.filter(
      (employee) =>
        employee?.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
        employee.department.toLowerCase().includes(lowerCaseSearchTerm) ||
        employee.badge?.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [employees, searchTerm]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 ">
        <Input
          type="text"
          placeholder="Search employees by name, department, or badge..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md w-full md:w-auto border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm min-w-[250px] md:min-w-[450px] mb-4 md:mb-0 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-white"
        />
      </div>
      <div className="w-full overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
        <Table className="min-w-[600px] md:min-w-[900px] w-full text-sm md:text-base">
          <TableHeader className="sticky top-0 z-10 bg-white">
            <TableRow>
              <TableHead className="w-[160px] md:w-[200px] py-3 md:py-4 px-3 md:px-6 text-base font-semibold text-gray-900 border-r border-gray-100">
                Employee
              </TableHead>
              <TableHead className="py-3 md:py-4 px-3 md:px-6 text-base font-semibold text-gray-900 border-r border-gray-100">
                Department
              </TableHead>
              <TableHead className="py-3 md:py-4 px-3 md:px-6 text-base font-semibold text-gray-900 border-r border-gray-100">
                Experience
              </TableHead>
              <TableHead className="py-3 md:py-4 px-3 md:px-6 text-base font-semibold text-gray-900 border-r border-gray-100">
                Badge
              </TableHead>
              <TableHead className="py-3 md:py-4 px-3 md:px-6 text-base font-semibold text-gray-900 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-gray-500 border-b border-gray-100"
                >
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow
                  key={employee.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="w-[300] font-medium py-5 md:py-5 px-5 md:px-5 border-r border-gray-100">
                    <div className="flex items-center gap-2 md:gap-3">
                      <EmployeeAvatar
                        src={employee.slackProfileImage}
                        alt={employee.firstName + " profile picture"}
                      />
                      <div>
                        <div className="text-gray-900 text-base leading-tight">
                          {employee.firstName + " " + employee.lastName}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 md:py-4 px-3 md:px-6 border-r border-gray-100 text-gray-800">
                    {employee.department}
                  </TableCell>
                  <TableCell className="py-3 md:py-4 px-3 md:px-6 border-r border-gray-100 text-gray-800">
                    {employee.careerExperience}
                  </TableCell>
                  <TableCell className="py-3 md:py-4 px-3 md:px-6 border-r border-gray-100 text-gray-800">
                    {employee.badge ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right py-3 md:py-4 px-3 md:px-6">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-9 w-9 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                      >
                        <Link
                          href={`/employees/${employee.id}/edit`}
                          aria-label={`Edit ${employee.name}`}
                        >
                          <Pencil className="h-5 w-5" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(employee)}
                        aria-label={`Delete ${employee.name}`}
                        className="h-9 w-9 rounded-full text-red-500 hover:bg-red-100 hover:text-red-700 focus:ring-2 focus:ring-red-200 focus:outline-none"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Confirm Deletion"
        description={`Are you sure you want to delete ${employeeToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setEmployeeToDelete(null);
        }}
      />
    </>
  );
}
