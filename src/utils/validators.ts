import * as Yup from 'yup';
import { LoginConfig } from '../types';

/**
 * Creates a validation schema for username/password login
 * @param config The login configuration
 * @returns Yup validation schema
 */
export const createLoginValidationSchema = (config: LoginConfig) => {
  const { strings = {} } = config.localization || {};
  
  return Yup.object({
    username: Yup.string()
      .email(strings.invalidEmail || 'Invalid email address')
      .required(strings.requiredField || 'Required'),
    password: Yup.string()
      .required(strings.requiredField || 'Required'),
    rememberMe: Yup.boolean(),
  });
};

/**
 * Creates a validation schema for email OTP delivery
 * @param config The login configuration
 * @returns Yup validation schema
 */
export const createEmailOtpValidationSchema = (config: LoginConfig) => {
  const { strings = {} } = config.localization || {};
  
  return Yup.object({
    target: Yup.string()
      .email(strings.invalidEmail || 'Invalid email address')
      .required(strings.requiredField || 'Required'),
  });
};

/**
 * Creates a validation schema for SMS OTP delivery
 * @param config The login configuration
 * @returns Yup validation schema
 */
export const createPhoneOtpValidationSchema = (config: LoginConfig) => {
  const { strings = {} } = config.localization || {};
  
  return Yup.object({
    target: Yup.string()
      .matches(/^\+?[1-9]\d{1,14}$/, strings.invalidPhone || 'Invalid phone number')
      .required(strings.requiredField || 'Required'),
  });
};

/**
 * Creates a validation schema for OTP code verification
 * @param config The login configuration
 * @returns Yup validation schema
 */
export const createOtpCodeValidationSchema = (config: LoginConfig) => {
  const { strings = {} } = config.localization || {};
  
  return Yup.object({
    otp: Yup.string()
      .matches(/^\d{4,8}$/, strings.invalidOtp || 'Invalid code format')
      .required(strings.requiredField || 'Required'),
  });
};

/**
 * Validates an email address
 * @param email The email to validate
 * @returns True if the email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validates a phone number
 * @param phone The phone number to validate
 * @returns True if the phone number is valid, false otherwise
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // Basic international phone number validation (E.164 format)
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates an OTP code
 * @param otp The OTP code to validate
 * @returns True if the OTP code is valid, false otherwise
 */
export const isValidOtpCode = (otp: string): boolean => {
  // Assume OTP is 4-8 digits
  const otpRegex = /^\d{4,8}$/;
  return otpRegex.test(otp);
}; 