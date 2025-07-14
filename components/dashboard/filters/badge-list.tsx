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
            className="bg-gray-200 text-black flex items-center gap-1 pr-1 shadow"
          >
            <span className="font-bold text-blue-400">Employee: </span>
            <span className="text-gray-800">
              {employee.firstName + " " + employee.lastName}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 text-red-700 hover:text-red-900 cursor-pointer ml-2"
              onClick={() => handleEmployeeSelect(employeeId)}
            >
              <X className="h-3 w-3 rounded-full shadow p-0.5 bg-white" />
              <span className="sr-only">Remove employee filter</span>
            </Button>
          </Badge>
        ) : null;
      })}

      {filterState.selectedDepartment &&
        filterState.selectedDepartment !== "all" && (
          <Badge
            variant="secondary"
            className="bg-gray-200 flex items-center gap-1 pr-1"
          >
            <span className="font-bold text-black text-orange-400">
              Departament:{" "}
            </span>
            <span className="text-gray-900">
              {filterState.selectedDepartment}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 text-red-700 hover:text-red-900 cursor-pointer ml-2"
              onClick={() => onFilterChange({ selectedDepartment: null })}
            >
              <X className="h-3 w-3 rounded-full shadow p-0.5 bg-white" />
              <span className="sr-only">Remove department filter</span>
            </Button>
          </Badge>
        )}
      {filterState.selectedSkills.map((skillName) => (
        <Badge
          key={`skill-${skillName}`}
          variant="secondary"
          className="bg-stone-300 text-red-700 flex items-center gap-1 pr-1 shadow-sm"
        >
          <span className="font-bold text-green-600">Skill: </span>
          <span className="text-gray-800">{skillName}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 text-red-700 hover:text-red-900 cursor-pointer ml-2"
            onClick={() => handleSkillSelect(skillName)}
          >
            <X className="h-3 w-3 rounded-full shadow p-0.5 bg-white" />
            <span className="sr-only">Remove skill filter</span>
          </Button>
        </Badge>
      ))}

      {filterState.minimumSkillLevel !== null && (
        <Badge
          variant="secondary"
          className="bg-stone-300 text-black flex items-center gap-1 pr-1"
        >
          <span className="font-bold text-rose-500"> Level:</span>
          <span className="text-gray-900">{filterState.minimumSkillLevel}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 text-red-700 hover:text-red-900 cursor-pointer ml-2"
            onClick={() => onFilterChange({ minimumSkillLevel: null })}
          >
            <X className="h-3 w-3 rounded-full shadow p-0.5 bg-white" />
            <span className="sr-only">Remove minimum skill level filter</span>
          </Button>
        </Badge>
      )}
    </div>
  );
}
