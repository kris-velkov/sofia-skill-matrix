"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, X, Check } from "lucide-react";
interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  submitDisabled?: boolean;
}

export function FormActions({
  onCancel,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isLoading = false,
  submitDisabled = false,
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
      >
        <X className="w-4 h-4 mr-2" />
        {cancelLabel}
      </Button>
      <Button
        type="button"
        onClick={onSubmit}
        disabled={isLoading || submitDisabled}
        className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            {submitLabel}
          </div>
        )}
      </Button>
    </div>
  );
}
