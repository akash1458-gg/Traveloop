/* Robust Input Validation for Traveloop */

export const validators = {
  required: (value, fieldName = 'Field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value) => {
    if (!value) return 'Email is required';
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(value)) return 'Please enter a valid email address';
    return null;
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain a number';
    return null;
  },

  minLength: (value, min, fieldName = 'Field') => {
    if (!value || value.length < min) return `${fieldName} must be at least ${min} characters`;
    return null;
  },

  maxLength: (value, max, fieldName = 'Field') => {
    if (value && value.length > max) return `${fieldName} must be at most ${max} characters`;
    return null;
  },

  dateRange: (start, end) => {
    if (!start) return 'Start date is required';
    if (!end) return 'End date is required';
    if (new Date(end) < new Date(start)) return 'End date must be after start date';
    return null;
  },

  futureDate: (value, fieldName = 'Date') => {
    if (!value) return `${fieldName} is required`;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(value) < today) return `${fieldName} must be in the future`;
    return null;
  },

  positiveNumber: (value, fieldName = 'Value') => {
    if (value === '' || value === null || value === undefined) return `${fieldName} is required`;
    if (isNaN(value) || Number(value) < 0) return `${fieldName} must be a positive number`;
    return null;
  },
};

export const validateForm = (fields) => {
  const errors = {};
  let isValid = true;

  for (const [key, validations] of Object.entries(fields)) {
    for (const validation of validations) {
      const error = validation();
      if (error) {
        errors[key] = error;
        isValid = false;
        break;
      }
    }
  }

  return { errors, isValid };
};
