import { CompactStatsGrid } from "@/components/certificates-statistics/compact-stats-grid";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StatisticsSearch } from "@/components/certificates-statistics/statistics-search";
import { getAllEmployeesCertificates } from "../actions/certificate-statistics-action";
import { SectionHeader } from "@/components/ui/section-header";
import { Award } from "lucide-react";

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
          <SectionHeader
            title="Certificate Statistics"
            description="Comprehensive analytics and insights into certificate management across your organization"
            icon={<Award className="h-6 w-6 text-emerald-600" />}
            gradient="from-emerald-200 to-teal-200"
          />
          <CompactStatsGrid employeesCertificates={employeesCertificates} />
          <StatisticsSearch certificates={employeesCertificates} />
        </div>
      </div>
    </div>
  );
}
