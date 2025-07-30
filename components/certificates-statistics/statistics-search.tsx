"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { CertificatesTable } from "@/components/certificates-statistics/certificates-table";
import type { EmployeeCertificate } from "@/types/employees";
import { formatDepartment } from "@/lib/utils/normalize";

interface StatisticsSearchProps {
  certificates: EmployeeCertificate[];
}

export function StatisticsSearch({ certificates }: StatisticsSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCertificates = useMemo(() => {
    if (!searchTerm) return certificates;

    const lower = searchTerm.toLowerCase();

    return certificates.filter((cert) =>
      [
        cert.name,
        cert.date,
        cert.issuer,
        cert.employee?.firstName,
        cert.employee?.lastName,
        formatDepartment(cert.employee?.department),
        cert.employee?.role,
      ]
        .filter(Boolean)
        .some((field) => (field ? field.toLowerCase().includes(lower) : false))
    );
  }, [certificates, searchTerm]);

  return (
    <>
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
    </>
  );
}
