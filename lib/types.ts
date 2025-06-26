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
  name: string;
  issuer?: string;
  date?: string;
  url?: string;
}

export interface Employee {
  id: string;
  name: string;
  careerExperience: string;
  department: string;
  skills: SkillCategory[];
  badge?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  country?: string;
  cityState?: string;
  postalCode?: string;
  taxId?: string;
  slackProfileImage?: string;
  slackUrl?: string;
  linkedinUrl?: string;
  certificates?: Certificate[];
}

export interface FilterState {
  selectedEmployees: string[];
  selectedDepartment: string | null;
  selectedSkillCategory: string | null;
  selectedSkills: string[];
  minimumSkillLevel: SkillLevel | null;
}
