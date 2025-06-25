export type SkillLevel = 0 | 1 | 2 | 3 | 4;

export interface Skill {
  name: string;
  level: SkillLevel;
  url?: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
  averageLevel: number;
}

export interface Employee {
  id: string;
  name: string;
  careerExperience: string;
  department: string;
  skills: SkillCategory[];
  badge?: string;
  // New fields for user profile
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  country?: string;
  cityState?: string;
  postalCode?: string;
  taxId?: string;
  slackProfileImage?: string; // URL for Slack profile image
  slackUrl?: string;
  linkedinUrl?: string; // Add this line
}

export interface CompetencyLevel {
  grade: SkillLevel;
  name: string;
  description: string;
  color: string; // Tailwind class
}

export interface FilterState {
  selectedEmployees: string[];
  selectedDepartment: string | null;
  selectedSkillCategory: string | null;
  selectedSkills: string[];
  minimumSkillLevel: SkillLevel | null;
}
