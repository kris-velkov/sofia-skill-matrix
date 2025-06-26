"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useMemo } from "react"

interface SkillsTableClientProps {
  frontendStats: any[]
  competencyLevels: any[]
  // Add props for selectedSkill and selectedLevel if you want to control filtering from parent
  selectedSkill?: string | null
  selectedLevel?: number | null
}

export function SkillsTableClient({
  frontendStats,
  competencyLevels,
  selectedSkill: propSelectedSkill,
  selectedLevel: propSelectedLevel,
}: SkillsTableClientProps) {
  // Use internal state if not controlled by props, or sync with props
  const [internalSelectedSkill, setInternalSelectedSkill] = useState<string | null>(propSelectedSkill || null)
  const [internalSelectedLevel, setInternalSelectedLevel] = useState<number | null>(propSelectedLevel || null)

  // Sync internal state with props if they change
  useMemo(() => {
    setInternalSelectedSkill(propSelectedSkill || null)
    setInternalSelectedLevel(propSelectedLevel || null)
  }, [propSelectedSkill, propSelectedLevel])

  const filteredTableData = useMemo(() => {
    return frontendStats.filter((stat) => {
      const skillMatch = internalSelectedSkill ? stat.skillName === internalSelectedSkill : true
      const levelMatch = internalSelectedLevel !== null ? stat.level === internalSelectedLevel : true
      return skillMatch && levelMatch
    })
  }, [frontendStats, internalSelectedSkill, internalSelectedLevel])

  return (
    <Card className="shadow-md rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Detailed Skill Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTableData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                    No data available for the selected filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTableData.map((stat, index) => {
                  const competency = competencyLevels.find((c) => c.grade === stat.level)
                  return (
                    <TableRow key={`${stat.skillName}-${stat.level}-${index}`}>
                      <TableCell className="font-medium">{stat.skillName}</TableCell>
                      <TableCell>
                        <Badge className={stat.color}>{stat.level}</Badge>
                      </TableCell>
                      <TableCell>{stat.count}</TableCell>
                      <TableCell>{stat.percentage.toFixed(1)}%</TableCell>
                      <TableCell>{competency?.description || "N/A"}</TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
