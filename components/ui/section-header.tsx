"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  gradient?: string;
  children?: React.ReactNode;
}

export function SectionHeader({
  title,
  description,
  icon,
  action,
  gradient = "from-gray-50 to-gray-100",
  children,
}: SectionHeaderProps) {
  return (
    <div
      className={`bg-gradient-to-r ${gradient} rounded-xl p-4 sm:p-6 border border-gray-100`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {icon && (
            <div className="p-2 bg-white/80 rounded-lg shadow-sm flex-shrink-0">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              {title}
            </h2>
            {description && (
              <p className="text-gray-600 text-sm sm:text-base mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {children}
          {action && (
            <Button
              onClick={action.onClick}
              className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm"
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
