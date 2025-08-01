"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Program } from "@/types/programs";
import { getAllPrograms } from "@/app/actions/programs-actions";

interface ProgramSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export function ProgramSelect({
  value,
  onValueChange,
  placeholder = "Select program",
  disabled = false,
  required = false,
}: ProgramSelectProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await getAllPrograms();
        setPrograms(data);
      } catch (error) {
        console.error("Failed to fetch programs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading programs..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      required={required}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {programs.map((program) => (
          <SelectItem key={program.id} value={program.value}>
            {program.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
