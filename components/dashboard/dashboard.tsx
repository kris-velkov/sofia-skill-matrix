"use client";

import { useMemo } from "react";
import { Filters } from "@/components/dashboard/filters/filters";
import { EmployeeSkillCard } from "@/components/employees/card/employee-skill-card";
import { useSkillsStore } from "@/store/use-skills-store";
import { Ghost, User } from "lucide-react";
import { getFilteredEmployees } from "@/lib/utils";
import EmptyState from "../ui/empty-state";
import { Employee } from "@/types/employees";

interface DashboardProps {
  employees: Employee[];
}

export function Dashboard({ employees }: Readonly<DashboardProps>) {
  const safeEmployees = useMemo(() => employees ?? [], [employees]);

  const filterState = useSkillsStore((state) => state.filterState);
  const setFilterState = useSkillsStore((state) => state.setFilterState);
  const clearFilters = useSkillsStore((state) => state.clearFilters);

  const allDepartments = useMemo(
    () => Array.from(new Set(safeEmployees.map((e) => e.department))).sort(),
    [safeEmployees]
  );

  const allSkillCategories = useMemo(
    () =>
      Array.from(
        new Set(
          safeEmployees.flatMap((e) => e.skills?.map((cat) => cat.name) ?? [])
        )
      ).sort(),
    [safeEmployees]
  );

  const allSkills = useMemo(
    () =>
      Array.from(
        new Set(
          safeEmployees.flatMap(
            (e) =>
              e.skills?.flatMap(
                (cat) => cat.skills?.map((s) => s.name) ?? []
              ) ?? []
          )
        )
      ).sort(),
    [safeEmployees]
  );

  const handleEmployeeSelect = (id: string) => {
    const selected = filterState.selectedEmployees.includes(id)
      ? filterState.selectedEmployees.filter((eid) => eid !== id)
      : [...filterState.selectedEmployees, id];

    setFilterState({ selectedEmployees: selected });
  };

  const handleSkillSelect = (name: string) => {
    const selected = filterState.selectedSkills.includes(name)
      ? filterState.selectedSkills.filter((n) => n !== name)
      : [...filterState.selectedSkills, name];

    setFilterState({ selectedSkills: selected });
  };

  const filteredEmployees = useMemo(() => {
    return getFilteredEmployees(safeEmployees, filterState);
  }, [safeEmployees, filterState]);

  return (
    <>
      <Filters
        employees={safeEmployees}
        filterState={filterState}
        allDepartments={allDepartments}
        allSkillCategories={allSkillCategories}
        allSkills={allSkills}
        onFilterChange={setFilterState}
        handleEmployeeSelect={handleEmployeeSelect}
        handleSkillSelect={handleSkillSelect}
        onClearFilters={clearFilters}
      />
      <div className="text-lg font-semibold mt-4 text-gray-800">
        <User className="inline mr-2 w-4 h-4 text-gray-400" />
        Employees ({filteredEmployees.length})
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-20">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <EmployeeSkillCard key={employee.id} employee={employee} />
          ))
        ) : (
          <EmptyState
            className="col-span-3 mt-10 text-gray-500 gap-4"
            message="No employees match the current filters."
            icon={
              <Ghost className="w-15 h-15 text-gray-500 mt-10 animate-pulse" />
            }
          />
        )}
      </div>
    </>
  );
}
