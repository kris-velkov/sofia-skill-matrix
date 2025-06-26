import { CompetencyLevel } from "@/lib/types";

export const COMPETENCY_LEVELS: CompetencyLevel[] = [
  {
    grade: 0,
    name: "No competency",
    description: "I know nothing about this or the skill is not applicable.",
    color: "bg-red-500",
  },
  {
    grade: 1,
    name: "Some knowledge",
    description:
      "I know something, and after further reading I am able to perform simple tasks.",
    color: "bg-orange-500",
  },
  {
    grade: 2,
    name: "Working knowledge",
    description:
      "I can perform simple tasks. After further reading I can challenge average tasks.",
    color: "bg-yellow-200",
  },
  {
    grade: 3,
    name: "Good competency",
    description:
      "I can perform average tasks and with further research I can challenge complex tasks.",
    color: "bg-green-500",
  },
  {
    grade: 4,
    name: "Expert",
    description:
      "I can perform complex tasks and with further research I can challenge very complex tasks.",
    color: "bg-blue-500",
  },
];
