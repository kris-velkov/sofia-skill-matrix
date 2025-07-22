import { CompactStatsGrid } from "@/components/statistics/compact-stats-grid";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StatisticsSearch } from "@/components/statistics/statistics-search";
import { getAllEmployeesCertificates } from "../actions/certificate-statistics-action";

export const revalidate = 0;

export default async function CertificateStatisticsPage() {
  const employeesCertificates = await getAllEmployeesCertificates();

  const breadcrumbItems = [
    { label: "Certificate Statistics", href: "/statistics" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid gap-6">
          <Breadcrumbs items={breadcrumbItems} />
          <CompactStatsGrid employeesCertificates={employeesCertificates} />

          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Certificates Statistics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This page provides an overview of employee certificates
          </p>

          <StatisticsSearch certificates={employeesCertificates} />
        </div>
      </div>
    </div>
  );
}
