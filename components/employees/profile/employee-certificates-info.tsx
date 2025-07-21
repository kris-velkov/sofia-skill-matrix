import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Award, GraduationCap, Link as LinkIcon } from "lucide-react";
import type { Certificate } from "@/types/employees";
import EmptyState from "@/components/ui/empty-state";

interface EmployeeCertificatesInfoProps {
  certificates: Certificate[] | null;
}

export const EmployeeCertificatesInfo: React.FC<
  EmployeeCertificatesInfoProps
> = ({ certificates }) => (
  <Card className="p-4 md:p-8 shadow-xl border border-green-200 rounded-xl">
    <CardHeader className="p-0 mb-4 md:mb-6 flex flex-row items-center justify-between">
      <CardTitle className="text-xl md:text-2xl font-bold text-green-900 flex items-center gap-2">
        <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
        Certificates
      </CardTitle>
    </CardHeader>
    {certificates && certificates.length > 0 ? (
      <div className="space-y-2">
        {certificates.map((cert, idx) => (
          <div key={cert.name + idx}>
            <div className="flex flex-col bg-white/80 border border-green-50 rounded-xl p-2 md:p-3 shadow-sm transition">
              <div className="flex-1 min-w-0 mb-2 md:mb-0">
                <span className="font-semibold text-base md:text-lg block break-words">
                  {cert.name}
                </span>
                {cert.issuer && (
                  <span className="text-xs md:text-sm block mt-1">
                    <span className="font-medium">Issued by:</span>{" "}
                    {cert.issuer}
                  </span>
                )}
              </div>
              <div className="flex flex-row items-center gap-3 md:gap-6 justify-between md:justify-end flex-wrap mt-2">
                {cert.date && (
                  <span className="text-gray-500 text-xs">
                    {new Date(cert.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 hover:text-green-900 hover:underline text-xs flex items-center gap-1 md:gap-2 font-semibold transition-colors"
                  >
                    <LinkIcon className="w-3 h-3 md:w-4 md:h-4" />
                    View Certificate
                  </a>
                )}
              </div>
            </div>
            {idx !== certificates.length - 1 && (
              <Separator className="my-2 md:my-3 bg-gradient-to-r from-green-200 via-blue-100 to-transparent" />
            )}
          </div>
        ))}
      </div>
    ) : (
      <EmptyState
        className="text-gray-600"
        icon={<Award className="w-6 h-6 md:w-7 md:h-7 mb-2" />}
        message="No certificates listed for this employee."
      />
    )}
  </Card>
);

export default EmployeeCertificatesInfo;
