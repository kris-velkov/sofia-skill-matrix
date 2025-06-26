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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import type { Employee } from "@/lib/types";
import { deleteEmployeeAction } from "@/app/actions"; // Import Server Action
import { EmployeeAvatar } from "./employee-avatar";

interface EmployeeTableProps {
  initialEmployees: Employee[];
}

export function EmployeeTable({ initialEmployees }: EmployeeTableProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees); // Manage local state for immediate UI updates
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Update local state if initialEmployees prop changes (e.g., after a server action revalidates)
  useMemo(() => {
    setEmployees(initialEmployees);
  }, [initialEmployees]);

  const confirmDelete = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (employeeToDelete) {
      const result = await deleteEmployeeAction(employeeToDelete.id); // Call Server Action
      if (result?.message) {
        toast.error(result.message);
      } else {
        // Optimistically update UI or re-fetch if needed (Server Action revalidates path)
        // For this demo, the revalidatePath in the action will cause a full page refresh,
        // so local state update here is less critical but good practice for responsiveness.
        setEmployees((prev) =>
          prev.filter((emp) => emp.id !== employeeToDelete.id)
        );
        toast.success(`${employeeToDelete.name} deleted successfully!`);
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
        employee.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        employee.department.toLowerCase().includes(lowerCaseSearchTerm) ||
        employee.badge?.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [employees, searchTerm]);

  return (
    <>
      {/* Search Input */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search employees by name, department, or badge..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Badge</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-gray-500"
                >
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <EmployeeAvatar
                        src={employee.slackProfileImage}
                        alt={employee.name + " profile picture"}
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {employee.department}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.careerExperience}</TableCell>
                  <TableCell>{employee.badge || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8 rounded-full text-gray-500 hover:text-blue-600"
                      >
                        <Link
                          href={`/employees/${employee.id}/edit`}
                          aria-label={`Edit ${employee.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(employee)}
                        aria-label={`Delete ${employee.name}`}
                        className="h-8 w-8 rounded-full text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
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
              Are you sure you want to delete {employeeToDelete?.name}? This
              action cannot be undone.
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
  );
}
