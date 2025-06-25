"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getEmployees, getCompetencyLevels } from "@/lib/db"
import { getFrontendSkillStatistics } from "@/lib/statistics"
import { CompetencyLegend } from "@/components/dashboard/competency-legend"
import { DonutChartClient } from "@/components/statistics/donut-chart-client" // Import the new client component
import { SkillsTableClient } from "@/components/statistics/skills-table-client" // Import the new client component
import { useState } from "react" // For client-side state management of filters

export default async function StatisticsPage() {
  const employees = await getEmployees() // Fetch employees on the server
  const competencyLevels = getCompetencyLevels() // Get competency levels
  const frontendStats = getFrontendSkillStatistics(employees)

  // State to manage the selected skill/level from the donut chart, shared between client components
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)

  const handleDonutSegmentClick = (skillName: string, level: number) => {
    setSelectedSkill(skillName === selectedSkill && level === selectedLevel ? null : skillName)
    setSelectedLevel(skillName === selectedSkill && level === selectedLevel ? null : level)
  }

  const clearDonutChartFilter = () => {
    setSelectedSkill(null)
    setSelectedLevel(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid gap-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Skills Statistics</h2>
          <p className="text-gray-600 dark:text-gray-400">Overview of frontend skill distribution across the team.</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Donut Chart Card */}
            <Card className="lg:col-span-2 shadow-md rounded-xl flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Frontend Skill Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center p-4">
                <DonutChartClient
                  data={frontendStats}
                  competencyLevels={competencyLevels}
                  onSegmentClick={handleDonutSegmentClick} // Pass handler to update parent state
                  selectedSkill={selectedSkill}
                  selectedLevel={selectedLevel}
                  onClearFilter={clearDonutChartFilter} // Pass clear filter handler
                />
              </CardContent>
            </Card>

            {/* Competency Legend Card */}
            <Card className="shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Competency Levels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CompetencyLegend />
              </CardContent>
            </Card>
          </div>

          {/* Skills Table */}
          <SkillsTableClient
            frontendStats={frontendStats}
            competencyLevels={competencyLevels}
            selectedSkill={selectedSkill} // Pass selected filter from parent state
            selectedLevel={selectedLevel} // Pass selected filter from parent state
          />
        </div>
      </main>
    </div>
  )
}
