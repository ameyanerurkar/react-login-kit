import { LoginConfig } from '../types';

/**
 * Loads configuration from a remote URL
 * @param url The URL to load the configuration from
 * @returns A promise that resolves to the configuration
 */
export const loadConfigFromUrl = async (url: string): Promise<LoginConfig> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading configuration:', error);
    throw error;
  }
};

/**
 * Loads configuration from local storage
 * @param key The key to load the configuration from
 * @returns The configuration or null if not found
 */
export const loadConfigFromLocalStorage = (key: string = 'react_login_kit_config'): LoginConfig | null => {
  try {
    const storedConfig = localStorage.getItem(key);
    if (storedConfig) {
      return JSON.parse(storedConfig);
    }
    return null;
  } catch (error) {
    console.error('Error loading configuration from localStorage:', error);
    return null;
  }
};

/**
 * Saves configuration to local storage
 * @param config The configuration to save
 * @param key The key to save the configuration under
 */
export const saveConfigToLocalStorage = (config: LoginConfig, key: string = 'react_login_kit_config'): void => {
  try {
    localStorage.setItem(key, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving configuration to localStorage:', error);
  }
};

/**
 * Validates a configuration object against the required schema
 * @param config The configuration to validate
 * @returns True if the configuration is valid, false otherwise
 */
export const validateConfig = (config: LoginConfig): boolean => {
  if (!config) return false;
  
  // Basic validation - check for required sections
  if (!config.authMethods || !Array.isArray(config.authMethods.authMethods) || config.authMethods.authMethods.length === 0) {
    console.error('Invalid config: authMethods.authMethods must be a non-empty array');
    return false;
  }
  
  return true;
};

/**
 * Merges a partial configuration with default values
 * @param config The partial configuration
 * @param defaults The default configuration
 * @returns The merged configuration
 */
export const mergeWithDefaults = (config: Partial<LoginConfig>, defaults: LoginConfig): LoginConfig => {
  return {
    branding: {
      ...defaults.branding,
      ...config.branding,
    },
    authMethods: {
      ...defaults.authMethods,
      ...config.authMethods,
    },
    uiBehavior: {
      ...defaults.uiBehavior,
      ...config.uiBehavior,
    },
    localization: {
      ...defaults.localization,
      ...config.localization,
      strings: {
        ...defaults.localization?.strings,
        ...config.localization?.strings,
      },
    },
    errorHandling: {
      ...defaults.errorHandling,
      ...config.errorHandling,
    },
  };
}; 