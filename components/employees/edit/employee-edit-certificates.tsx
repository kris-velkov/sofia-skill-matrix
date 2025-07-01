"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, LucideClockFading, Plus, SaveAll, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  addEmployeeCertificate,
  deleteEmployeeCertificate,
  updateEmployeeCertificate,
} from "@/app/actions/employee-certificates";
import { Certificate } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";

interface EmployeeEditCertificatesProps {
  employeeId: string;
  certificates: Certificate[];
}

export const EmployeeEditCertificates: React.FC<
  EmployeeEditCertificatesProps
> = ({ employeeId, certificates: initialCertificates }) => {
  const [certificates, setCertificates] =
    useState<Certificate[]>(initialCertificates);
  const [newCert, setNewCert] = useState<Certificate>({
    id: "",
    issuer: "",
    name: "",
    url: "",
    date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingCertId, setUpdatingCertId] = useState<string | null>(null);

  const handleAddCert = async () => {
    if (newCert.name.trim()) {
      setIsSubmitting(true);
      try {
        const certWithId = { ...newCert, id: crypto.randomUUID() };
        await addEmployeeCertificate(employeeId, certWithId);
        setCertificates((prev) => [...prev, certWithId]);
        setNewCert({ id: "", name: "", url: "", date: "", issuer: "" });
        toast.success("Certificate added!");
      } catch {
        toast.error("Failed to add certificate");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRemoveCert = async (certId: string) => {
    const certToRemove = certificates.find((c) => c.id === certId);
    if (!certToRemove) return;
    setIsSubmitting(true);
    try {
      await deleteEmployeeCertificate(employeeId, certToRemove.id);
      setCertificates((prev) => prev.filter((c) => c.id !== certId));
      toast.success("Certificate removed!");
    } catch {
      toast.error("Failed to remove certificate");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCertChange = (
    certId: string,
    field: keyof Certificate,
    value: string
  ) => {
    setCertificates((prev) => {
      const updated = prev.map((cert) =>
        cert.id === certId ? { ...cert, [field]: value } : cert
      );
      return updated;
    });
  };

  const handleUpdateSingleCertificate = async (certId: string) => {
    setUpdatingCertId(certId);
    try {
      const certToUpdate = certificates.find((c) => c.id === certId);
      if (!certToUpdate) return;
      await updateEmployeeCertificate(employeeId, certificates);
      toast.success("Certificate updated!");
    } catch {
      toast.error("Failed to update certificate");
    } finally {
      setUpdatingCertId(null);
    }
  };

  return (
    <Card className="p-4 md:p-10 shadow-2xl border-0 bg-gradient-to-br from-blue-50/50 via-white to-blue-100/60 rounded-3xl">
      <form>
        <CardHeader className="p-0 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <CardTitle className="text-xl md:text-2xl font-extrabold text-blue-900 flex items-center gap-3 md:gap-4 tracking-tight">
            <Award className="h-7 w-7 md:h-8 md:w-8 text-blue-500 drop-shadow" />
            <span>Edit Certificates</span>
          </CardTitle>
        </CardHeader>
        <div className="space-y-8 md:space-y-10">
          <div>
            <div className="space-y-4 md:space-y-6">
              {certificates.length > 0 ? (
                certificates.map((cert, index) => (
                  <div
                    key={cert.id || cert.name}
                    className="bg-white/90 px-2 md:px-4 py-3 rounded-2xl border border-blue-100 shadow group transition hover:shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3">
                      <span className="text-blue-400 font-bold mr-2 text-base md:text-lg">
                        {index + 1}.
                      </span>
                      <Input
                        className="flex-1 px-2 md:px-3 py-2 border-b-2 border-blue-100 focus:border-blue-400 outline-none bg-transparent text-base md:text-lg font-semibold transition"
                        value={cert.name}
                        onChange={(e) =>
                          handleCertChange(cert.id, "name", e.target.value)
                        }
                        placeholder="Certificate Name"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3">
                      <Input
                        className="flex-1 px-2 md:px-3 py-2 border-b-2 border-blue-100 focus:border-blue-400 outline-none bg-transparent text-sm md:text-base transition"
                        value={cert.url || ""}
                        onChange={(e) =>
                          handleCertChange(cert.id, "url", e.target.value)
                        }
                        placeholder="Certificate URL (optional)"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                      <Input
                        className="flex-1 px-2 md:px-3 py-2 border-b-2 border-blue-100 focus:border-blue-400 outline-none bg-transparent text-sm md:text-base transition min-w-[120px] md:min-w-[200px]"
                        value={cert.issuer || ""}
                        onChange={(e) =>
                          handleCertChange(cert.id, "issuer", e.target.value)
                        }
                        placeholder="Issuer (optional)"
                        style={{ maxWidth: 180 }}
                      />
                      <Input
                        type="date"
                        className="px-2 md:px-3 py-2 border-b-2 border-blue-100 focus:border-blue-400 outline-none bg-transparent text-sm md:text-base transition min-w-[120px] md:min-w-[200px] w-[120px] md:w-[200px]"
                        value={cert.date || ""}
                        onChange={(e) =>
                          handleCertChange(cert.id, "date", e.target.value)
                        }
                        placeholder="Date"
                        style={{ maxWidth: 140 }}
                      />
                      <div className="flex flex-row gap-2 mt-2 sm:mt-0">
                        <Button
                          className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition shadow-none"
                          onClick={() => handleRemoveCert(cert.id)}
                          type="button"
                          title="Remove"
                          variant="ghost"
                          size="icon"
                        >
                          {isSubmitting ? (
                            <LucideClockFading className="w-5 h-5 animate-spin text-green-600" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </Button>
                        <Button
                          className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition shadow-none"
                          onClick={() => handleUpdateSingleCertificate(cert.id)}
                          type="button"
                          title="Save changes"
                          variant="ghost"
                          size="icon"
                          disabled={isSubmitting || updatingCertId === cert.id}
                        >
                          {updatingCertId === cert.id ? (
                            <LucideClockFading className="w-5 h-5 animate-spin text-blue-600" />
                          ) : (
                            <SaveAll className="w-5 h-5 text-blue-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  className="text-gray-600"
                  icon={<Award className="w-7 h-7 mb-2" />}
                  message="No certificates listed for this employee. Add one below."
                />
              )}
            </div>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold text-green-800 mb-2">
              Add New Certificate
            </h3>
            <div className="px-2 md:px-4 bg-white py-3 rounded-xl border-2 border-gray-200">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3">
                  <Input
                    className="flex-1 px-2 md:px-3 py-2 border-b-2 border-gray-200 focus:border-gray-400 outline-none bg-transparent text-base md:text-lg transition"
                    value={newCert.name}
                    onChange={(e) =>
                      setNewCert((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Certificate Name *"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3">
                  <Input
                    className="flex-1 px-2 md:px-3 py-2 border-b-2 border-gray-200 focus:border-gray-400 outline-none bg-transparent text-sm md:text-base transition"
                    value={newCert.url || ""}
                    onChange={(e) =>
                      setNewCert((prev) => ({ ...prev, url: e.target.value }))
                    }
                    placeholder="Certificate URL (optional)"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <Input
                    className="flex-1 px-2 md:px-3 py-2 border-b-2 border-gray-200 focus:border-gray-400 outline-none bg-transparent text-sm md:text-base transition min-w-[120px] md:min-w-[200px]"
                    value={newCert.issuer || ""}
                    onChange={(e) =>
                      setNewCert((prev) => ({
                        ...prev,
                        issuer: e.target.value,
                      }))
                    }
                    placeholder="Issuer (optional)"
                    style={{ maxWidth: 180 }}
                  />
                  <Input
                    type="date"
                    className="px-2 md:px-3 py-2 border-b-2 border-gray-200 focus:border-gray-400 outline-none bg-transparent text-sm md:text-base transition min-w-[120px] md:min-w-[200px] w-[120px] md:w-[200px]"
                    value={newCert.date || ""}
                    onChange={(e) =>
                      setNewCert((prev) => ({ ...prev, date: e.target.value }))
                    }
                    placeholder="Date"
                    style={{ maxWidth: 140 }}
                  />
                  <Button
                    className={`p-2 rounded-full flex items-center justify-center transition shadow-none  cursor-pointer ${
                      newCert.name.trim() && !isSubmitting
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    onClick={handleAddCert}
                    type="button"
                    disabled={!newCert.name.trim() || isSubmitting}
                    title="Add"
                    variant="ghost"
                    size="icon"
                  >
                    {isSubmitting ? (
                      <LucideClockFading className="w-5 h-5 animate-spin text-green-600" />
                    ) : (
                      <Plus className="w-5 h-5 cursor-pointer" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default EmployeeEditCertificates;
