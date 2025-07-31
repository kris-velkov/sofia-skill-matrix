import { Shield, Edit, Eye, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface RoleConfig {
  value: string;
  label: string;
  color: string;
  icon: LucideIcon;
  description?: string;
}

export const ROLE_CONFIGS: RoleConfig[] = [
  {
    value: "admin",
    label: "Admin",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: Shield,
    description: "Full system access and user management",
  },
  {
    value: "editor",
    label: "Editor",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Edit,
    description: "Can view everything and edit/manage employees",
  },
  {
    value: "analyst",
    label: "Analyst",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Eye,
    description: "Can view and see statistics, but not manage employees",
  },
  {
    value: "member",
    label: "Member",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Users,
    description: "Can see the home page only",
  },
];

export const getRoleConfig = (role: string): RoleConfig => {
  return ROLE_CONFIGS.find((r) => r.value === role) || ROLE_CONFIGS[3];
};

export const getRoleStats = (users: Array<{ role: string }>) => {
  return ROLE_CONFIGS.map((role) => {
    const count = users.filter((user) => user.role === role.value).length;
    return {
      label: `${role.label}s`,
      value: count,
      icon: role.icon,
      color: role.color,
    };
  });
};
