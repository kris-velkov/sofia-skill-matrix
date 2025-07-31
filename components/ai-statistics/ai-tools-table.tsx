import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmployeeAvatar } from "../employees/employee-avatar";
import { capitalizeFirstLetter, formatDepartment } from "@/lib/utils/normalize";
import { getEmployeeFullName } from "@/lib/utils/employees";
import EmptyState from "../ui/empty-state";
import { Bot, Cpu, Zap } from "lucide-react";
import { EmployeeAiToolData } from "@/types/employees";
import {
  formatFrequency,
  formatProficiencyLevel,
} from "@/lib/utils/aiToolsUtils";

interface AiToolsTableProps {
  aiTools: EmployeeAiToolData[];
}

export function AiToolsTable({ aiTools }: Readonly<AiToolsTableProps>) {
  const hasData = aiTools?.length > 0;

  return (
    <Card className="shadow-sm border border-gray-200 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <Bot className="h-5 w-5 text-purple-500" />
          AI Tools {hasData ? `(${aiTools.length})` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-700 text-white">
              <TableRow>
                <TableHead>AI Tool</TableHead>
                <TableHead>Proficiency Level</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Employee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hasData ? (
                aiTools.map((tool) => (
                  <TableRow
                    key={`${tool.employees?.id}-${tool.aiTools?.id}`}
                    className="text-gray-600 border-b border-gray-200 hover:bg-gray-200"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-gray-500" />
                        <strong className="font-normal text-gray-900">
                          {tool.aiTools.name}
                        </strong>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tool.level && formatProficiencyLevel(tool.level)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {formatFrequency(tool.frequency)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tool.employees.program &&
                          capitalizeFirstLetter(tool.employees.program)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {(tool.employees?.department &&
                        formatDepartment(tool.employees.department)) ||
                        "—"}
                    </TableCell>
                    <TableCell>{tool.employees?.role || "—"}</TableCell>
                    <TableCell>
                      <Link
                        href={`/employee/${tool.employees?.id}`}
                        className="flex items-center gap-2 hover:text-blue-600 hover:underline"
                      >
                        <EmployeeAvatar
                          src={tool.employees?.profileImage}
                          alt={`${tool.employees?.firstName} profile`}
                        />
                        <span>
                          {tool.employees?.firstName &&
                            tool.employees?.lastName &&
                            getEmployeeFullName(
                              tool.employees.firstName,
                              tool.employees.lastName
                            )}
                        </span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No AI tools data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="hidden md:block lg:hidden overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-700 text-white">
              <TableRow>
                <TableHead>AI Tool</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Employee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hasData ? (
                aiTools.map((tool) => (
                  <TableRow
                    key={`${tool.employees?.id}-${tool.aiTools?.id}`}
                    className="text-gray-600 border-b border-gray-200 hover:bg-gray-200"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-gray-500" />
                        <strong className="font-normal text-gray-900">
                          {tool.aiTools.name}
                        </strong>
                      </div>
                    </TableCell>
                    <TableCell>
                      {tool.level && formatProficiencyLevel(tool.level)}
                    </TableCell>
                    <TableCell>{formatFrequency(tool.frequency)}</TableCell>
                    <TableCell>
                      <Link
                        href={`/employee/${tool.employees?.id}`}
                        className="flex items-center gap-2 hover:text-blue-600 hover:underline"
                      >
                        <EmployeeAvatar
                          src={tool.employees?.profileImage}
                          alt={`${tool.employees?.firstName} profile`}
                        />
                        <span className="text-sm">
                          {tool.employees?.firstName &&
                            tool.employees?.lastName &&
                            getEmployeeFullName(
                              tool.employees.firstName,
                              tool.employees.lastName
                            )}
                        </span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No AI tools data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden flex flex-col gap-4">
          {hasData ? (
            aiTools.map((tool) => (
              <div
                key={`${tool.employees?.id}-${tool.aiTools?.id}`}
                className="rounded-xl border border-gray-200 shadow-sm p-4 space-y-2 bg-white"
              >
                <div className="flex items-center gap-2 font-semibold text-blue-600">
                  <Bot className="h-4 w-4" />
                  {tool.aiTools.name}
                </div>

                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-blue-500" />
                    <strong>Level:</strong>
                    {tool.level && formatProficiencyLevel(tool.level)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <strong>Frequency:</strong>{" "}
                    {formatFrequency(tool.frequency)}
                  </div>
                  <div>
                    <strong>Program:</strong>{" "}
                    {tool.employees.program &&
                      capitalizeFirstLetter(tool.employees.program)}
                  </div>
                  <div>
                    <strong>Department:</strong>{" "}
                    {(tool.employees?.department &&
                      formatDepartment(tool.employees.department)) ||
                      "—"}
                  </div>
                  <p>
                    <strong>Role:</strong> {tool.employees?.role || "—"}
                  </p>
                  <div className="flex items-center gap-2 pt-2 hover:text-blue-500">
                    <EmployeeAvatar
                      src={tool.employees?.profileImage}
                      alt={`${tool.employees?.firstName} profile`}
                    />
                    <Link
                      href={`/employee/${tool.employees?.id}`}
                      className="hover:underline font-medium text-foreground"
                    >
                      {tool.employees?.firstName &&
                        tool.employees?.lastName &&
                        getEmployeeFullName(
                          tool.employees.firstName,
                          tool.employees.lastName
                        )}
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={<Bot className="w-6 h-6 mb-2" />}
              message="No AI tools data available."
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
