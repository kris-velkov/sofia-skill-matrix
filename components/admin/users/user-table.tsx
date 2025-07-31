"use client";

import { DataTable } from "@/components/ui/data-table";
import { ActionButtons } from "@/components/ui/action-buttons";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import {
  AppUser,
  getActivityStatus,
  getUserInitials,
} from "@/lib/utils/admin/user-helpers";
import { getRoleConfig } from "@/constants/role-configs";

interface UserTableProps {
  users: AppUser[];
  onEditUser: (user: AppUser) => void;
  onDeleteUser: (user: AppUser) => void;
  loading?: boolean;
}

export function UserTable({
  users,
  onEditUser,
  onDeleteUser,
  loading = false,
}: UserTableProps) {
  const columns = [
    {
      key: "user",
      header: "User",
      cell: (user: AppUser) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {getUserInitials(user)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm text-gray-500 truncate">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (user: AppUser) => {
        const roleConfig = getRoleConfig(user.role);
        const IconComponent = roleConfig.icon;
        return (
          <Badge className={roleConfig.color}>
            <IconComponent className="h-3 w-3 mr-1" />
            {roleConfig.label}
          </Badge>
        );
      },
      className: "hidden lg:table-cell",
    },
    {
      key: "program",
      header: "Program",
      cell: (user: AppUser) => (
        <span className="text-sm text-gray-600">
          {user.program === "all" ? "all programs" : user.program}
        </span>
      ),
      className: "hidden sm:table-cell",
    },
    {
      key: "activity",
      header: "Activity",
      cell: (user: AppUser) => {
        const activityStatus = getActivityStatus(user.lastSignIn);
        return (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-700 flex-shrink-0" />
            <span className="text-sm truncate">{activityStatus.label}</span>
          </div>
        );
      },
      className: "hidden md:table-cell",
    },
    {
      key: "created",
      header: "Joined",
      cell: (user: AppUser) => (
        <span className="text-sm text-gray-600">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
      className: "hidden lg:table-cell",
    },
    {
      key: "actions",
      header: "Actions",
      cell: (user: AppUser) => (
        <ActionButtons
          onEdit={() => onEditUser(user)}
          onDelete={() => onDeleteUser(user)}
          variant="inline"
        />
      ),
      className: "text-right",
    },
  ];

  return (
    <DataTable<AppUser>
      data={users}
      columns={columns}
      searchPlaceholder="Search users..."
      searchKeys={["email", "role", "program"]}
      emptyState={{
        icon: <Users className="h-12 w-12" />,
        title: "No users found",
        description: "No users match your search criteria",
      }}
      loading={loading}
    />
  );
}
