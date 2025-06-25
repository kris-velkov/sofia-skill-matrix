"use client";

import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { FilterState, Employee, SkillLevel } from "@/lib/types";
import { X, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface FiltersProps {
  employees: Employee[];
  filterState: FilterState;
  onFilterChange: (newFilterState: Partial<FilterState>) => void;
  onClearFilters: () => void;
}

export function Filters({
  employees,
  filterState,
  onFilterChange,
  onClearFilters,
}: FiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const allDepartments = useMemo(() => {
    const departments = new Set<string>();
    employees.forEach((emp) => departments.add(emp.department));
    return Array.from(departments).sort();
  }, [employees]);

  const allSkillCategories = useMemo(() => {
    const categories = new Set<string>();
    employees.forEach((emp) =>
      emp.skills.forEach((cat) => categories.add(cat.name))
    );
    return Array.from(categories).sort();
  }, [employees]);

  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    employees.forEach((emp) =>
      emp.skills.forEach((cat) =>
        cat.skills.forEach((skill) => skills.add(skill.name))
      )
    );
    return Array.from(skills).sort();
  }, [employees]);

  const handleEmployeeSelect = (employeeId: string) => {
    const newSelectedEmployees = filterState.selectedEmployees.includes(
      employeeId
    )
      ? filterState.selectedEmployees.filter((id) => id !== employeeId)
      : [...filterState.selectedEmployees, employeeId];
    onFilterChange({ selectedEmployees: newSelectedEmployees });
  };

  const handleSkillSelect = (skillName: string) => {
    const newSelectedSkills = filterState.selectedSkills.includes(skillName)
      ? filterState.selectedSkills.filter((s) => s !== skillName)
      : [...filterState.selectedSkills, skillName];
    onFilterChange({ selectedSkills: newSelectedSkills });
  };

  return (
    <Card className="shadow-md rounded-xl">
      <CardHeader className="flex items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Filters
        </CardTitle>
        <div className="flex gap-2"></div>
      </CardHeader>

      {/* Filter controls */}
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {/* Employee Filter */}
        <div className="grid gap-2">
          <Label
            htmlFor="employee-filter"
            className="text-gray-700 dark:text-gray-300"
          >
            Employees
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700",
                  filterState.selectedEmployees.length > 0 &&
                    "border-blue-500 ring-2 ring-blue-500"
                )}
                id="employee-filter"
              >
                {filterState.selectedEmployees.length === 1
                  ? employees.find(
                      (emp) => emp.id === filterState.selectedEmployees[0]
                    )?.name
                  : filterState.selectedEmployees.length > 1
                  ? `${filterState.selectedEmployees.length} selected`
                  : "Select Employees"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              <Command>
                <CommandInput
                  placeholder="Search employees..."
                  className="border-b border-gray-200 dark:border-gray-700"
                />
                <CommandList>
                  <CommandEmpty className="py-2 text-center text-gray-500 dark:text-gray-400">
                    No employee found.
                  </CommandEmpty>
                  <CommandGroup>
                    {employees.map((employee) => (
                      <CommandItem
                        key={employee.id}
                        onSelect={() => handleEmployeeSelect(employee.id)}
                        className="cursor-pointer flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            filterState.selectedEmployees.includes(employee.id)
                              ? "opacity-100 text-blue-600 dark:text-blue-400"
                              : "opacity-0"
                          )}
                        />
                        {employee.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Department Filter */}
        <div className="grid gap-2">
          <Label
            htmlFor="department-filter"
            className="text-gray-700 dark:text-gray-300"
          >
            Department
          </Label>
          <Select
            value={filterState.selectedDepartment || "all"}
            onValueChange={(value) =>
              onFilterChange({ selectedDepartment: value || null })
            }
          >
            <SelectTrigger
              id="department-filter"
              className={cn(
                "text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700",
                filterState.selectedDepartment &&
                  filterState.selectedDepartment !== "all" &&
                  "border-blue-500 ring-2 ring-blue-500"
              )}
            >
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              <SelectItem
                value="all"
                className="text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                All Departments
              </SelectItem>
              {allDepartments.map((dept) => (
                <SelectItem
                  key={dept}
                  value={dept}
                  className="text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Skill Category Filter */}
        <div className="grid gap-2">
          <Label
            htmlFor="skill-category-filter"
            className="text-gray-700 dark:text-gray-300"
          >
            Skill Category
          </Label>
          <Select
            value={filterState.selectedSkillCategory || "all"}
            onValueChange={(value) =>
              onFilterChange({ selectedSkillCategory: value || null })
            }
          >
            <SelectTrigger
              id="skill-category-filter"
              className={cn(
                "text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700",
                filterState.selectedSkillCategory &&
                  filterState.selectedSkillCategory !== "all" &&
                  "border-blue-500 ring-2 ring-blue-500"
              )}
            >
              <SelectValue placeholder="Select Skill Category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              <SelectItem
                value="all"
                className="text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                All Categories
              </SelectItem>
              {allSkillCategories.map((cat) => (
                <SelectItem
                  key={cat}
                  value={cat}
                  className="text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Skills Filter */}
        <div className="grid gap-2">
          <Label
            htmlFor="skills-filter"
            className="text-gray-700 dark:text-gray-300"
          >
            Skills
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700",
                  filterState.selectedSkills.length > 0 &&
                    "border-blue-500 ring-2 ring-blue-500"
                )}
                id="skills-filter"
              >
                {filterState.selectedSkills.length === 1
                  ? filterState.selectedSkills[0]
                  : filterState.selectedSkills.length > 1
                  ? `${filterState.selectedSkills.length} selected`
                  : "Select Skills"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              <Command>
                <CommandInput
                  placeholder="Search skills..."
                  className="border-b border-gray-200 dark:border-gray-700"
                />
                <CommandList>
                  <CommandEmpty className="py-2 text-center text-gray-500 dark:text-gray-400">
                    No skill found.
                  </CommandEmpty>
                  <CommandGroup>
                    {allSkills.map((skill) => (
                      <CommandItem
                        key={skill}
                        onSelect={() => handleSkillSelect(skill)}
                        className="cursor-pointer flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            filterState.selectedSkills.includes(skill)
                              ? "opacity-100 text-blue-600 dark:text-blue-400"
                              : "opacity-0"
                          )}
                        />
                        {skill}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Minimum Skill Level */}
        <div className="grid gap-2">
          <Label className="text-gray-700 dark:text-gray-300">
            Minimum Skill Level
          </Label>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((level) => (
              <Button
                key={level}
                variant={
                  filterState.minimumSkillLevel === level
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  onFilterChange({
                    minimumSkillLevel:
                      filterState.minimumSkillLevel === level
                        ? null
                        : (level as SkillLevel),
                  })
                }
                className={cn(
                  "w-10 h-10 rounded-lg",
                  filterState.minimumSkillLevel === level
                    ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                )}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>
        <Button
          variant="default"
          onClick={onClearFilters}
          className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      </CardContent>

      {/* Display Selected Filters as Badges */}
      {(filterState.selectedEmployees.length > 0 ||
        filterState.selectedDepartment ||
        filterState.selectedSkillCategory ||
        filterState.selectedSkills.length > 0 ||
        filterState.minimumSkillLevel !== null) && (
        <div className="px-6 pb-4 flex flex-wrap gap-2">
          {filterState.selectedEmployees.map((employeeId) => {
            const employee = employees.find((emp) => emp.id === employeeId);
            return employee ? (
              <Badge
                key={`emp-${employeeId}`}
                variant="secondary"
                className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1 pr-1"
              >
                Employee: {employee.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 text-blue-700 dark:text-blue-200 hover:bg-transparent"
                  onClick={() => handleEmployeeSelect(employeeId)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove employee filter</span>
                </Button>
              </Badge>
            ) : null;
          })}

          {filterState.selectedDepartment &&
            filterState.selectedDepartment !== "all" && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1 pr-1"
              >
                Department: {filterState.selectedDepartment}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 text-blue-700 dark:text-blue-200 hover:bg-transparent"
                  onClick={() => onFilterChange({ selectedDepartment: null })}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove department filter</span>
                </Button>
              </Badge>
            )}

          {filterState.selectedSkillCategory &&
            filterState.selectedSkillCategory !== "all" && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1 pr-1"
              >
                Category: {filterState.selectedSkillCategory}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 text-blue-700 dark:text-blue-200 hover:bg-transparent"
                  onClick={() =>
                    onFilterChange({ selectedSkillCategory: null })
                  }
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove skill category filter</span>
                </Button>
              </Badge>
            )}

          {filterState.selectedSkills.map((skillName) => (
            <Badge
              key={`skill-${skillName}`}
              variant="secondary"
              className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1 pr-1"
            >
              Skill: {skillName}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 text-blue-700 dark:text-blue-200 hover:bg-transparent"
                onClick={() => handleSkillSelect(skillName)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove skill filter</span>
              </Button>
            </Badge>
          ))}

          {filterState.minimumSkillLevel !== null && (
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1 pr-1"
            >
              Min Level: {filterState.minimumSkillLevel}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 text-blue-700 dark:text-blue-200 hover:bg-transparent"
                onClick={() => onFilterChange({ minimumSkillLevel: null })}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">
                  Remove minimum skill level filter
                </span>
              </Button>
            </Badge>
          )}
        </div>
      )}
    </Card>
  );
}
