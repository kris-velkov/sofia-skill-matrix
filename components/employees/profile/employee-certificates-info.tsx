import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Award, GraduationCap, Link as LinkIcon } from "lucide-react";
import type { Certificate } from "@/lib/types";
import EmptyState from "@/components/ui/empty-state";

interface EmployeeCertificatesInfoProps {
  certificates: Certificate[] | null;
}

export const EmployeeCertificatesInfo: React.FC<
  EmployeeCertificatesInfoProps
> = ({ certificates }) => (
  <Card className="p-8 shadow-xl border border-green-200 rounded-xl">
    <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
      <CardTitle className="text-2xl font-bold text-green-900 flex items-center gap-2">
        <GraduationCap className="h-6 w-6 text-green-500" />
        Certificates
      </CardTitle>
    </CardHeader>
    {certificates && certificates.length > 0 ? (
      <div className="space-y-2">
        {certificates.map((cert, idx) => (
          <div key={cert.name + idx}>
            <div className="flex flex-col md:flex-row md:items-center md:gap-3 bg-white/80 border border-green-50 rounded-xl p-3 shadow-sm transition">
              <div className="flex-1 min-w-[220px]">
                <span className="font-semibold text-lg block break-words">
                  {cert.name}
                </span>
                {cert.issuer && (
                  <span className="text-sm block mt-1">
                    <span className="font-medium">Issued by:</span>{" "}
                    {cert.issuer}
                  </span>
                )}
              </div>
              <div className="flex flex-row items-center gap-6 min-w-[220px] justify-end flex-wrap">
                {cert.date && (
                  <span className="text-gray-500 text-xs min-w-[100px]">
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
                    className="text-green-700 hover:text-green-900 hover:underline text-xs flex items-center gap-2 font-semibold transition-colors min-w-[120px]"
                  >
                    <LinkIcon className="w-4 h-4" />
                    View Certificate
                  </a>
                )}
              </div>
            </div>
            {idx !== certificates.length - 1 && (
              <Separator className="my-3 bg-gradient-to-r from-green-200 via-blue-100 to-transparent" />
            )}
          </div>
        ))}
      </div>
    ) : (
      <EmptyState
        className="text-gray-600"
        icon={<Award className="w-7 h-7 mb-2" />}
        message="No certificates listed for this employee."
      />
    )}
  </Card>
);

export default EmployeeCertificatesInfo;
