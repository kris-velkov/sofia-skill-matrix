"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  viewLabel?: string;
  variant?: "inline" | "dropdown";
  size?: "sm" | "md" | "lg";
}

export function ActionButtons({
  onEdit,
  onDelete,
  onView,
  editLabel = "Edit",
  deleteLabel = "Delete",
  viewLabel = "View",
  variant = "inline",
}: ActionButtonsProps) {
  const actions = [
    {
      action: onView,
      label: viewLabel,
      icon: Eye,
      color:
        "text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-gray-200 hover:border-blue-300",
    },
    {
      action: onEdit,
      label: editLabel,
      icon: Edit,
      color:
        "text-gray-600 hover:text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300",
    },
    {
      action: onDelete,
      label: deleteLabel,
      icon: Trash2,
      color:
        "text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200 hover:border-red-300",
    },
  ].filter(({ action }) => action);

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-white border-gray-200 shadow-lg"
        >
          {actions.map(({ action, label, icon: Icon }) => (
            <DropdownMenuItem
              key={label}
              onClick={action}
              className="cursor-pointer hover:bg-gray-50 flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex justify-end gap-2">
      {actions.map(({ action, label, icon: Icon, color }) => (
        <Button
          key={label}
          variant="outline"
          onClick={action}
          className={`transition-all duration-200 ${color} shadow-sm hover:shadow-md`}
          title={label}
        >
          <Icon className="h-4 w-4" />
          <span className="sr-only">{label}</span>
        </Button>
      ))}
    </div>
  );
}
