"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SelectFilter } from "./select-filter";
import { MultiSelectPopover } from "./multi-select-popover";
import { MinimumSkillLevelSelector } from "./minimum-skill-level-selector";
import { BadgeList } from "./badge-list";
import type { FilterState, Employee } from "@/lib/types";

interface FiltersProps {
  filterState: FilterState;
  employees: Employee[];
  allDepartments: string[];
  allSkillCategories: string[];
  allSkills: string[];
  onFilterChange: (changes: Partial<FilterState>) => void;
  handleEmployeeSelect: (employeeId: string) => void;
  handleSkillSelect: (skillName: string) => void;
  onClearFilters: () => void;
}

export function Filters({
  filterState,
  employees,
  allDepartments,
  allSkills,
  onFilterChange,
  handleEmployeeSelect,
  handleSkillSelect,
  onClearFilters,
}: Readonly<FiltersProps>) {
  return (
    <Card className="shadow-lg rounded-2xl border border-gray-200 bg-white/95">
      <CardHeader className="flex items-center justify-between space-y-0 pb-2 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white rounded-t-2xl">
        <CardTitle className="text-xl font-bold text-blue-900 tracking-tight flex items-center gap-2">
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 pb-2">
        <MultiSelectPopover
          label="Employees"
          id="employee-filter"
          selected={filterState.selectedEmployees}
          options={employees.map((e) => e.id)}
          onSelect={handleEmployeeSelect}
          placeholder="Select Employees"
          searchPlaceholder="Search employees..."
          getLabel={(id) => {
            const emp = employees.find((e) => e.id === id);
            return emp ? `${emp.firstName} ${emp.lastName}` : id;
          }}
        />
        <SelectFilter
          label="Department"
          id="department-filter"
          value={filterState.selectedDepartment}
          options={allDepartments}
          onChange={(val) => onFilterChange({ selectedDepartment: val })}
          placeholder="Select Department"
          allLabel="All Departments"
        />
        <MultiSelectPopover
          label="Skills"
          id="skills-filter"
          selected={filterState.selectedSkills}
          options={allSkills}
          onSelect={handleSkillSelect}
          placeholder="Select Skills"
          searchPlaceholder="Search skills..."
        />
        <MinimumSkillLevelSelector
          value={filterState.minimumSkillLevel}
          onChange={(level) =>
            onFilterChange({ minimumSkillLevel: level ?? 1 })
          }
        />
      </CardContent>
      <div className="border-t border-gray-200 mt-2 pt-4 px-6 bg-white/95 rounded-b-2xl">
        <BadgeList
          filterState={filterState}
          employees={employees}
          onFilterChange={onFilterChange}
          handleEmployeeSelect={handleEmployeeSelect}
          handleSkillSelect={handleSkillSelect}
        />
        <div className="flex justify-end mt-2 mb-2">
          <Button
            variant="default"
            onClick={onClearFilters}
            disabled={
              !filterState.selectedEmployees.length &&
              !filterState.selectedDepartment &&
              !filterState.selectedSkills.length &&
              filterState.minimumSkillLevel === null
            }
            aria-label="Clear Filters"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center  px-4 py-2 rounded-lg shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <X className="h-3 w-3" />
            Clear Filters
          </Button>
        </div>
      </div>
    </Card>
  );
}
