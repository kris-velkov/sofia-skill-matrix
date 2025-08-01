"use client";

import { DataTable } from "@/components/ui/data-table";
import { ActionButtons } from "@/components/ui/action-buttons";
import { Badge } from "@/components/ui/badge";
import { Zap, GripVertical } from "lucide-react";
import { Skill } from "@/types/skills";

interface SkillsTableProps {
  skills: Skill[];
  onEditSkill: (skill: Skill) => void;
  onDeleteSkill: (skill: Skill) => void;
}

export function SkillsTable({
  skills,
  onEditSkill,
  onDeleteSkill,
}: SkillsTableProps) {
  const columns = [
    {
      key: "name",
      header: "Skill Name",
      cell: (skill: Skill) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-400">
            <GripVertical className="h-4 w-4" />
            <div className="p-1.5 bg-purple-100 rounded-md">
              <Zap className="h-4 w-4 text-purple-600" />
            </div>
          </div>
          <span className="font-medium text-gray-900">{skill.name}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (skill: Skill) => (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          {skill.category?.name || "No Category"}
        </Badge>
      ),
      className: "hidden sm:table-cell",
    },
    {
      key: "order",
      header: "Order",
      cell: (skill: Skill) => (
        <Badge className="bg-gray-200 border-gray-200">
          {skill.order_index}
        </Badge>
      ),
      className: "hidden md:table-cell",
    },
    {
      key: "created",
      header: "Created",
      cell: (skill: Skill) => (
        <span className="text-sm text-gray-600">
          {skill.created_at
            ? new Date(skill.created_at).toLocaleDateString()
            : "N/A"}
        </span>
      ),
      className: "hidden lg:table-cell",
    },
    {
      key: "actions",
      header: "Actions",
      cell: (skill: Skill) => (
        <ActionButtons
          onEdit={() => onEditSkill(skill)}
          onDelete={() => onDeleteSkill(skill)}
          variant="inline"
        />
      ),
      className: "text-right",
    },
  ];

  return (
    <DataTable<Skill>
      data={skills}
      columns={columns}
      searchPlaceholder="Search skills..."
      searchKeys={["name", "category.name"]}
      emptyState={{
        icon: <Zap className="h-12 w-12" />,
        title: "No skills found",
        description: "Create your first skill to get started",
      }}
    />
  );
}
