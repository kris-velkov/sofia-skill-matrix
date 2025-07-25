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
    id: string;
    name: string;
    order_index: number;
    categories: {
      id: string;
      default: boolean;
      order_index: number;
      name: string;
    };
  };
}

export interface SkillCategoryGroup {
  id: string;
  name: string;
  default: boolean;
  skills: Skill[];
  total: number;
  count: number;
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
  department: Department | null;
  role: string | null;
  float_id: string | null;
  certificates: SupabaseCertificate[];
  employees_skill_levels: SupabaseSkillLevel[];
}

export type Department = "fe" | "be" | "qa" | "pm" | "co";
export type DepartmentFullName =
  | "Front-end"
  | "Back-end"
  | "QA"
  | "Project Manager"
  | "CloudOps";

export interface EmployeeRole {
  id: string;
  name: DepartmentFullName;
  departament: Department;
}

export const DepartmentLabels: Record<Department, string> = {
  fe: "Front-end",
  be: "Back-end",
  qa: "QA",
  pm: "Project Manager",
  co: "CloudOps",
};

export type SkillLevel = 0 | 1 | 2 | 3 | 4;

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
}

export interface SkillCategory {
  id: string;
  name: string;
  default: boolean;
  skills: Skill[];
  averageLevel: number;
}

export interface Certificate {
  id?: string;
  employeeId?: string;
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
    department: Department;
    role: string | null;
  } | null;
}

export interface Employee {
  id: string;
  floatId?: string;
  firstName?: string;
  lastName?: string;
  program?: string | null;
  department?: Department | null;
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

export type EmployeeReturnType = Omit<Employee, "skills" | "certificates">;

export type EmployeeCertificate = {
  id: string;
  name: string;
  issuer: string;
  date: string | null;
  url: string | null;
  employee: {
    id: string;
    firstName?: string;
    lastName?: string;
    profileImage: string | null;
    department: Department;
    role: string | null;
  };
};
