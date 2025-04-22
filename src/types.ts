// Authentication method types
export type AuthMethod = 'username_password' | 'otp';
export type OtpDeliveryMethod = 'email' | 'sms';
export type Language = 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE' | string;

// Configuration interfaces
export interface BrandingConfig {
  logoUrl?: string;
  primaryColor?: string;
  fontFamily?: string;
}

export interface AuthMethodsConfig {
  authMethods: AuthMethod[];
  otpDelivery?: OtpDeliveryMethod[];
}

export interface UIBehaviorConfig {
  enableRememberMe?: boolean;
  defaultAuthMethod?: AuthMethod;
  showForgotPassword?: boolean;
  showSignUpLink?: boolean;
}

export interface LocalizationConfig {
  language?: Language;
  strings?: Record<string, string>;
}

export interface ErrorHandlingConfig {
  onSuccessRedirect?: string;
  onFailureMessage?: string;
  onSessionTimeoutRedirect?: string;
}

// Main configuration interface
export interface LoginConfig {
  branding?: BrandingConfig;
  authMethods?: AuthMethodsConfig;
  uiBehavior?: UIBehaviorConfig;
  localization?: LocalizationConfig;
  errorHandling?: ErrorHandlingConfig;
}

// Auth event types
export interface LoginCredentials {
  username?: string;
  password?: string;
  otp?: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  redirectUrl?: string;
}

// Component props types
export interface LoginPageProps {
  config: LoginConfig;
  onLogin?: (credentials: LoginCredentials) => Promise<LoginResponse>;
  onOtpRequest?: (delivery: OtpDeliveryMethod, target: string) => Promise<boolean>;
} 