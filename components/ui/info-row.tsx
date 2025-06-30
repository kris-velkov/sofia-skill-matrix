import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface InfoRowProps {
  label: string;
  value?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: boolean;
  className?: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  icon,
  badge,
  className,
}) => (
  <div
    className={
      "flex flex-col gap-1 p-4 rounded-lg bg-white border shadow-sm border-gray-200" +
      (className ?? "")
    }
  >
    <Label className="text-xs text-gray-500 flex items-center gap-2 font-medium tracking-wide">
      {icon && <span className="text-primary">{icon}</span>}
      <span>{label}</span>
    </Label>
    {badge ? (
      <Badge className="w-fit text-base font-semibold mt-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800">
        {value || "N/A"}
      </Badge>
    ) : (
      <span className="text-base font-semibold text-gray-900 flex items-center gap-2 mt-2">
        {value || <span className="text-gray-400">N/A</span>}
      </span>
    )}
  </div>
);

export default InfoRow;
