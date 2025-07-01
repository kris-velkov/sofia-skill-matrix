"use client";

import { useMemo } from "react";
import { Filters } from "@/components/dashboard/filters/filters";
import { EmployeeSkillCard } from "@/components/employees/card/employee-skill-card";
import { useSkillsStore } from "@/store/use-skills-store";
import type { Employee } from "@/lib/types";
import { Ghost } from "lucide-react";

interface DashboardProps {
  employees: Employee[];
}

export function Dashboard({ employees }: Readonly<DashboardProps>) {
  const safeEmployees = Array.isArray(employees) ? employees : [];

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
          safeEmployees.flatMap((e) => (e.skills || []).map((cat) => cat.name))
        )
      ).sort(),
    [safeEmployees]
  );
  const allSkills = useMemo(
    () =>
      Array.from(
        new Set(
          safeEmployees.flatMap((e) =>
            (e.skills || []).flatMap((cat) =>
              (cat.skills || []).map((s) => s.name)
            )
          )
        )
      ).sort(),
    [safeEmployees]
  );

  const handleEmployeeSelect = (id: string) => {
    setFilterState({
      selectedEmployees: filterState.selectedEmployees.includes(id)
        ? filterState.selectedEmployees.filter((eid) => eid !== id)
        : [...filterState.selectedEmployees, id],
    });
  };
  const handleSkillSelect = (name: string) => {
    setFilterState({
      selectedSkills: filterState.selectedSkills.includes(name)
        ? filterState.selectedSkills.filter((n) => n !== name)
        : [...filterState.selectedSkills, name],
    });
  };

  const filteredEmployees = useMemo(() => {
    let result = safeEmployees;
    if (filterState.selectedEmployees.length > 0) {
      result = result.filter((e) =>
        filterState.selectedEmployees.includes(e.id)
      );
    }
    if (
      filterState.selectedDepartment &&
      filterState.selectedDepartment !== "all"
    ) {
      result = result.filter(
        (e) => e.department === filterState.selectedDepartment
      );
    }
    if (
      filterState.selectedSkillCategory &&
      filterState.selectedSkillCategory !== "all"
    ) {
      result = result.filter((e) =>
        e.skills.some(
          (cat) =>
            cat.name === filterState.selectedSkillCategory &&
            (filterState.minimumSkillLevel === null ||
              cat.averageLevel >= filterState.minimumSkillLevel)
        )
      );
    }
    if (
      filterState.selectedSkills.length > 0 ||
      filterState.minimumSkillLevel !== null
    ) {
      result = result.filter((e) =>
        e.skills.some((cat) =>
          cat.skills.some((skill) => {
            const skillMatches =
              filterState.selectedSkills.length === 0 ||
              filterState.selectedSkills.includes(skill.name);
            const levelMatches =
              filterState.minimumSkillLevel === null ||
              skill.level >= filterState.minimumSkillLevel;
            return skillMatches && levelMatches;
          })
        )
      );
    }
    return result;
  }, [safeEmployees, filterState]);

  return (
    <>
      <Filters
        employees={employees}
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
        Employees ({filteredEmployees.length})
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <EmployeeSkillCard key={employee.id} employee={employee} />
        ))}
        {filteredEmployees.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <Ghost className="w-15 h-15 text-gray-500" />
            <p className="text-gray-500 text-center text-lg font-medium mt-5">
              No employees match the current filters.
            </p>
            <span className="text-gray-400 text-sm mt-2">
              Try adjusting your filters to see more results.
            </span>
          </div>
        )}
      </div>
    </>
  );
}
