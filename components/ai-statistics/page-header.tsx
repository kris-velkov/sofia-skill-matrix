import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2">
          {icon && <div className="text-purple-500 flex-shrink-0">{icon}</div>}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            {title}
          </h1>
        </div>
        <p className="text-sm sm:text-lg text-gray-600 leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
