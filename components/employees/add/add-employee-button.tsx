"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { addNewEmployee } from "@/app/actions/employee-actions";

export const AddEmployeeButton: React.FC = () => {
  const handleAddNewEmployee = async () => {
    try {
      const res = await addNewEmployee();
      if (!res.ok) throw new Error("Failed to add employee");
      toast.success("Employee added successfully!");
    } catch (error) {
      toast.error("Error adding employee.");
    }
  };

  return (
    <Button
      type="button"
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow flex items-center gap-2"
      onClick={handleAddNewEmployee}
    >
      <Plus className="mr-2 h-5 w-5" />
      Add New Employee
    </Button>
  );
};

export default AddEmployeeButton;
