"use client";

import { DataTable } from "@/components/ui/data-table";
import { ActionButtons } from "@/components/ui/action-buttons";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GripVertical } from "lucide-react";
import { Program } from "@/types/programs";

interface ProgramsTableProps {
  programs: Program[];
  onEditProgram: (program: Program) => void;
  onDeleteProgram: (program: Program) => void;
}

export function ProgramsTable({
  programs,
  onEditProgram,
  onDeleteProgram,
}: ProgramsTableProps) {
  const columns = [
    {
      key: "label",
      header: "Program Name",
      cell: (program: Program) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-400">
            <GripVertical className="h-4 w-4" />
            <div className="p-1.5 bg-orange-100 rounded-md">
              <Briefcase className="h-4 w-4 text-orange-600" />
            </div>
          </div>
          <span className="font-medium text-gray-900">{program.label}</span>
        </div>
      ),
    },
    {
      key: "value",
      header: "Value",
      cell: (program: Program) => (
        <Badge className="bg-gray-200 border-gray-200 font-mono text-xs">
          {program.value}
        </Badge>
      ),
      className: "hidden sm:table-cell",
    },
    {
      key: "order",
      header: "Order",
      cell: (program: Program) => (
        <Badge className="bg-gray-200 border-gray-200">
          {program.order_index}
        </Badge>
      ),
      className: "hidden sm:table-cell",
    },
    {
      key: "created",
      header: "Created",
      cell: (program: Program) => (
        <span className="text-sm text-gray-600">
          {program.created_at
            ? new Date(program.created_at).toLocaleDateString()
            : "N/A"}
        </span>
      ),
      className: "hidden md:table-cell",
    },
    {
      key: "actions",
      header: "Actions",
      cell: (program: Program) => (
        <ActionButtons
          onEdit={() => onEditProgram(program)}
          onDelete={() => onDeleteProgram(program)}
          variant="inline"
        />
      ),
      className: "text-right",
    },
  ];

  return (
    <DataTable<Program>
      data={programs}
      columns={columns}
      searchPlaceholder="Search programs..."
      searchKeys={["label", "value"]}
      emptyState={{
        icon: <Briefcase className="h-12 w-12" />,
        title: "No programs found",
        description: "Create your first program to get started",
      }}
    />
  );
}
