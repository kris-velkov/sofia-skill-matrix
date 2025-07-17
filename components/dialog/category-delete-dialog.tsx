"use client";

import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CategoryDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryName: string;
  isOriginal: boolean;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function CategoryDeleteDialog({
  open,
  onOpenChange,
  categoryName,
  isOriginal,
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

        <DialogDescription className="text-sm text-muted-foreground text-left pt-2 pb-4">
          {isOriginal ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
              <p className="text-red-800 text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                This is an original category and cannot be deleted
              </p>
              <p className="text-red-700 text-sm mt-2 ml-6">
                Original categories are system-defined and required for proper
                functioning.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mb-4">
                You are about to delete the category{" "}
                <span className="font-semibold text-gray-900">
                  {categoryName}
                </span>
                .
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
                <p className="text-red-800 text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <strong>Warning: This action cannot be undone</strong>
                </p>
                <p className="text-red-700 text-sm mt-2 ml-6">
                  Deleting this category will remove it and all associated
                  skills from all employees.
                </p>
              </div>
            </>
          )}
        </DialogDescription>

        <DialogFooter className="mt-6 gap-3">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
            className="border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Button>
          {!isOriginal && (
            <Button
              onClick={onConfirm}
              disabled={isLoading || isOriginal}
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
