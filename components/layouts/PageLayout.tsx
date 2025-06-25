import type { ReactNode } from "react";
import DashboardHeader from "@/components/dashboard/header";
import { Breadcrumbs, BreadcrumbItemType } from "@/components/breadcrumbs";

interface PageLayoutProps {
  breadcrumbs: BreadcrumbItemType[];
  children: ReactNode;
  className?: string;
  breadcrumbSeparator?: ReactNode;
  breadcrumbMaxItems?: number;
}

export default function PageLayout({
  breadcrumbs,
  children,
  className = "",
  breadcrumbSeparator,
  breadcrumbMaxItems,
}: PageLayoutProps) {
  return (
    <div
      className={`flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 ${className}`}
    >
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid gap-6">
          <Breadcrumbs
            items={breadcrumbs}
            separator={breadcrumbSeparator}
            maxItems={breadcrumbMaxItems}
          />
          {children}
        </div>
      </main>
    </div>
  );
}
