"use client";

import { DataTable } from "@/components/ui/data-table";
import { ActionButtons } from "@/components/ui/action-buttons";
import { Badge } from "@/components/ui/badge";
import { UserCheck, GripVertical } from "lucide-react";
import { Role } from "@/types/roles";
import { DepartmentLabels } from "@/types/employees";

interface RolesTableProps {
  roles: Role[];
  onEditRole: (role: Role) => void;
  onDeleteRole: (role: Role) => void;
}

export function RolesTable({
  roles,
  onEditRole,
  onDeleteRole,
}: RolesTableProps) {
  const columns = [
    {
      key: "name",
      header: "Role Name",
      cell: (role: Role) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-400">
            <GripVertical className="h-4 w-4" />
            <div className="p-1.5 bg-indigo-100 rounded-md">
              <UserCheck className="h-4 w-4 text-indigo-600" />
            </div>
          </div>
          <span className="font-medium text-gray-900">{role.name}</span>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      cell: (role: Role) => (
        <Badge className="bg-blue-200">
          {DepartmentLabels[
            role.departament as keyof typeof DepartmentLabels
          ] || role.departament}
        </Badge>
      ),
      className: "hidden sm:table-cell",
    },
    {
      key: "roleId",
      header: "Role IDs",
      cell: (role: Role) => (
        <Badge className="bg-sky-200 border-gray-200 font-mono text-xs">
          {role.roleId}
        </Badge>
      ),
      className: "hidden md:table-cell",
    },
    {
      key: "order",
      header: "Order",
      cell: (role: Role) => (
        <Badge className="bg-gray-200 border-gray-200">
          {role.order_index}
        </Badge>
      ),
      className: "hidden lg:table-cell",
    },
    {
      key: "created",
      header: "Created",
      cell: (role: Role) => (
        <span className="text-sm text-gray-600">
          {role.created_at
            ? new Date(role.created_at).toLocaleDateString()
            : "N/A"}
        </span>
      ),
      className: "hidden xl:table-cell",
    },
    {
      key: "actions",
      header: "Actions",
      cell: (role: Role) => (
        <ActionButtons
          onEdit={() => onEditRole(role)}
          onDelete={() => onDeleteRole(role)}
          variant="inline"
        />
      ),
      className: "text-right",
    },
  ];

  return (
    <DataTable<Role>
      data={roles}
      columns={columns}
      searchPlaceholder="Search roles..."
      searchKeys={["name", "roleId", "departament"]}
      emptyState={{
        icon: <UserCheck className="h-12 w-12" />,
        title: "No roles found",
        description: "Create your first role to get started",
      }}
    />
  );
}
