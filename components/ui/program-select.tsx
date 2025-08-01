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
        console.log("Programs loaded:", data);
        console.log("Current value:", value);

        // Check if the current value exists in the programs
        const matchingProgram = data.find((p) => p.value === value);
        console.log("Matching program:", matchingProgram);
      } catch (error) {
        console.error("Failed to fetch programs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, [value]);

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading programs..." />
        </SelectTrigger>
      </Select>
    );
  }

  // Find the selected program to show its label
  const selectedProgram = programs.find((p) => p.value === value);

  // Only pass value if it exists in the programs list and is not empty
  const selectValue =
    value && programs.some((p) => p.value === value) ? value : undefined;

  return (
    <Select
      value={selectValue}
      onValueChange={onValueChange}
      disabled={disabled}
      required={required}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={selectedProgram ? selectedProgram.label : placeholder}
        />
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
