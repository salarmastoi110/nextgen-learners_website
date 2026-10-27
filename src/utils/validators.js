export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || '').trim());

export const isValidPhone = (phone) =>
  /^\+?[\d\s()-]{7,15}$/.test(String(phone || '').trim());

export const isMinLength = (value, min) =>
  String(value || '').trim().length >= min;

export const isMaxLength = (value, max) =>
  String(value || '').trim().length <= max;

export const isNotEmpty = (value) =>
  value !== null && value !== undefined && String(value).trim() !== '';

export const hasUppercase = (value) => /[A-Z]/.test(String(value || ''));
export const hasLowercase = (value) => /[a-z]/.test(String(value || ''));
export const hasNumber = (value) => /\d/.test(String(value || ''));

export const isStrongPassword = (value) =>
  isMinLength(value, 8) && hasUppercase(value) && hasLowercase(value) && hasNumber(value);

/**
 * Validate a form values object against a rules map.
 * rules: { field: [{ test: fn, message: string }] }
 * Returns an object of { field: firstErrorMessage }.
 */
export const validateForm = (values, rules) => {
  const errors = {};
  for (const [field, fieldRules] of Object.entries(rules)) {
    for (const rule of fieldRules) {
      if (!rule.test(values[field], values)) {
        errors[field] = rule.message;
        break;
      }
    }
  }
  return errors;
};
