"use client";

import PageLayout from "@/components/layouts/PageLayout";
import { useState } from "react";
import { getFrontendSkillStatistics } from "@/lib/statistics";
import { CompetencyLegend } from "@/components/dashboard/competency-legend";
import { DonutChartClient } from "@/components/statistics/donut-chart-client";
import { SkillsTableClient } from "@/components/statistics/skills-table-client";

export default function StatisticsPage({
  employees,
  competencyLevels,
  frontendStats,
}: {
  employees: any[];
  competencyLevels: any[];
  frontendStats: any;
}) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const handleDonutSegmentClick = (skillName: string, level: number) => {
    setSelectedSkill(
      skillName === selectedSkill && level === selectedLevel ? null : skillName
    );
    setSelectedLevel(
      skillName === selectedSkill && level === selectedLevel ? null : level
    );
  };

  const clearDonutChartFilter = () => {
    setSelectedSkill(null);
    setSelectedLevel(null);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Statistics" },
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbItems}>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Skills Statistics
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Overview of frontend skill distribution across the team.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart Card */}
        <div className="lg:col-span-2 shadow-md rounded-xl flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Frontend Skill Distribution
          </h3>
          <DonutChartClient
            data={frontendStats}
            competencyLevels={competencyLevels}
            onSegmentClick={handleDonutSegmentClick}
            selectedSkill={selectedSkill}
            selectedLevel={selectedLevel}
            onClearFilter={clearDonutChartFilter}
          />
        </div>
        {/* Competency Legend Card */}
        <div className="shadow-md rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Competency Levels
          </h3>
          <CompetencyLegend />
        </div>
      </div>
      {/* Skills Table */}
      <SkillsTableClient
        frontendStats={frontendStats}
        competencyLevels={competencyLevels}
        selectedSkill={selectedSkill}
        selectedLevel={selectedLevel}
      />
    </PageLayout>
  );
}

export async function getServerSideProps() {
  const employees = await getEmployees();
  const competencyLevels = getCompetencyLevels();
  const frontendStats = getFrontendSkillStatistics(employees);
  return {
    props: {
      employees,
      competencyLevels,
      frontendStats,
    },
  };
}
