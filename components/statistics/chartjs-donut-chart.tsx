"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useMemo, useState } from "react";
import { COMPETENCY_LEVELS } from "@/constants/competency-level";
import type { Employee } from "@/lib/types";
import { LevelFilterSelector } from "./level-filter-selector";
import { SkillBadgeList } from "./skill-badge-list";

const COLOR_PALETTE = ["#2563eb", "#059669", "#f59e42", "#eab308", "#ef4444"];

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartJSDonutChartProps {
  data: {
    skillName: string;
    level: number;
    count: number;
    percentage: number;
    color: string;
  }[];
  employees: Employee[];
  selectedSkill?: string | null;
  selectedLevel?: number | null;
  onSegmentClick?: (skillName: string, level: number) => void;
}

export function ChartJSDonutChart({
  data,
  employees,
  selectedSkill,
  selectedLevel,
  onSegmentClick,
}: Readonly<ChartJSDonutChartProps>) {
  const [levelFilter, setLevelFilter] = useState<number | null>(null);

  const filteredChartData = useMemo(() => {
    if (levelFilter === null) return data;
    return data.filter((d) => d.level === levelFilter);
  }, [data, levelFilter]);

  const chartData = useMemo(() => {
    return {
      labels: filteredChartData.map((d) => `${d.skillName} (L${d.level})`),
      datasets: [
        {
          data: filteredChartData.map((d) => d.count),
          backgroundColor: filteredChartData.map((d, idx) => {
            if (d.color && d.color.startsWith("#")) return d.color;
            if (d.color && d.color.startsWith("bg-")) {
              const cssVar = getComputedStyle(
                document.documentElement
              ).getPropertyValue(`--${d.color.replace("bg-", "color-")}`);
              if (cssVar) return cssVar;
            }
            if (COLOR_PALETTE[idx % COLOR_PALETTE.length])
              return COLOR_PALETTE[idx % COLOR_PALETTE.length];
            const comp = COMPETENCY_LEVELS.find((c) => c.grade === d.level);
            return comp?.color ?? "#2563eb";
          }),
          borderWidth: 3,
          borderColor: "#fff",
          hoverBorderColor: "#000",
          hoverOffset: 12,
        },
      ],
    };
  }, [filteredChartData]);

  const options = useMemo(
    () => ({
      plugins: {
        legend: {
          display: false,
          position: "right" as const,
          labels: {
            color: "#374151",
            font: { size: 14 },
          },
        },
        tooltip: {
          callbacks: {
            label: function (context: { dataIndex: number }) {
              const d = data[context.dataIndex];
              if ([4, 3, 2, 1].includes(d.level)) {
                return `${d.skillName} (Level ${d.level}): ${d.count} people (${d.percentage}%)`;
              }
              return `${d.skillName} (Level ${d.level}): ${d.count} people`;
            },
          },
        },
      },
      onClick: (_e: unknown, elements: { index: number }[]) => {
        if (elements.length > 0 && onSegmentClick) {
          const idx = elements[0].index;
          const d = data[idx];
          onSegmentClick(d.skillName, d.level);
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        animateScale: true,
        animateRotate: true,
      },
      scales: {
        r: {
          grid: { color: "#e5e7eb" },
          angleLines: { color: "#e5e7eb" },
          pointLabels: { color: "#374151", font: { size: 14 } },
          ticks: { color: "#6b7280", font: { size: 12 } },
        },
      },
    }),
    [data, onSegmentClick]
  );

  const peopleForSelected = useMemo(() => {
    if (!selectedSkill || selectedLevel == null) return [];
    return employees.filter((emp) => {
      if (!emp.skills) return false;
      for (const cat of emp.skills) {
        if (!cat.skills) continue;
        for (const s of cat.skills) {
          if (s.name === selectedSkill && s.level === selectedLevel) {
            return true;
          }
        }
      }
      return false;
    });
  }, [employees, selectedSkill, selectedLevel]);

  return (
    <Card className="w-full h-full flex flex-col items-center border-none">
      <CardHeader className="w-fullpb-3">
        <CardTitle className="text-xl font-bold text-gray-900 tracking-tight">
          Skill Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center w-full pt-4">
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full max-w-md h-80 flex items-center justify-center">
            <Doughnut data={chartData} options={options} />
          </div>
          <LevelFilterSelector
            selectedLevel={levelFilter}
            onSelect={setLevelFilter}
            className="mt-4 mb-4"
          />
          {levelFilter !== null && (
            <SkillBadgeList
              skills={data
                .filter((d) => d.level === levelFilter)
                .map((d) => ({ skillName: d.skillName, level: d.level }))}
              level={levelFilter}
            />
          )}
          <div className="w-full mt-6 max-h-50 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 p-4 rounded-lg border border-gray-200 shadow-sm">
            {[...data]
              .filter((item) => item.count > 0)
              .sort((a, b) => b.level - a.level)
              .map((item) => {
                const originalIdx = data.findIndex(
                  (d) =>
                    d.skillName === item.skillName && d.level === item.level
                );
                return (
                  <button
                    key={`${item.skillName}-${item.level}`}
                    type="button"
                    className={`flex items-center gap-2 truncate py-1 px-2 rounded transition-colors ${
                      onSegmentClick ? "cursor-pointer hover:bg-gray-200" : ""
                    }`}
                    aria-pressed={
                      onSegmentClick &&
                      selectedSkill === item.skillName &&
                      selectedLevel === item.level
                        ? "true"
                        : undefined
                    }
                    onClick={() =>
                      onSegmentClick &&
                      onSegmentClick(item.skillName, item.level)
                    }
                    onKeyDown={(e) => {
                      if (
                        onSegmentClick &&
                        (e.key === "Enter" ||
                          e.key === " " ||
                          e.key === "Spacebar")
                      ) {
                        onSegmentClick(item.skillName, item.level);
                      }
                    }}
                  >
                    <span
                      className="inline-block w-3 h-3 rounded-full border border-gray-400"
                      style={{
                        background:
                          chartData.datasets[0].backgroundColor[originalIdx],
                      }}
                    />
                    <span className="truncate text-sm text-gray-800 font-medium">
                      {item.skillName}
                      <span className="text-gray-400 font-normal ml-1">
                        (L{item.level})
                      </span>
                      <span className="ml-2 text-gray-500 font-normal">
                        — {item.count}
                      </span>
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
        {selectedSkill && selectedLevel != null && (
          <div className="mt-8 w-full max-w-md bg-blue-50 rounded-lg border border-blue-200 p-4 shadow-sm">
            <div className="font-semibold mb-2 text-blue-900">
              People with <span className="text-blue-700">{selectedSkill}</span>{" "}
              (Level {selectedLevel}):
            </div>
            {peopleForSelected.length === 0 ? (
              <div className="text-gray-500">No employees found.</div>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {peopleForSelected.map((emp) => (
                  <li key={emp.id}>
                    <Badge className="bg-blue-600 text-white">
                      {emp.firstName} {emp.lastName}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
