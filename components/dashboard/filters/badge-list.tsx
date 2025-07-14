import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Employee, FilterState } from "@/lib/types";

interface BadgeListProps {
  filterState: FilterState;
  employees: Employee[];
  onFilterChange: (changes: Partial<FilterState>) => void;
  handleEmployeeSelect: (employeeId: string) => void;
  handleSkillSelect: (skillName: string) => void;
}

export function BadgeList({
  filterState,
  employees,
  onFilterChange,
  handleEmployeeSelect,
  handleSkillSelect,
}: Readonly<BadgeListProps>) {
  if (
    !(
      filterState.selectedEmployees.length > 0 ||
      filterState.selectedDepartment ||
      filterState.selectedSkillCategory ||
      filterState.selectedSkills.length > 0 ||
      filterState.minimumSkillLevel !== null
    )
  ) {
    return null;
  }

  return (
    <div className="px-6 pb-4 flex flex-wrap gap-2">
      {filterState.selectedEmployees.map((employeeId) => {
        const employee = employees.find((emp) => emp.id === employeeId);
        return employee ? (
          <Badge
            key={`emp-${employeeId}`}
            variant="secondary"
            className="bg-blue-100 text-blue-700 flex items-center gap-1 pr-1"
          >
            Employee: {employee.firstName + " " + employee.lastName}
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
              onClick={() => onFilterChange({ selectedSkillCategory: null })}
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
            <span className="sr-only">Remove minimum skill level filter</span>
          </Button>
        </Badge>
      )}
    </div>
  );
}
