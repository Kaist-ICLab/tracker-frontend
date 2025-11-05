/**
 * Application Configuration
 * 
 * This file contains all configuration variables for the application.
 * Environment variables are read from Expo Constants extra config.
 * 
 * To set environment variables:
 * 1. Create a .env file in the root directory
 * 2. Add variables to app.json under "expo.extra" (for build-time)
 * 3. Or use expo-constants with extra config
 * 
 * For local development, use EXPO_PUBLIC_ prefix for client-side variables.
 */

import Constants from 'expo-constants';

// Helper function to get environment variable with fallback
const getEnvVar = (key: string, defaultValue?: string): string => {
  // Expo Constants extra config (set via app.json or environment variables)
  const value = Constants.expoConfig?.extra?.[key] as string | undefined;
  return value || defaultValue || '';
};

/**
 * Supabase Configuration
 */
export const supabaseConfig = {
  url: getEnvVar('EXPO_PUBLIC_SUPABASE_URL', ''),
  anonKey: getEnvVar('EXPO_PUBLIC_SUPABASE_ANON_KEY', ''),
  serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', ''), // Server-side only
};

/**
 * API Configuration
 */
export const apiConfig = {
  baseUrl: getEnvVar('EXPO_PUBLIC_API_BASE_URL', ''),
  timeout: parseInt(getEnvVar('EXPO_PUBLIC_API_TIMEOUT', '30000'), 10),
  retryAttempts: parseInt(getEnvVar('EXPO_PUBLIC_API_RETRY_ATTEMPTS', '3'), 10),
};

/**
 * App Configuration
 */
export const appConfig = {
  name: Constants.expoConfig?.name || 'Tracker System Mobile',
  version: Constants.expoConfig?.version || '1.0.0',
  environment: getEnvVar('EXPO_PUBLIC_ENV', __DEV__ ? 'development' : 'production'),
  isDevelopment: __DEV__,
  isProduction: !__DEV__,
};

/**
 * Feature Flags
 */
export const featureFlags = {
  enableDataSync: getEnvVar('EXPO_PUBLIC_ENABLE_DATA_SYNC', 'true') === 'true',
  enableAnalytics: getEnvVar('EXPO_PUBLIC_ENABLE_ANALYTICS', 'false') === 'true',
  enableDebugMode: getEnvVar('EXPO_PUBLIC_DEBUG_MODE', __DEV__ ? 'true' : 'false') === 'true',
};

/**
 * Data Sync Configuration
 */
export const dataSyncConfig = {
  autoUploadInterval: parseInt(getEnvVar('EXPO_PUBLIC_AUTO_UPLOAD_INTERVAL', '3600000'), 10), // 1 hour in ms
  batchSize: parseInt(getEnvVar('EXPO_PUBLIC_SYNC_BATCH_SIZE', '100'), 10),
  maxRetries: parseInt(getEnvVar('EXPO_PUBLIC_SYNC_MAX_RETRIES', '3'), 10),
};

/**
 * Validation
 */
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!supabaseConfig.url) {
    errors.push('EXPO_PUBLIC_SUPABASE_URL is required');
  }

  if (!supabaseConfig.anonKey) {
    errors.push('EXPO_PUBLIC_SUPABASE_ANON_KEY is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Export all config as a single object
 */
export const config = {
  supabase: supabaseConfig,
  api: apiConfig,
  app: appConfig,
  features: featureFlags,
  dataSync: dataSyncConfig,
  validate: validateConfig,
};

export default config;

