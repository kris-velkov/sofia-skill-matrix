import React from "react";
import { ArchiveX } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <ArchiveX className="h-10 w-10" />,
  message,
  className = "",
}) => (
  <div
    className={cn("flex flex-col items-center justify-center p-3", className)}
  >
    <div className="flex items-center justify-center">{icon}</div>
    <p className="text-center leading-relaxed max-w-xs">{message}</p>
  </div>
);

export default EmptyState;
