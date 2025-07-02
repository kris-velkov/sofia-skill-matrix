"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChartJSDonutChart } from "@/components/statistics/chartjs-donut-chart";
import { SkillsTableClient } from "@/components/statistics/skills-table-client";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { Filters } from "@/components/dashboard/filters/filters";
import type { FilterState } from "@/lib/types";
import type { Employee, SkillCategory, Skill } from "@/lib/types";

import { COMPETENCY_LEVELS } from "@/constants/competency-level";
import { getAllEmployees } from "../actions/statistics-action";
import type { CompetencyLevel } from "@/constants/competency-level";
import { CompactStatsGrid } from "@/components/statistics/compact-stats-grid";

interface Stat {
  skillName: string;
  level: number;
  count: number;
}

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ChartTooltip,
  ChartLegend,
  ArcElement,
  RadialLinearScale
);

function getCompetencyLevels() {
  return COMPETENCY_LEVELS;
}

function getSkillStatistics(employees: Employee[]): Stat[] {
  const stats: Stat[] = [];
  employees.forEach((emp) => {
    (emp.skills ?? []).forEach((cat: SkillCategory) => {
      (cat.skills ?? []).forEach((skill: Skill) => {
        let stat = stats.find(
          (s) => s.skillName === skill.name && s.level === skill.level
        );
        if (!stat) {
          stat = { skillName: skill.name, level: skill.level, count: 0 };
          stats.push(stat);
        }
        stat.count += 1;
      });
    });
  });
  return stats;
}

const TAILWIND_TO_HEX: Record<string, string> = {
  "bg-red-500": "#ef4444",
  "bg-orange-500": "#f59e42",
  "bg-yellow-200": "#fde68a",
  "bg-green-500": "#22c55e",
  "bg-blue-500": "#3b82f6",
};

function getDonutChartStats(
  stats: Stat[],
  competencyLevels: CompetencyLevel[]
): Array<Stat & { percentage: number; color: string }> {
  const total = stats.reduce((sum, s) => sum + s.count, 0);
  return stats.map((s, idx) => {
    const comp = competencyLevels.find((c) => c.grade === s.level);
    let color = "#2563eb";
    if (comp?.color && TAILWIND_TO_HEX[comp.color])
      color = TAILWIND_TO_HEX[comp.color];
    else if (comp?.color && comp.color.startsWith("#")) color = comp.color;
    else {
      const palette = [
        "#2563eb",
        "#059669",
        "#f59e42",
        "#eab308",
        "#ef4444",
        "#a21caf",
        "#0ea5e9",
        "#f43f5e",
        "#10b981",
        "#f472b6",
        "#6366f1",
        "#facc15",
        "#14b8a6",
        "#e11d48",
        "#7c3aed",
      ];
      color = palette[idx % palette.length];
    }
    return {
      ...s,
      percentage: total > 0 ? Math.round((s.count / total) * 1000) / 10 : 0,
      color,
    };
  });
}

export default function StatisticsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [competencyLevels, setCompetencyLevels] = useState<CompetencyLevel[]>(
    []
  );
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [filterState, setFilterState] = useState<FilterState>({
    selectedEmployees: [],
    selectedDepartment: null,
    selectedSkillCategory: null,
    selectedSkills: [],
    minimumSkillLevel: null,
  });

  useEffect(() => {
    async function fetchData() {
      const emps = await getAllEmployees();
      setEmployees(emps);
      setCompetencyLevels(getCompetencyLevels());
    }
    fetchData();
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    if (
      (filterState.selectedEmployees.length > 0 &&
        !filterState.selectedEmployees.includes(emp.id)) ||
      (filterState.selectedDepartment &&
        (emp.department ?? "Unknown") !== filterState.selectedDepartment)
    ) {
      return false;
    }
    if (
      filterState.selectedSkills.length > 0 &&
      filterState.minimumSkillLevel != null
    ) {
      return emp.skills.some((cat) =>
        cat.skills.some(
          (s) =>
            filterState.selectedSkills.includes(s.name) &&
            s.level >= filterState.minimumSkillLevel!
        )
      );
    } else if (filterState.selectedSkills.length > 0) {
      return emp.skills.some((cat) =>
        cat.skills.some((s) => filterState.selectedSkills.includes(s.name))
      );
    } else if (filterState.minimumSkillLevel != null) {
      return emp.skills.some((cat) =>
        cat.skills.some((s) => s.level >= filterState.minimumSkillLevel!)
      );
    }
    return true;
  });

  const allDepartments = Array.from(
    new Set(employees.map((e) => e.department ?? "Unknown"))
  );
  const filteredStats = getSkillStatistics(filteredEmployees);
  const allSkills = Array.from(new Set(filteredStats.map((s) => s.skillName)));
  const donutChartStats = getDonutChartStats(filteredStats, competencyLevels);

  const handleDonutSegmentClick = (skillName: string, level: number) => {
    setSelectedSkill((prevSkill) =>
      prevSkill === skillName && selectedLevel === level ? null : skillName
    );
    setSelectedLevel((prevLevel) =>
      selectedSkill === skillName && prevLevel === level ? null : level
    );
  };

  const handleFilterChange = (changes: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...changes }));
  };
  const handleEmployeeSelect = (employeeId: string) => {
    setFilterState((prev) => {
      const exists = prev.selectedEmployees.includes(employeeId);
      return {
        ...prev,
        selectedEmployees: exists
          ? prev.selectedEmployees.filter((id) => id !== employeeId)
          : [...prev.selectedEmployees, employeeId],
      };
    });
  };
  const handleSkillSelect = (skillName: string) => {
    setFilterState((prev) => {
      const exists = prev.selectedSkills.includes(skillName);
      return {
        ...prev,
        selectedSkills: exists
          ? prev.selectedSkills.filter((s) => s !== skillName)
          : [...prev.selectedSkills, skillName],
      };
    });
  };
  const handleClearFilters = () => {
    setFilterState({
      selectedEmployees: [],
      selectedDepartment: null,
      selectedSkillCategory: null,
      selectedSkills: [],
      minimumSkillLevel: null,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid gap-6">
          <CompactStatsGrid employees={employees} />

          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Skills Statistics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of frontend skill distribution across the team.
          </p>

          <Filters
            filterState={filterState}
            employees={employees}
            allDepartments={allDepartments}
            allSkillCategories={[]}
            allSkills={allSkills}
            onFilterChange={handleFilterChange}
            handleEmployeeSelect={handleEmployeeSelect}
            handleSkillSelect={handleSkillSelect}
            onClearFilters={handleClearFilters}
          />
          <div className="w-full ">
            <Card className="lg:col-span-2 shadow-md rounded-xl flex flex-col border border-gray-100 bg-white">
              <CardContent className="flex-1 flex items-center justify-center p-4">
                <ChartJSDonutChart
                  data={donutChartStats}
                  employees={filteredEmployees}
                  selectedSkill={selectedSkill}
                  selectedLevel={selectedLevel}
                  onSegmentClick={handleDonutSegmentClick}
                />
              </CardContent>
            </Card>
          </div>
          <SkillsTableClient
            stats={filteredStats}
            competencyLevels={competencyLevels}
            selectedSkill={selectedSkill}
            selectedLevel={selectedLevel}
          />
        </div>
      </main>
    </div>
  );
}
