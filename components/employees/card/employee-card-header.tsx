import { Badge } from "@/components/ui/badge";
import { EmployeeAvatar } from "../employee-avatar";
import React from "react";
import { Award } from "lucide-react";
import { Certificate } from "@/lib/types";

interface EmployeeCardHeaderProps {
  name: string;
  department: string;
  role?: string;
  profileImage?: string;
  certificates?: Certificate[];
}
export function EmployeeCardHeader({
  name,
  department,
  role,
  profileImage,
  certificates,
}: Readonly<EmployeeCardHeaderProps>) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <EmployeeAvatar src={profileImage} alt={`${name} profile`} />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <div className="text-sm text-gray-600 flex items-center gap-1">
            {department && (
              <span className="font-medium text-blue-600">{department}</span>
            )}
            {role && (
              <Badge
                variant="secondary"
                className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 ml-3"
              >
                {role}
              </Badge>
            )}
            <div className="flex items-center gap-1 ml-1">
              <Award className="h-4 w-4 text-indigo-500" />
              <span className="font-medium text-blue-600">
                {certificates ? certificates?.length : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
