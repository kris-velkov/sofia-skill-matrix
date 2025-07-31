"use client";

import { StatsCards } from "@/components/ui/stats-cards";
import { getRoleStats } from "@/constants/role-configs";

interface User {
  role: string;
}

interface UserStatsProps {
  users: User[];
}

export function UserStats({ users }: UserStatsProps) {
  const stats = getRoleStats(users);
  return <StatsCards stats={stats} />;
}
