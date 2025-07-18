"use client";

import { Trash2, AlertTriangle, Loader2, User2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CategoryDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryName: string;
  isDefault: boolean;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function CategoryDeleteDialog({
  open,
  onOpenChange,
  categoryName,
  isDefault,
  onConfirm,
  isLoading = false,
}: CategoryDeleteDialogProps) {
  const handleOpenChange = (isOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(isOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-white p-6 shadow-lg rounded-lg">
        <DialogHeader className="mb-2">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Category
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground text-left pt-2 pb-4">
          {isDefault ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm">
              <div className="text-amber-800 text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <strong>
                  This is a default category and cannot be deleted!
                </strong>
              </div>
              <div className="text-amber-700 text-sm mt-2 ml-7">
                <p className="mb-2">
                  Default categories are system-defined and required for proper
                  functioning of the employee management system.
                </p>
                <p className="flex items-center gap-1.5">
                  <User2 className="h-4 w-4" />
                  <span>Need help? Contact:</span>
                  <Link
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    href="https://www.linkedin.com/in/kristiyanvelkov/"
                    target="_blank"
                  >
                    Kristiyan Velkov
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="text-gray-700 mb-4">
                You are about to delete the category{" "}
                <span className="font-semibold text-gray-900">
                  {categoryName}
                </span>
                .
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
                <div className="text-red-800 text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <strong>Warning: This action cannot be undone</strong>
                </div>
                <div className="text-red-700 text-sm mt-2 ml-6">
                  Deleting this category will remove it and all associated
                  skills from all employees.
                </div>
              </div>
            </>
          )}
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
          {!isDefault && (
            <Button
              onClick={onConfirm}
              disabled={isLoading || isDefault}
              className="bg-red-600 hover:bg-red-700 text-white transition-colors shadow-sm"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Deleting...
                </span>
              ) : (
                <span className="flex items-center">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Category
                </span>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
