"use client";

import { useMemo } from "react";
import { Filters } from "@/components/dashboard/filters/filters";
import { EmployeeSkillCard } from "@/components/dashboard/employee-skill-card";
import { useSkillsStore } from "@/store/use-skills-store";
import type { Employee } from "@/lib/types";

interface DashboardClientProps {
  employees: Employee[];
}

export function DashboardClient({ employees }: DashboardClientProps) {
  const filterState = useSkillsStore((state) => state.filterState);
  const setFilterState = useSkillsStore((state) => state.setFilterState);
  const clearFilters = useSkillsStore((state) => state.clearFilters);

  // Helper: get all unique departments, skill categories, and skills
  const allDepartments = useMemo(
    () => Array.from(new Set(employees.map((e) => e.department))).sort(),
    [employees]
  );
  const allSkillCategories = useMemo(
    () =>
      Array.from(
        new Set(employees.flatMap((e) => e.skills.map((cat) => cat.name)))
      ).sort(),
    [employees]
  );
  const allSkills = useMemo(
    () =>
      Array.from(
        new Set(
          employees.flatMap((e) =>
            e.skills.flatMap((cat) => cat.skills.map((s) => s.name))
          )
        )
      ).sort(),
    [employees]
  );

  // Handlers for MultiSelectPopover
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

  // Filtering logic
  const filteredEmployees = useMemo(() => {
    let result = employees;
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
  }, [employees, filterState]);

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
          <p className="text-gray-500 col-span-full text-center py-8">
            No employees match the current filters.
          </p>
        )}
      </div>
    </>
  );
}
