"use client";

import { useEffect, useMemo, useState } from "react";

import type { Employee } from "@/lib/types";

import { getAllEmployees } from "../actions/certificate-statistics-action";
import { CompactStatsGrid } from "@/components/statistics/compact-stats-grid";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CertificatesTable } from "@/components/statistics/cerfificates-table";
import { Input } from "@/components/ui/input";

export default function CertificateStatisticsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllEmployees().then(setEmployees);
  }, []);

  const breadcrumbItems = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "Certficate Statistics", href: "/statistics" },
    ],
    []
  );

  const certificates = useMemo(() => {
    return employees.flatMap((emp) =>
      (emp.certificates || []).map((cert) => ({
        id: cert.id,
        name: cert.name,
        issuer: cert.issuer ?? "Unknown",
        date: cert.date ?? null,
        url: cert.url ?? null,
        employee: {
          id: emp.id,
          name: `${emp.firstName} ${emp.lastName}`,
          profileImage: emp.profileImage ?? null,
          department: emp.department ?? null,
          role: emp.role ?? null,
        },
      }))
    );
  }, [employees]);

  const filteredCertificates = useMemo(() => {
    if (!searchTerm) return certificates;

    const lower = searchTerm.toLowerCase();

    return certificates.filter((cert) =>
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
  }, [certificates, searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid gap-6">
          <Breadcrumbs items={breadcrumbItems} />
          <CompactStatsGrid employees={employees} />

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
