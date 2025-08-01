"use client";

import { useEffect, useState, useCallback } from "react";
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
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export function ProgramSelect({
  value,
  onValueChange,
  placeholder = "Select a program",
  disabled = false,
  required = false,
}: ProgramSelectProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrograms = useCallback(async () => {
    try {
      const data = await getAllPrograms();
      setPrograms(data);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const selectValue = value || "";

  return (
    <Select
      value={selectValue}
      onValueChange={onValueChange}
      disabled={disabled || isLoading}
      required={required}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {programs.length === 0 ? (
          <SelectItem value="__loading" disabled>
            Loading...
          </SelectItem>
        ) : (
          programs.map((program) => (
            <SelectItem key={program.id} value={program.value}>
              {program.label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
