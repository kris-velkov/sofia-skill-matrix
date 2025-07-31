"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function FormDialog({
  open,
  onOpenChange,
  title,
  icon,
  children,
  footer,
  maxWidth = "md",
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`bg-white ${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-y-auto`}
      >
        <DialogHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              {icon && <span className="text-blue-600">{icon}</span>}
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4">{children}</div>

        {footer && (
          <div className="pt-4 border-t border-gray-100">{footer}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
