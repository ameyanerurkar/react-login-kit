// @ts-ignore
import React, { createContext, useContext, ReactNode } from 'react';
import { LoginConfig } from '../../types';

// Default configuration values
const defaultConfig: LoginConfig = {
  branding: {
    primaryColor: '#0066cc',
    fontFamily: 'sans-serif',
  },
  authMethods: {
    authMethods: ['username_password'],
  },
  uiBehavior: {
    enableRememberMe: true,
    defaultAuthMethod: 'username_password',
    showForgotPassword: true,
    showSignUpLink: false,
  },
  localization: {
    language: 'en-US',
    strings: {
      loginTitle: 'Sign in to your account',
      usernamePlaceholder: 'Email address',
      passwordPlaceholder: 'Password',
      submitButton: 'Sign In',
    },
  },
  errorHandling: {
    onSuccessRedirect: '/dashboard',
    onFailureMessage: 'Invalid credentials. Please try again.',
    onSessionTimeoutRedirect: '/login',
  },
};

// Create the context
const ConfigContext = createContext<LoginConfig>(defaultConfig);

// Provider component
interface ConfigProviderProps {
  config: LoginConfig;
  children: ReactNode;
}

export const ConfigProvider = ({ 
  config, 
  children 
}: ConfigProviderProps) => {
  // Merge user config with default config
  const mergedConfig: LoginConfig = {
    branding: {
      ...defaultConfig.branding,
      ...config.branding,
    },
    authMethods: {
      ...defaultConfig.authMethods,
      ...config.authMethods,
    },
    uiBehavior: {
      ...defaultConfig.uiBehavior,
      ...config.uiBehavior,
    },
    localization: {
      ...defaultConfig.localization,
      ...config.localization,
      strings: {
        ...defaultConfig.localization?.strings,
        ...config.localization?.strings,
      },
    },
    errorHandling: {
      ...defaultConfig.errorHandling,
      ...config.errorHandling,
    },
  };

  return (
    <ConfigContext.Provider value={mergedConfig}>
      {children}
    </ConfigContext.Provider>
  );
};

// Hook for consuming the context
export const useLoginConfig = () => {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error('useLoginConfig must be used within a ConfigProvider');
  }
  return config;
};

export default ConfigProvider; 