"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import type { Employee } from "@/lib/types";
import { deleteEmployeeAction } from "@/app/actions";
import { EmployeeAvatar } from "./employee-avatar";
import { useRouter } from "next/navigation";

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
  const [adding, setAdding] = useState(false);
  const router = useRouter();

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
      if (result?.message) {
        toast.error(result.message);
      } else {
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

  const handleAddEmployee = () => {
    setAdding(true);
    router.push("/employees/add");
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search employees by name, department, or badge..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md w-full md:w-auto border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm w-full md:w-auto min-w-[450px] mb-4 md:mb-0 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-white"
        />
      </div>
      <div className="overflow-x-auto rounded-2xl shadow border border-gray-200 bg-white">
        <Table className="min-w-[700px]">
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
                <TableRow
                  key={employee.id}
                  className="hover:bg-blue-50 transition-colors"
                >
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
                  <TableCell>{employee.badge ?? "N/A"}</TableCell>
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
