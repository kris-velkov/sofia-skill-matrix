export interface SupabaseCertificate {
  id: string;
  name: string;
  issuer: string | null;
  date: string | null;
  url: string | null;
}

export interface SupabaseSkillLevel {
  level: number;
  skills: {
    name: string;
    categories: {
      name: string;
    };
  };
}

export interface SupabaseEmployee {
  id: string;
  first_name: string;
  last_name: string;
  bio: string | null;
  country: string | null;
  city: string | null;
  program: string | null;
  profile_image: string | null;
  slack_url: string | null;
  linkedin_url: string | null;
  career_experience: string | null;
  start_date: string | null;
  department: string | null;
  role: string | null;
  float_id: string | null;
  certificates: SupabaseCertificate[];
  employee_skill_levels: SupabaseSkillLevel[];
}

// Base skill types
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

// Normalized skill types (for processing Supabase data)
export interface NormalizedSkill {
  name: string;
  level: number;
}

export interface NormalizedSkillCategory {
  name: string;
  skills: NormalizedSkill[];
  averageLevel: number;
}

export interface Certificate {
  id?: string;
  employeeId: string;
  name: string;
  issuer?: string;
  date?: string | null;
  url?: string;
}

export interface EmployeeCertificateData {
  id: string;
  name: string | null;
  issuer: string | null;
  date: string | null;
  url: string | null;
  employee: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
    department: string | null;
    role: string | null;
  } | null;
}

export interface Employee {
  id: string;
  floatId?: string;
  firstName: string;
  lastName: string;
  program?: string | null;
  department: string | null;
  role?: string | null;
  careerExperience?: Date | null | string;
  startDate?: Date | null | string;
  country?: string | null;
  city?: string | null;
  bio?: string | null;
  profileImage?: string | null;
  slackUrl?: string;
  linkedinUrl?: string;
  certificates?: Certificate[] | null;
  skills: SkillCategory[] | null;
}

export type EmployeeCertificate = {
  id: string;
  name: string;
  issuer: string;
  date: string | null;
  url: string | null;
  employee: {
    id: string;
    name: string;
    profileImage: string | null;
    department: string | null;
    role: string | null;
  };
};

export interface FilterState {
  selectedEmployees: string[];
  selectedDepartment: string | null;
  selectedSkillCategory: string | null;
  selectedSkills: string[];
  minimumSkillLevel: SkillLevel | null;
}
