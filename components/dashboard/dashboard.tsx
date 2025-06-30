"use client";

import { useMemo } from "react";
import { Header } from "@/components/dashboard/header";
import { Filters } from "@/components/dashboard/filters/filters";
import { EmployeeSkillCard } from "@/components/employees/card/employee-skill-card";
import { useSkillsStore } from "@/store/use-skills-store";

export function Dashboard() {
  const employees = useSkillsStore((state) => state.employees);
  const filterState = useSkillsStore((state) => state.filterState);
  const setFilterState = useSkillsStore((state) => state.setFilterState);
  const clearFilters = useSkillsStore((state) => state.clearFilters);

  const filteredEmployees = useMemo(() => {
    let filtered = employees;

    if (filterState.selectedEmployees.length > 0) {
      filtered = filtered.filter((employee) =>
        filterState.selectedEmployees.includes(employee.id)
      );
    }

    // Filter by department
    if (
      filterState.selectedDepartment &&
      filterState.selectedDepartment !== "all"
    ) {
      filtered = filtered.filter(
        (employee) => employee.department === filterState.selectedDepartment
      );
    }

    // Filter by skill category and minimum skill level within that category
    if (
      filterState.selectedSkillCategory &&
      filterState.selectedSkillCategory !== "all"
    ) {
      filtered = filtered.filter((employee) => {
        const matchingCategories = employee.skills.filter((category) => {
          const categoryMatches =
            category.name === filterState.selectedSkillCategory;

          const levelMatches =
            filterState.minimumSkillLevel !== null
              ? category.averageLevel >= filterState.minimumSkillLevel
              : true;

          return categoryMatches && levelMatches;
        });

        return matchingCategories.length > 0;
      });
    }

    // Filter by specific skills and their minimum level
    if (
      filterState.selectedSkills.length > 0 ||
      filterState.minimumSkillLevel !== null
    ) {
      filtered = filtered.filter((employee) => {
        let hasMatchingSkill = false;
        for (const category of employee.skills) {
          for (const skill of category.skills) {
            const skillMatches =
              filterState.selectedSkills.length > 0
                ? filterState.selectedSkills.includes(skill.name)
                : true;

            const levelMatches =
              filterState.minimumSkillLevel !== null
                ? skill.level >= filterState.minimumSkillLevel
                : true;

            if (skillMatches && levelMatches) {
              hasMatchingSkill = true;
              break;
            }
          }
          if (hasMatchingSkill) break;
        }
        return hasMatchingSkill;
      });
    }

    return filtered;
  }, [employees, filterState]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid gap-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Skills Matrix Dashboard
          </h2>
          <p className="text-gray-600">
            View and filter employee skills across departments and categories
          </p>

          <Filters
            employees={employees} // Pass all employees for dropdown options
            filterState={filterState}
            onFilterChange={setFilterState}
            onClearFilters={clearFilters}
          />

          <div className="text-lg font-semibold mt-4 text-gray-800">
            Employees ({filteredEmployees.length})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map((employee) => (
              <EmployeeSkillCard key={employee.id} employee={employee} />
            ))}
            {filteredEmployees.length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-8">
                No employees match the current filters.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
