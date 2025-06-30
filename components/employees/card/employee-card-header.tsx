import { Badge } from "@/components/ui/badge";
import { EmployeeAvatar } from "../employee-avatar";
import React from "react";

interface EmployeeCardHeaderProps {
  name: string;
  department: string;
  badge?: string;
  profileImage?: string;
}
export function EmployeeCardHeader({
  name,
  department,
  badge,
  profileImage,
}: Readonly<EmployeeCardHeaderProps>) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <EmployeeAvatar src={profileImage} alt={`${name} profile`} />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <div className="text-sm text-gray-600">
            {department}
            {badge && (
              <Badge
                variant="secondary"
                className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 ml-3"
              >
                {badge}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
