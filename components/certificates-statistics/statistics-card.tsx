import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatisticsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconColor?: string;
  borderColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatisticsCard({
  title,
  value,
  icon,
  iconColor = "text-gray-500",
  borderColor = "border-gray-200",
  trend,
}: StatisticsCardProps) {
  return (
    <Card className={`shadow-lg transition-shadow bg-white ${borderColor}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`flex-shrink-0 ${iconColor}`}>{icon}</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
              {trend && (
                <p
                  className={`text-xs ${
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
