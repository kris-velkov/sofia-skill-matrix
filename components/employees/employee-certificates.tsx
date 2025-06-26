"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { GraduationCap, Pencil, Check, X, Plus, Trash2 } from "lucide-react";
import {
  addEmployeeCertificate,
  updateEmployeeCertificates,
  deleteEmployeeCertificate,
} from "@/app/actions/certificates-actions";
import toast from "react-hot-toast";

type Certificate = {
  name: string;
  issuer?: string;
  date?: string;
  url?: string;
};

type EmployeeCertificatesProps = {
  employeeId: string;
  certificates: Certificate[];
};

export const EmployeeCertificates: React.FC<EmployeeCertificatesProps> = ({
  employeeId,
  certificates: initialCertificates,
}) => {
  const [certificates, setCertificates] =
    useState<Certificate[]>(initialCertificates);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCert, setEditCert] = useState<Certificate | null>(null);
  const [adding, setAdding] = useState<boolean>(false);
  const [newCert, setNewCert] = useState<Certificate>({
    name: "",
    issuer: "",
    date: "",
    url: "",
  });

  const handleEdit = (idx: number) => {
    setEditingIndex(idx);
    setEditCert({ ...certificates[idx] });
    setAdding(false);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditCert(null);
    setAdding(false);
    setNewCert({ name: "", issuer: "", date: "", url: "" });
  };

  const handleSave = async () => {
    if (editingIndex === null || !editCert) return;
    const updatedCertificates = certificates.map((c, i) =>
      i === editingIndex ? editCert : c
    );
    setCertificates(updatedCertificates);
    setEditingIndex(null);
    setEditCert(null);
    const result = await updateEmployeeCertificates(
      employeeId,
      updatedCertificates
    );
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleChange = (field: keyof Certificate, value: string) => {
    setEditCert((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleNewChange = (field: keyof Certificate, value: string) => {
    setNewCert((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNew = () => {
    setAdding(true);
    setEditingIndex(null);
    setEditCert(null);
    setNewCert({ name: "", issuer: "", date: "", url: "" });
  };

  const handleSaveNew = async () => {
    if (!newCert.name.trim()) return;
    const result = await addEmployeeCertificate(employeeId, newCert);
    if (result.success) {
      setCertificates([...certificates, newCert]);
      toast.success(result.message);
      setAdding(false);
      setNewCert({ name: "", issuer: "", date: "", url: "" });
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (idx: number) => {
    const certToDelete = certificates[idx];
    const result = await deleteEmployeeCertificate(
      employeeId,
      certToDelete.name
    );
    if (result.success) {
      const updated = certificates.filter((_, i) => i !== idx);
      setCertificates(updated);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    handleCancel();
  };

  return (
    <Card className="p-6 shadow-lg border border-blue-100 bg-white">
      <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-green-500" />
          Certificates
        </CardTitle>
        <button
          className="ml-2 text-blue-600 hover:text-blue-800 flex items-center gap-1"
          onClick={handleAddNew}
          title="Add Certificate"
          disabled={adding || editingIndex !== null}
        >
          <Plus className="w-5 h-5" />
          <span className="hidden md:inline">Add</span>
        </button>
      </CardHeader>
      <div className="space-y-4">
        {certificates.map((cert, idx) => (
          <div
            key={cert.name + idx}
            className="flex flex-col md:flex-row md:items-center md:gap-4 border-b last:border-b-0 border-gray-100 pb-4 last:pb-0"
          >
            {editingIndex === idx && editCert ? (
              <>
                <input
                  className="font-semibold text-gray-800 text-lg flex-1 border px-2 py-1 rounded"
                  value={editCert.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Certificate Name"
                />
                <input
                  className="text-gray-600 text-sm flex-1 border px-2 py-1 rounded"
                  value={editCert.issuer || ""}
                  onChange={(e) => handleChange("issuer", e.target.value)}
                  placeholder="Issuer"
                />
                <input
                  type="date"
                  className="text-gray-500 text-xs flex-1 border px-2 py-1 rounded"
                  value={editCert.date || ""}
                  onChange={(e) => handleChange("date", e.target.value)}
                  placeholder="Date"
                />
                <input
                  className="text-blue-600 text-xs flex-1 border px-2 py-1 rounded"
                  value={editCert.url || ""}
                  onChange={(e) => handleChange("url", e.target.value)}
                  placeholder="Certificate URL"
                />
                <button
                  className="ml-2 text-green-600"
                  onClick={handleSave}
                  title="Save"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  className="ml-1 text-red-600"
                  onClick={handleCancel}
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  className="ml-1 text-red-600"
                  onClick={() => handleDelete(idx)}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="font-semibold text-gray-800 text-lg flex-1">
                  {cert.name}
                </div>
                {cert.issuer && (
                  <div className="text-gray-600 text-sm flex-1">
                    Issued by: {cert.issuer}
                  </div>
                )}
                {cert.date && (
                  <div className="text-gray-500 text-xs flex-1">
                    {new Date(cert.date).toLocaleDateString()}
                  </div>
                )}
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs flex-1"
                  >
                    View Certificate
                  </a>
                )}
                <button
                  className="ml-2 text-gray-500 hover:text-blue-600"
                  onClick={() => handleEdit(idx)}
                  title="Edit"
                  disabled={adding}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  className="ml-1 text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(idx)}
                  title="Delete"
                  disabled={adding || editingIndex !== null}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        ))}
        {adding && (
          <div className="flex flex-col md:flex-row md:items-center md:gap-4 border-b border-gray-100 pb-4">
            <input
              className="font-semibold text-gray-800 text-lg flex-1 border px-2 py-1 rounded"
              value={newCert.name}
              onChange={(e) => handleNewChange("name", e.target.value)}
              placeholder="Certificate Name"
              autoFocus
            />
            <input
              className="text-gray-600 text-sm flex-1 border px-2 py-1 rounded"
              value={newCert.issuer || ""}
              onChange={(e) => handleNewChange("issuer", e.target.value)}
              placeholder="Issuer"
            />
            <input
              type="date"
              className="text-gray-500 text-xs flex-1 border px-2 py-1 rounded"
              value={newCert.date || ""}
              onChange={(e) => handleNewChange("date", e.target.value)}
              placeholder="Date"
            />
            <input
              className="text-blue-600 text-xs flex-1 border px-2 py-1 rounded"
              value={newCert.url || ""}
              onChange={(e) => handleNewChange("url", e.target.value)}
              placeholder="Certificate URL"
            />
            <button
              className="ml-2 text-green-600"
              onClick={handleSaveNew}
              title="Save"
              disabled={!newCert.name.trim()}
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              className="ml-1 text-red-600"
              onClick={handleCancel}
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};
