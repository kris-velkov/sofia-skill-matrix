import { ROLES } from "@/constants/employeeDefaultsSkills";
import { DepartmentLabels, Department } from "@/types/employees";

export const getDepartmentLabel = (value: string): string => {
  return DepartmentLabels[value as Department] || value;
};

export const getDepartmentOptions = () => {
  return ROLES.map((role) => ({
    value: role.departament,
    label: role.name,
  }));
};

export const formatDepartmentsForDisplay = (departments: string[] | null) => {
  if (!departments || departments.length === 0) {
    return { visible: [], overflow: 0, isEmpty: true };
  }

  const visible = departments.slice(0, 3).map((dept) => ({
    value: dept,
    label: getDepartmentLabel(dept),
  }));

  const overflow = Math.max(0, departments.length - 3);

  return { visible, overflow, isEmpty: false };
};

export const validateDepartmentSelection = (departments: string[]): boolean => {
  return departments.length > 0;
};
