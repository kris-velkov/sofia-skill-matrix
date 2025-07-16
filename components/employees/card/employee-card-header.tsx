import { Badge } from "@/components/ui/badge";
import { EmployeeAvatar } from "../employee-avatar";
import React from "react";
import { GraduationCap } from "lucide-react";
import { Certificate } from "crypto";

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
    <div className="mb-3">
      <div className="flex gap-2 flex flex-row">
        <EmployeeAvatar src={profileImage} alt={`${name} profile`} />
        <div className="flex flex-row items-center justify-between w-full">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <div className="flex items-center gap-1 shadow rounded p-1">
            <GraduationCap className="h-4 w-4 text-indigo-700" />
            <span className="font-normal text-sm text-indigo-600 ">
              {certificates ? certificates?.length : 0}
            </span>
          </div>
        </div>
      </div>
      <div className="flex text-sm text-gray-600 flex gap-2 ml-14">
        {role && (
          <Badge
            variant="secondary"
            className="px-2 py-0.5 text-xs bg-blue-200 text-blue-700 rounded-full text-center shadow"
          >
            {role}
          </Badge>
        )}
        {department && (
          <Badge
            variant="secondary"
            className="px-3 py-0.5 text-black bg-gray-200 text-gray-600 rounded-full min-w-[85px] flex items-center justify-center shadow"
          >
            {department}
          </Badge>
        )}
      </div>
    </div>
  );
}
