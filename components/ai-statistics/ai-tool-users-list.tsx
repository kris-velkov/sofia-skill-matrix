import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmployeeAvatar } from "../employees/employee-avatar";
import { SkillLevelBadge } from "../employees/employee-skill-level-badge";
import { formatDepartment } from "@/lib/utils/normalize";
import { getLevelNumber, getLevelOrder } from "@/lib/utils/aiToolsUtils";

interface User {
  name: string;
  level: string;
  id?: string;
  profileImage?: string | null;
  department?: string | null;
  role?: string | null;
}

interface AiToolUsersListProps {
  users: User[];
  viewMode: "grid" | "table";
}

export function AiToolUsersList({ users, viewMode }: AiToolUsersListProps) {
  const sortedUsers = users.sort(
    (a, b) => getLevelOrder(b.level) - getLevelOrder(a.level)
  );

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {sortedUsers.map((user, index) => (
          <div
            key={`${user.id}-${index}`}
            className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-white from-blue-50 to-white rounded-lg px-3 sm:px-4 py-3 transition-all duration-200 shadow-md border border-blue-200 group"
          >
            <EmployeeAvatar
              src={user.profileImage ?? ""}
              alt={`${user.name} profile`}
              className="w-8 h-8 sm:w-10 sm:h-10 ring-2 ring-white shadow-sm flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              {user.id ? (
                <Link
                  href={`/employee/${user.id}`}
                  className="block text-sm sm:text-base text-gray-900 hover:text-blue-600 font-semibold group-hover:underline transition-colors truncate"
                >
                  {user.name}
                </Link>
              ) : (
                <span className="block text-sm sm:text-base text-gray-900 font-semibold truncate">
                  {user.name}
                </span>
              )}
              <div className="text-xs text-gray-500 truncate">
                {user.role || "—"}
              </div>
            </div>
            <SkillLevelBadge level={getLevelNumber(user.level)}>
              {user.level}
            </SkillLevelBadge>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-600">
              <TableHead className="font-semibold text-xs sm:text-sm text-white">
                Employee
              </TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm hidden sm:table-cell text-white">
                Department
              </TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm hidden md:table-cell text-white">
                Role
              </TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm text-white">
                Proficiency
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user, index) => (
              <TableRow
                key={`${user.id}-${index}`}
                className="hover:bg-gray-200 transition-colors border-gray-200"
              >
                <TableCell className="py-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <EmployeeAvatar
                      src={user.profileImage ?? ""}
                      alt={`${user.name} profile`}
                      className="w-6 h-6 sm:w-8 sm:h-8 ring-1 ring-gray-200 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      {user.id ? (
                        <Link
                          href={`/employee/${user.id}`}
                          className="text-xs sm:text-sm text-gray-900 hover:text-blue-600 font-medium hover:underline transition-colors block truncate"
                        >
                          {user.name}
                        </Link>
                      ) : (
                        <span className="text-xs sm:text-sm text-gray-900 font-medium block truncate">
                          {user.name}
                        </span>
                      )}
                      <div className="text-xs text-gray-500 sm:hidden truncate">
                        {user.role || "—"} •{" "}
                        {user.department && formatDepartment(user.department)}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
                  {user.department && formatDepartment(user.department)}
                </TableCell>
                <TableCell className="text-xs sm:text-sm text-gray-600 hidden md:table-cell">
                  {user.role || "—"}
                </TableCell>
                <TableCell className="py-3 w-30">
                  <SkillLevelBadge level={getLevelNumber(user.level)}>
                    {user.level}
                  </SkillLevelBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
