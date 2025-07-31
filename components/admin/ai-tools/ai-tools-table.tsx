"use client";

import { DataTable } from "@/components/ui/data-table";
import { ActionButtons } from "@/components/ui/action-buttons";
import { Badge } from "@/components/ui/badge";
import { Bot, GripVertical } from "lucide-react";
import { SupabaseAiTool } from "@/types/employees";

interface AiToolsTableProps {
  tools: SupabaseAiTool[];
  onEditTool: (tool: SupabaseAiTool) => void;
  onDeleteTool: (tool: SupabaseAiTool) => void;
}

export function AiToolsTable({
  tools,
  onEditTool,
  onDeleteTool,
}: AiToolsTableProps) {
  const columns = [
    {
      key: "name",
      header: "Tool Name",
      cell: (tool: SupabaseAiTool) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-400">
            <GripVertical className="h-4 w-4" />
            <div className="p-1.5 bg-blue-100 rounded-md">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <span className="font-medium text-gray-900">{tool.name}</span>
        </div>
      ),
    },
    {
      key: "order",
      header: "Order",
      cell: (tool: SupabaseAiTool) => (
        <Badge className="bg-gray-200 border-gray-200">
          {tool.order_number}
        </Badge>
      ),
      className: "hidden sm:table-cell",
    },
    {
      key: "created",
      header: "Created",
      cell: (tool: SupabaseAiTool) => (
        <span className="text-sm text-gray-600">
          {tool.created_at
            ? new Date(tool.created_at).toLocaleDateString()
            : "N/A"}
        </span>
      ),
      className: "hidden md:table-cell",
    },
    {
      key: "actions",
      header: "Actions",
      cell: (tool: SupabaseAiTool) => (
        <ActionButtons
          onEdit={() => onEditTool(tool)}
          onDelete={() => onDeleteTool(tool)}
          variant="inline"
        />
      ),
      className: "text-right",
    },
  ];

  return (
    <DataTable<SupabaseAiTool>
      data={tools}
      columns={columns}
      searchPlaceholder="Search AI tools..."
      searchKeys={["name"]}
      emptyState={{
        icon: <Bot className="h-12 w-12" />,
        title: "No AI tools found",
        description: "Create your first AI tool to get started",
      }}
    />
  );
}
