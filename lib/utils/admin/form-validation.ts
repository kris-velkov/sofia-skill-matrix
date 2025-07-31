export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateRequired = (
  value: string,
  fieldName: string
): ValidationResult => {
  const trimmed = value.trim();
  return {
    isValid: trimmed.length > 0,
    errors: trimmed.length === 0 ? [`${fieldName} is required`] : [],
  };
};

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  return {
    isValid,
    errors: isValid ? [] : ["Please enter a valid email address"],
  };
};

export const validateOrderNumber = (orderNumber: number): ValidationResult => {
  const isValid = orderNumber >= 0;

  return {
    isValid,
    errors: isValid ? [] : ["Order number must be 0 or greater"],
  };
};

export const validateCategoryForm = (data: {
  name: string;
  departments: string[];
  orderIndex: number;
}): ValidationResult => {
  const errors: string[] = [];

  const nameValidation = validateRequired(data.name, "Category name");
  if (!nameValidation.isValid) {
    errors.push(...nameValidation.errors);
  }

  const orderValidation = validateOrderNumber(data.orderIndex);
  if (!orderValidation.isValid) {
    errors.push(...orderValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateAiToolForm = (data: {
  name: string;
  orderNumber: number;
}): ValidationResult => {
  const errors: string[] = [];

  const nameValidation = validateRequired(data.name, "Tool name");
  if (!nameValidation.isValid) {
    errors.push(...nameValidation.errors);
  }

  const orderValidation = validateOrderNumber(data.orderNumber);
  if (!orderValidation.isValid) {
    errors.push(...orderValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
