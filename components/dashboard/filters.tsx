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

  // Reusable SelectFilter component
  function SelectFilter<T extends string>({
    label,
    id,
    value,
    options,
    onChange,
    placeholder,
    showAll = true,
    allLabel = "All",
    className,
  }: {
    label: string;
    id: string;
    value: T | null;
    options: T[];
    onChange: (value: T | null) => void;
    placeholder?: string;
    showAll?: boolean;
    allLabel?: string;
    className?: string;
  }) {
    return (
      <div className="grid gap-2">
        <Label htmlFor={id} className="text-gray-700">
          {label}
        </Label>
        <Select
          value={value || (showAll ? "all" : "")}
          onValueChange={(val) => onChange(val === "all" ? null : (val as T))}
        >
          <SelectTrigger
            id={id}
            className={cn(
              "text-gray-800 border-gray-300 hover:bg-gray-100",
              value && value !== "all" && "border-blue-500 ring-2 ring-blue-500",
              className
            )}
          >
            <SelectValue placeholder={placeholder || `Select ${label}`} />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 rounded-lg shadow-lg">
            {showAll && (
              <SelectItem
                value="all"
                className="text-gray-800 hover:bg-gray-100"
              >
                {allLabel}
              </SelectItem>
            )}
            {options.map((opt) => (
              <SelectItem
                key={opt}
                value={opt}
                className="text-gray-800 hover:bg-gray-100"
              >
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Reusable MultiSelectPopover component
  function MultiSelectPopover({
    label,
    id,
    selected,
    options,
    onSelect,
    placeholder,
    searchPlaceholder,
    getLabel,
  }: {
    label: string;
    id: string;
    selected: string[];
    options: string[];
    onSelect: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    getLabel?: (value: string) => string;
  }) {
    return (
      <div className="grid gap-2">
        <Label htmlFor={id} className="text-gray-700">
          {label}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-between text-gray-800 border-gray-300 hover:bg-gray-100",
                selected.length > 0 && "border-blue-500 ring-2 ring-blue-500"
              )}
              id={id}
            >
              {selected.length === 1
                ? getLabel
                  ? getLabel(selected[0])
                  : selected[0]
                : selected.length > 1
                ? `${selected.length} selected`
                : placeholder || `Select ${label}`}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-white border-gray-200 rounded-lg shadow-lg">
            <Command>
              <CommandInput
                placeholder={searchPlaceholder || `Search ${label.toLowerCase()}...`}
                className="border-b border-gray-200"
              />
              <CommandList>
                <CommandEmpty className="py-2 text-center text-gray-500">
                  No {label.toLowerCase()} found.
                </CommandEmpty>
                <CommandGroup>
                  {options.map((opt) => (
                    <CommandItem
                      key={opt}
                      onSelect={() => onSelect(opt)}
                      className="cursor-pointer flex items-center gap-2 text-gray-800 hover:bg-gray-100"
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selected.includes(opt)
                            ? "opacity-100 text-blue-600"
                            : "opacity-0"
                        )}
                      />
                      {getLabel ? getLabel(opt) : opt}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  // MinimumSkillLevelSelector component
  function MinimumSkillLevelSelector({
    value,
    onChange,
  }: {
    value: SkillLevel | null;
    onChange: (level: SkillLevel | null) => void;
  }) {
    return (
      <div className="grid gap-2">
        <Label className="text-gray-700">Minimum Skill Level</Label>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((level) => (
            <Button
              key={level}
              variant={value === level ? "default" : "outline"}
              onClick={() => onChange(value === level ? null : (level as SkillLevel))}
              className={cn(
                "w-10 h-10 rounded-lg",
                value === level
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
              )}
            >
              {level}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // BadgeList for selected filters
  function BadgeList() {
    return (
      (filterState.selectedEmployees.length > 0 ||
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
                className="bg-blue-100 text-blue-700 flex items-center gap-1 pr-1"
              >
                Employee: {employee.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 text-blue-700 hover:bg-transparent"
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
                className="bg-blue-100 text-blue-700 flex items-center gap-1 pr-1"
              >
                Department: {filterState.selectedDepartment}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 text-blue-700 hover:bg-transparent"
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
                className="bg-blue-100 text-blue-700 flex items-center gap-1 pr-1"
              >
                Category: {filterState.selectedSkillCategory}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 text-blue-700 hover:bg-transparent"
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
              className="bg-blue-100 text-blue-700 flex items-center gap-1 pr-1"
            >
              Skill: {skillName}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 text-blue-700 hover:bg-transparent"
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
              className="bg-blue-100 text-blue-700 flex items-center gap-1 pr-1"
            >
              Min Level: {filterState.minimumSkillLevel}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 text-blue-700 hover:bg-transparent"
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
      )
    );
  }

  return (
    <Card className="shadow-md rounded-xl">
      <CardHeader className="flex items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Filters
        </CardTitle>
        <div className="flex gap-2"></div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        <MultiSelectPopover
          label="Employees"
          id="employee-filter"
          selected={filterState.selectedEmployees}
          options={employees.map((e) => e.id)}
          onSelect={handleEmployeeSelect}
          placeholder="Select Employees"
          searchPlaceholder="Search employees..."
          getLabel={(id) => employees.find((e) => e.id === id)?.name || id}
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
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      </CardContent>

      <BadgeList />
    </Card>
  );
}
