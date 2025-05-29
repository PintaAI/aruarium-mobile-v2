import Constants from 'expo-constants';

// Environment types
export type Environment = 'development' | 'preview' | 'production';

// Configuration interface
export interface AppConfig {
  environment: Environment;
  apiBaseUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * Determine the current environment based on various indicators
 */
function getEnvironment(): Environment {
  // Check EAS build profile environment variable first (highest priority)
  const easBuildProfile = process.env.EAS_BUILD_PROFILE;
  if (easBuildProfile && ['development', 'preview', 'production'].includes(easBuildProfile)) {
    return easBuildProfile as Environment;
  }

  // Check EAS build profile from Constants
  const buildProfile = Constants.expoConfig?.extra?.eas?.buildProfile;
  if (buildProfile) {
    return buildProfile as Environment;
  }

  // Check release channel (legacy) - using any to handle dynamic properties
  const releaseChannel = (Constants.expoConfig as any)?.releaseChannel;
  if (releaseChannel) {
    if (releaseChannel === 'production') return 'production';
    if (releaseChannel === 'preview') return 'preview';
  }

  // Check app variant (for EAS builds)
  const appVariant = Constants.expoConfig?.extra?.eas?.appVariant;
  if (appVariant === 'production') return 'production';
  if (appVariant === 'preview') return 'preview';

  // Check if we're in development mode (Metro bundler is running)
  // This is now lower priority to avoid overriding EAS build profiles
  if (__DEV__ && !process.env.EAS_BUILD_PROFILE) {
    // In development, but check if we're in a standalone build context
    // If Constants.executionEnvironment is 'standalone', treat as production even if __DEV__ is true
    if (Constants.executionEnvironment === 'standalone') {
      return 'production';
    }
    return 'development';
  }

  // Default fallback based on whether it's a development build
  return Constants.expoConfig?.developmentClient ? 'development' : 'production';
}

/**
 * Get API base URL based on environment
 */
function getApiBaseUrl(environment: Environment): string {
  switch (environment) {
    case 'development':
      // Local development server
      return 'http://192.168.15.34:3000';
    
    case 'preview':
    case 'production':
      // Both preview and production use the same production server
      return 'https://pejuangkorea.vercel.app';
    
    default:
      // Fallback to development
      return 'http://192.168.15.34:3000';
  }
}

// Create and export configuration
const environment = getEnvironment();
const apiBaseUrl = getApiBaseUrl(environment);

export const config: AppConfig = {
  environment,
  apiBaseUrl,
  isDevelopment: environment === 'development',
  isProduction: environment === 'production',
};

// Export individual values for convenience
export const { environment: ENV, apiBaseUrl: API_BASE_URL } = config;

// Debug information (always log in dev, and also log in preview/prod for troubleshooting)
if (__DEV__ || process.env.EAS_BUILD_PROFILE) {
  console.log('🔧 App Configuration:', {
    environment,
    apiBaseUrl,
    isDevelopment: config.isDevelopment,
    isProduction: config.isProduction,
    detectionSources: {
      easBuildProfileEnv: process.env.EAS_BUILD_PROFILE,
      easBuildProfileConstants: Constants.expoConfig?.extra?.eas?.buildProfile,
      releaseChannel: (Constants.expoConfig as any)?.releaseChannel,
      appVariant: Constants.expoConfig?.extra?.eas?.appVariant,
      devFlag: __DEV__,
      executionEnvironment: Constants.executionEnvironment,
      developmentClient: Constants.expoConfig?.developmentClient,
    },
  });
}
