"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  addEmployeeCertificate,
  deleteEmployeeCertificate,
  updateEmployeeEmployeeCertificates,
} from "@/app/actions/employee-certificates";

interface Certificate {
  name: string;
  url?: string;
  date?: string;
}

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
    name: "",
    url: "",
    date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCertChange = (
    idx: number,
    field: keyof Certificate,
    value: string
  ) => {
    setCertificates((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const handleAddCert = async () => {
    if (newCert.name.trim()) {
      setIsSubmitting(true);
      try {
        await addEmployeeCertificate(employeeId, newCert);
        setCertificates((prev) => [...prev, { ...newCert }]);
        setNewCert({ name: "", url: "", date: "" });
        toast.success("Certificate added!");
      } catch {
        toast.error("Failed to add certificate");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRemoveCert = async (idx: number) => {
    const certToRemove = certificates[idx];
    setIsSubmitting(true);
    try {
      await deleteEmployeeCertificate(employeeId, certToRemove.name);
      setCertificates((prev) => prev.filter((_, i) => i !== idx));
      toast.success("Certificate removed!");
    } catch {
      toast.error("Failed to remove certificate");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateEmployeeEmployeeCertificates(employeeId, certificates);
      toast.success("Certificates saved!");
    } catch {
      toast.error("Failed to update certificates");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-10 shadow-2xl border-0 bg-gradient-to-br from-blue-50/50 via-white to-blue-100/60 rounded-3xl">
      <form onSubmit={handleSave}>
        <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-extrabold text-blue-900 flex items-center gap-4 tracking-tight">
            <Award className="h-8 w-8 text-blue-500 drop-shadow" />
            <span>Edit Certificates</span>
          </CardTitle>
          <button
            type="submit"
            className="ml-auto px-6 py-2 rounded-lg bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </CardHeader>
        <div className="space-y-10">
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              Your Certificates
            </h3>
            <div className="space-y-6">
              {certificates.length > 0 ? (
                certificates.map((cert, idx) => (
                  <div
                    key={idx}
                    className="bg-white/90 px-4 py-3 rounded-xl border border-blue-50 shadow-sm relative group"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-blue-400 font-bold mr-2">
                        {idx + 1}.
                      </span>
                      <input
                        className="flex-1 px-2 py-1 border-b border-blue-100 focus:border-blue-400 outline-none bg-transparent text-lg font-semibold"
                        value={cert.name}
                        onChange={(e) =>
                          handleCertChange(idx, "name", e.target.value)
                        }
                        placeholder="Certificate Name"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        className="flex-1 px-2 py-1 border-b border-blue-100 focus:border-blue-400 outline-none bg-transparent text-base"
                        value={cert.url || ""}
                        onChange={(e) =>
                          handleCertChange(idx, "url", e.target.value)
                        }
                        placeholder="Certificate URL (optional)"
                      />
                      <input
                        type="date"
                        className="px-2 py-1 border-b border-blue-100 focus:border-blue-400 outline-none bg-transparent text-base"
                        value={cert.date || ""}
                        onChange={(e) =>
                          handleCertChange(idx, "date", e.target.value)
                        }
                        placeholder="Date"
                      />
                      <button
                        className="ml-2 p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
                        onClick={() => handleRemoveCert(idx)}
                        type="button"
                        title="Remove"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-blue-600 italic text-center py-8 text-lg">
                  No certificates listed.
                </p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Add New Certificate
            </h3>
            <div className="bg-blue-50/60 px-4 py-3 rounded-xl border border-blue-100">
              {/* Name row */}
              <div className="flex items-center gap-4 mb-2">
                <input
                  className="flex-1 px-2 py-1 border-b border-blue-200 focus:border-blue-400 outline-none bg-transparent text-lg"
                  value={newCert.name}
                  onChange={(e) =>
                    setNewCert((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="New Certificate Name"
                />
              </div>
              <div className="flex items-center gap-4">
                <input
                  className="flex-1 px-2 py-1 border-b border-blue-200 focus:border-blue-400 outline-none bg-transparent text-base"
                  value={newCert.url || ""}
                  onChange={(e) =>
                    setNewCert((prev) => ({ ...prev, url: e.target.value }))
                  }
                  placeholder="New Certificate URL (optional)"
                />
                <input
                  type="date"
                  className="px-2 py-1 border-b border-blue-200 focus:border-blue-400 outline-none bg-transparent text-base"
                  value={newCert.date || ""}
                  onChange={(e) =>
                    setNewCert((prev) => ({ ...prev, date: e.target.value }))
                  }
                  placeholder="Date"
                />
                <button
                  className={`ml-2 p-2 rounded-full ${
                    newCert.name.trim()
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  } transition`}
                  onClick={handleAddCert}
                  type="button"
                  disabled={!newCert.name.trim()}
                  title="Add"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default EmployeeEditCertificates;
