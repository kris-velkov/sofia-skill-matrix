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

export interface Certificate {
  id: string;
  name: string;
  issuer?: string;
  date?: string;
  url?: string;
}

export interface Employee {
  id: string;
  floatId: string;
  firstName: string;
  lastName: string;
  program?: string;
  department: string;
  role?: string;
  careerExperience?: string;
  startDate?: string;
  country?: string;
  city?: string;
  bio?: string;
  profileImage?: string;
  slackUrl?: string;
  linkedinUrl?: string;
  certificates?: Certificate[];
  skills: SkillCategory[];
}

export interface FilterState {
  selectedEmployees: string[];
  selectedDepartment: string | null;
  selectedSkillCategory: string | null;
  selectedSkills: string[];
  minimumSkillLevel: SkillLevel | null;
}
