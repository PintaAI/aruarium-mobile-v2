# Environment Configuration

This document explains how the mobile app determines its environment and configures API URLs accordingly.

## Environment Detection

The app automatically detects the current environment using the following hierarchy:

1. **Development Mode** (`__DEV__` flag)
   - When running with Metro bundler (development server)
   - Always returns `development` environment

2. **EAS Build Profile Environment Variable**
   - Checks `process.env.EAS_BUILD_PROFILE`
   - Set automatically during EAS builds based on build profile

3. **EAS Build Profile from Constants**
   - Falls back to `Constants.expoConfig?.extra?.eas?.buildProfile`

4. **Legacy Release Channel**
   - Checks for legacy release channel configuration

5. **App Variant**
   - Checks EAS app variant settings

6. **Development Client Fallback**
   - Defaults based on whether it's a development client build

## Environment Types

### Development
- **When**: Running with `expo start` or Metro bundler
- **API URL**: `http://192.168.15.34:3000` (local development server)
- **Usage**: Local development and testing

### Preview
- **When**: Built with EAS preview profile (`eas build --profile preview`)
- **API URL**: `https://pejuangkorea.vercel.app` (production server)
- **Usage**: Internal testing and staging

### Production
- **When**: Built with EAS production profile (`eas build --profile production`)
- **API URL**: `https://pejuangkorea.vercel.app` (production server)
- **Usage**: App store releases

## Build Commands

### Development
```bash
# Start development server
npm run dev

# Build development client
npx eas build --profile development
```

### Preview
```bash
# Build preview APK (Android)
npm run build:android

# Build preview IPA (iOS)
npm run build:ios
```

### Production
```bash
# Build production app bundle (Android)
npm run build:android:production

# Build production app (iOS)
npm run build:ios:production
```

## Configuration Files

### `mobile/lib/config.ts`
- Main configuration file
- Exports environment detection and API URLs
- Provides debug logging in development

### `mobile/eas.json`
- EAS build configuration
- Sets environment variables for each build profile
- Configures build types (APK vs App Bundle)

## Usage in Code

```typescript
import { API_BASE_URL, config } from './lib/config';

// Use the configured API base URL
const response = await fetch(`${API_BASE_URL}/api/endpoint`);

// Check current environment
if (config.isDevelopment) {
  console.log('Running in development mode');
}

// Access environment details
console.log('Current environment:', config.environment);
console.log('API Base URL:', config.apiBaseUrl);
```

## Environment Variables

The following environment variables are automatically set during EAS builds:

- `EAS_BUILD_PROFILE`: Set to the build profile name (`development`, `preview`, `production`)

## Debugging

In development mode, the configuration will log debug information to the console:

```
🔧 App Configuration: {
  environment: 'development',
  apiBaseUrl: 'http://192.168.15.34:3000',
  isDevelopment: true,
  isProduction: false,
  constants: { ... }
}
```

## Troubleshooting

### Wrong Environment Detected
1. Check if you're running the correct build profile
2. Verify EAS configuration in `eas.json`
3. Check console logs for environment detection details

### API Connection Issues
1. Ensure development server is running on the correct IP/port
2. Check network connectivity
3. Verify API endpoints are accessible from your device/emulator

### Build Profile Issues
1. Ensure you're using the correct EAS build command
2. Check that environment variables are properly set in `eas.json`
3. Verify the build profile exists in the configuration
