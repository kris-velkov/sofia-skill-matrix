"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/types/roles";
import { getAllRoles, getRolesByDepartment } from "@/app/actions/roles-actions";

interface RoleSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  department?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export function RoleSelect({
  value,
  onValueChange,
  department,
  placeholder = "Select role",
  disabled = false,
  required = false,
}: RoleSelectProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = department
          ? await getRolesByDepartment(department)
          : await getAllRoles();
        setRoles(data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, [department]);

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading roles..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      required={required}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role.id} value={role.roleId}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
