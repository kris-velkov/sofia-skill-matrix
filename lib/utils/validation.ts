// Validation utilities for forms
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateProgram(data: {
  label: string;
  value: string;
}): ValidationResult {
  const errors: string[] = [];

  if (!data.label || data.label.trim().length === 0) {
    errors.push("Label is required");
  } else if (data.label.length > 100) {
    errors.push("Label too long (max 100 characters)");
  }

  if (!data.value || data.value.trim().length === 0) {
    errors.push("Value is required");
  } else if (data.value.length > 50) {
    errors.push("Value too long (max 50 characters)");
  } else if (!/^[a-z0-9-_]+$/.test(data.value)) {
    errors.push(
      "Value must contain only lowercase letters, numbers, hyphens, and underscores"
    );
  }

  return { isValid: errors.length === 0, errors };
}

export function validateRole(data: {
  name: string;
  departament: string;
  roleId: string;
}): ValidationResult {
  const errors: string[] = [];
  const validDepartments = ["fe", "be", "qa", "pm", "co"];

  if (!data.name || data.name.trim().length === 0) {
    errors.push("Name is required");
  } else if (data.name.length > 100) {
    errors.push("Name too long (max 100 characters)");
  }

  if (!data.departament || !validDepartments.includes(data.departament)) {
    errors.push("Invalid department");
  }

  if (!data.roleId || data.roleId.trim().length === 0) {
    errors.push("Role ID is required");
  } else if (data.roleId.length > 50) {
    errors.push("Role ID too long (max 50 characters)");
  } else if (!/^[a-z0-9-_]+$/.test(data.roleId)) {
    errors.push(
      "Role ID must contain only lowercase letters, numbers, hyphens, and underscores"
    );
  }

  return { isValid: errors.length === 0, errors };
}

export function isValidUrl(url: string): boolean {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Employee data validation
export function validateEmployeeUpdate(
  data: Record<string, unknown>
): ValidationResult {
  const errors: string[] = [];

  if (
    data.firstName &&
    typeof data.firstName === "string" &&
    data.firstName.length > 100
  ) {
    errors.push("First name too long (max 100 characters)");
  }

  if (
    data.lastName &&
    typeof data.lastName === "string" &&
    data.lastName.length > 100
  ) {
    errors.push("Last name too long (max 100 characters)");
  }

  if (data.bio && typeof data.bio === "string" && data.bio.length > 1000) {
    errors.push("Bio too long (max 1000 characters)");
  }

  if (
    data.profileImage &&
    typeof data.profileImage === "string" &&
    !isValidUrl(data.profileImage)
  ) {
    errors.push("Invalid profile image URL");
  }

  if (
    data.slackUrl &&
    typeof data.slackUrl === "string" &&
    !isValidUrl(data.slackUrl)
  ) {
    errors.push("Invalid Slack URL");
  }

  if (
    data.linkedinUrl &&
    typeof data.linkedinUrl === "string" &&
    !isValidUrl(data.linkedinUrl)
  ) {
    errors.push("Invalid LinkedIn URL");
  }

  return { isValid: errors.length === 0, errors };
}
