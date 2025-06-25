"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { DonutChart } from "@/components/statistics/donut-chart" // Updated import path

interface DonutChartClientProps {
  data: any[]
  competencyLevels: any[]
}

export function DonutChartClient({ data, competencyLevels }: DonutChartClientProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)

  const handleSegmentClick = (skillName: string, level: number) => {
    setSelectedSkill(skillName === selectedSkill && level === selectedLevel ? null : skillName)
    setSelectedLevel(skillName === selectedSkill && level === selectedLevel ? null : level)
  }

  const clearChartFilter = () => {
    setSelectedSkill(null)
    setSelectedLevel(null)
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full max-w-sm aspect-square">
        <DonutChart
          data={data}
          onSegmentClick={handleSegmentClick}
          selectedSkill={selectedSkill}
          selectedLevel={selectedLevel}
        />
      </div>
      {(selectedSkill !== null || selectedLevel !== null) && (
        <Button onClick={clearChartFilter} variant="outline" className="mt-4">
          <X className="mr-2 h-4 w-4" />
          Clear Chart Filter
        </Button>
      )}
    </div>
  )
}
