"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SelectFilter } from "./SelectFilter";
import { MultiSelectPopover } from "./MultiSelectPopover";
import { MinimumSkillLevelSelector } from "./MinimumSkillLevelSelector";
import { BadgeList } from "./BadgeList";
import type { FilterState, Employee } from "@/lib/types";
import { useState } from "react";

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
  allSkillCategories,
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
          <span className="inline-block w-2 h-6 bg-blue-600 rounded-full mr-2" />
          Filters
        </CardTitle>
        <div className="flex gap-2"></div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 pb-2">
        <MultiSelectPopover
          label="Employees"
          id="employee-filter"
          selected={filterState.selectedEmployees}
          options={employees.map((e) => e.id)}
          onSelect={handleEmployeeSelect}
          placeholder="Select Employees"
          searchPlaceholder="Search employees..."
          getLabel={(id) => employees.find((e) => e.id === id)?.name ?? id}
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
        <SelectFilter
          label="Skill Category"
          id="skill-category-filter"
          value={filterState.selectedSkillCategory}
          options={allSkillCategories}
          onChange={(val) => onFilterChange({ selectedSkillCategory: val })}
          placeholder="Select Skill Category"
          allLabel="All Categories"
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
          onChange={(level) => onFilterChange({ minimumSkillLevel: level })}
        />
        <Button
          variant="default"
          onClick={onClearFilters}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 px-6 py-3 rounded-lg shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <X className="mr-2 h-5 w-5" />
          Clear Filters
        </Button>
      </CardContent>
      <BadgeList
        filterState={filterState}
        employees={employees}
        onFilterChange={onFilterChange}
        handleEmployeeSelect={handleEmployeeSelect}
        handleSkillSelect={handleSkillSelect}
      />
    </Card>
  );
}
