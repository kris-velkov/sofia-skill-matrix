"use client";

import { useEffect, useMemo, useState } from "react";

import type { EmployeeCertificate } from "@/lib/types";

import { CompactStatsGrid } from "@/components/statistics/compact-stats-grid";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Input } from "@/components/ui/input";
import { CertificatesTable } from "@/components/statistics/certificates-table";
import { getAllEmployeesCertificates } from "../actions/certificate-statistics-action";

export default function CertificateStatisticsPage() {
  const [employeesCertificates, setEmployeesCertificates] = useState<
    EmployeeCertificate[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllEmployeesCertificates().then(setEmployeesCertificates);
  }, []);

  const breadcrumbItems = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "Certficate Statistics", href: "/statistics" },
    ],
    []
  );

  const filteredCertificates = useMemo(() => {
    if (!searchTerm) return employeesCertificates;

    const lower = searchTerm.toLowerCase();

    return employeesCertificates.filter((cert) =>
      [
        cert.name,
        cert.date,
        cert.issuer,
        cert.employee?.name,
        cert.employee?.department,
        cert.employee?.role,
      ]
        .filter(Boolean)
        .some((field) => (field ? field.toLowerCase().includes(lower) : false))
    );
  }, [employeesCertificates, searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
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

          <Input
            type="text"
            placeholder="Search by certificate, issuer, employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md w-full md:w-auto border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm min-w-[250px] md:min-w-[450px] mb-4 md:mb-0 bg-white text-gray-800 focus:ring-2 focus:outline-none focus:ring-offset-2 focus:ring-offset-white"
          />

          {filteredCertificates && (
            <CertificatesTable certificates={filteredCertificates} />
          )}
        </div>
      </div>
    </div>
  );
}
