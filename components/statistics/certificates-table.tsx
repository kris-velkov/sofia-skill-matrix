import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmployeeAvatar } from "../employees/employee-avatar";
import { formatDepartment } from "@/lib/utils/normalize";
import { getEmployeeFullName } from "@/lib/utils/employees";
import EmptyState from "../ui/empty-state";

interface CertificatesTableProps {
  certificates: {
    id: string;
    name: string;
    issuer: string;
    date: string | null;
    url: string | null;
    employee: {
      id: string;
      firstName?: string;
      lastName?: string;
      profileImage: string | null;
      department: string | null;
      role: string | null;
    } | null;
  }[];
}

export function CertificatesTable({
  certificates,
}: Readonly<CertificatesTableProps>) {
  const hasData = certificates.length > 0;

  return (
    <Card className="shadow border border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          Certificates {hasData ? `(${certificates.length})` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-700 text-white">
              <TableRow>
                <TableHead>Certificate</TableHead>
                <TableHead>Issuer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Employee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hasData ? (
                certificates.map((cert) => (
                  <TableRow
                    key={cert.id}
                    className="text-gray-600 border-b border-gray-200 hover:bg-gray-200"
                  >
                    <TableCell>
                      {cert.url ? (
                        <Link
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-blue-500"
                        >
                          {cert.name}
                        </Link>
                      ) : (
                        <strong className="font-normal text-gray-900">
                          {cert.name}
                        </strong>
                      )}
                    </TableCell>
                    <TableCell>{cert.issuer || "—"}</TableCell>
                    <TableCell>
                      {cert.date
                        ? new Date(cert.date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {(cert.employee?.department &&
                        formatDepartment(cert.employee.department)) ||
                        ""}
                    </TableCell>
                    <TableCell>{cert.employee?.role || "—"}</TableCell>
                    <TableCell>
                      {cert.employee ? (
                        <Link
                          href={`/employee/${cert.employee.id}`}
                          className="flex items-center gap-2 hover:text-blue-600 hover:underline"
                        >
                          <EmployeeAvatar
                            src={cert.employee.profileImage}
                            alt={`${cert.employee.firstName} profile`}
                          />
                          <span>
                            {getEmployeeFullName(
                              cert.employee.firstName,
                              cert.employee.lastName
                            )}
                          </span>
                        </Link>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No certificate data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden flex flex-col gap-4">
          {hasData ? (
            certificates.map((cert) => (
              <div
                key={cert.id}
                className="rounded-xl border border-gray-200 shadow-sm p-4 shadow-sm space-y-2 bg-white"
              >
                {cert.url ? (
                  <Link
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-semibold text-primary hover:underline text-blue-600 transition-colors"
                  >
                    {cert.name}
                  </Link>
                ) : (
                  <span className="text-gray-500 font-semibold">
                    {cert.name}
                  </span>
                )}

                <div className="text-sm text-muted-foreground space-y-2">
                  <strong>Issuer:</strong> {cert.issuer || ""}
                  <div className="space-y-2">
                    <strong>Date:</strong>{" "}
                    {cert.date
                      ? new Date(cert.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </div>
                  <div className="space-y-2">
                    <strong>Department:</strong>{" "}
                    {(cert.employee?.department &&
                      formatDepartment(cert.employee.department)) ||
                      ""}
                  </div>
                  <p>
                    <strong>Role:</strong> {cert.employee?.role || ""}
                  </p>
                  {cert.employee ? (
                    <div className="flex items-center gap-2 pt-2 hover:text-blue-500">
                      <EmployeeAvatar
                        src={cert.employee.profileImage}
                        alt={`${cert.employee.firstName} profile`}
                      />
                      <Link
                        href={`/employee/${cert.employee.id}`}
                        className="hover:underline font-medium text-foreground"
                      >
                        {getEmployeeFullName(
                          cert.employee.firstName,
                          cert.employee.lastName
                        )}
                      </Link>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <span className="text-gray-400">No employee data</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <EmptyState message=" No certificate data available." />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
