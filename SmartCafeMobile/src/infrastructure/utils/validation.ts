/**
 * Validation Utilities
 *
 * Input validation functions following business rules
 */

import {VALIDATION_RULES} from '../config/constants';

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  return VALIDATION_RULES.EMAIL_REGEX.test(email.trim());
};

/**
 * Validate password strength
 * Rules: min 8 chars, 1 uppercase, 1 number, 1 special char
 */
export const isValidPassword = (password: string): boolean => {
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return false;
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return hasUppercase && hasNumber && hasSpecialChar;
};

/**
 * Get password validation errors
 */
export const getPasswordErrors = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    errors.push(`Au moins ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caractères`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Au moins 1 majuscule');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Au moins 1 chiffre');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Au moins 1 caractère spécial');
  }

  return errors;
};

/**
 * Validate phone number (international format)
 */
export const isValidPhone = (phone: string): boolean => {
  return VALIDATION_RULES.PHONE_REGEX.test(phone);
};

/**
 * Validate quantity (positive integer)
 */
export const isValidQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity > 0;
};

/**
 * Validate price (positive number)
 */
export const isValidPrice = (price: number): boolean => {
  return typeof price === 'number' && price >= 0;
};

/**
 * Sanitize string (remove dangerous characters)
 */
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Validate required field
 */
export const isRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};
