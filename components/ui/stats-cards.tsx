"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";

interface StatCard {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface StatsCardsProps {
  stats: StatCard[];
  className?: string;
}

export function StatsCards({ stats, className = "" }: StatsCardsProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
    >
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        const colorClass = stat.color || "bg-blue-100 text-blue-600";

        return (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">
                  {stat.label}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                {stat.trend && (
                  <p
                    className={`text-xs mt-1 ${
                      stat.trend.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend.isPositive ? "+" : ""}
                    {stat.trend.value}%
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${colorClass} flex-shrink-0`}>
                <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
