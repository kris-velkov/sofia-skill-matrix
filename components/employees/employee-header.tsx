import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { EmployeeAvatar } from "./employee-avatar";
import React from "react";
import { Button } from "../ui/button";

interface EmployeeHeaderProps {
  name: string;
  department: string;
  badge?: string;
  profileImage?: string;
  onEdit: (e: React.MouseEvent) => void;
}
export function EmployeeHeader({
  name,
  department,
  badge,
  profileImage,
  onEdit,
}: EmployeeHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <EmployeeAvatar src={profileImage} alt={`${name} profile`} />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {name}
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {department}
            {badge && (
              <>
                {" "}
                &bull;{" "}
                <Badge
                  variant="secondary"
                  className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                >
                  {badge}
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>
      <Button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${name}`}
        variant="ghost"
        size="icon"
        className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}
