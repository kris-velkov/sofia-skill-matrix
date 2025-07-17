"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CategoryNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onConfirm: (newName: string) => void;
  isLoading?: boolean;
}

export function CategoryNameDialog({
  open,
  onOpenChange,
  currentName,
  onConfirm,
  isLoading = false,
}: CategoryNameDialogProps) {
  const [newName, setNewName] = useState(currentName);

  const handleConfirm = () => {
    if (newName.trim() && newName.trim() !== currentName) {
      onConfirm(newName.trim());
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(isOpen);
      if (!isOpen) {
        setNewName(currentName);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-white p-6 shadow-lg rounded-lg">
        <DialogHeader className="mb-2">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Change Category Name
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-left pt-2 pb-4">
          <div className="space-y-2">
            <div className="text-gray-700 mb-4">
              You are about to change the category name from{" "}
              <strong className="font-semibold text-gray-900">
                {currentName}
              </strong>{" "}
              to a new name.
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm">
              <div className="text-amber-800 text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <strong>Warning: This change will affect all employees</strong>
              </div>
              <div className="text-amber-700 text-sm mt-2 ml-6">
                This category name will be updated for all employees who have
                skills in this category.
              </div>
            </div>
          </div>
        </DialogDescription>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category-name">New Category Name</Label>
            <Input
              id="category-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new category name"
              disabled={isLoading}
              className="w-full"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 gap-3">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
            className="border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              isLoading || !newName.trim() || newName.trim() === currentName
            }
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
          >
            {isLoading ? "Updating..." : "Update Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
