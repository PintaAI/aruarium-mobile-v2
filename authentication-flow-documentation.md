# Mobile App Authentication Flow Documentation

This document outlines the authentication implementation for the mobile app.

## Overview

The mobile app uses a JWT-based authentication system that integrates with the backend Auth.js (NextAuth.js) implementation. The flow allows users to:

1. Log in with email and password credentials
2. Make authenticated API requests
3. Log out securely

## API Testing Results

Testing the NextAuth.js API endpoints revealed:

1. **CSRF Token Endpoint** (`/api/auth/csrf`): 
   - Returns a valid CSRF token that can be used for authentication requests
   - Response: `{ csrfToken: "[token]" }`

2. **Session Endpoint** (`/api/auth/session`):
   - Returns information about the current session (null if not authenticated)
   - This endpoint can be used to verify authentication status

3. **Sign-in Endpoint** (`/api/auth/signin`):
   - Returns HTML content rather than JSON
   - This indicates the authentication is designed for web form-based flows rather than direct API access

Based on these findings, the authentication implementation uses a multi-layered approach with fallback mechanisms to ensure reliable authentication even with a web-focused backend.

## Architecture

The authentication system consists of several key components:

### 1. Authentication Utilities (`lib/auth.ts`)

Core authentication functions that handle:
- Login with credentials
- Secure token storage
- Token retrieval
- Logout
- Authenticated API requests

### 2. Login Screen (`app/auth/login.tsx`)

UI component that:
- Accepts user credentials
- Validates inputs
- Submits to the authentication API
- Handles success/error responses

### 3. Authentication Flow Integration

Changes to the app structure to support authentication:
- Modified root layout to include auth routes
- Updated app index to check authentication status
- Added logout functionality to profile screen

## Implementation Details

### Authentication Utilities

The `lib/auth.ts` file provides these key functions:

```typescript
// Login with credentials
async function login(credentials: LoginCredentials): Promise<AuthResponse>

// Store authentication token securely
async function storeToken(token: string): Promise<void>

// Get the stored authentication token
async function getToken(): Promise<string | null>

// Check if user is logged in
async function isLoggedIn(): Promise<boolean>

// Remove stored authentication token
async function logout(): Promise<void>

// Get authorization header with bearer token
async function getAuthHeader(): Promise<Record<string, string>>

// Make an authenticated API request
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response>
```

### Authentication Flow

1. **Login Process**:
   - User enters email/password on the login screen
   - Credentials are validated client-side
   - If valid, they are sent to the `/api/auth/callback/credentials` endpoint
   - On successful authentication, the JWT token is stored securely using `expo-secure-store`
   - User is redirected to the home screen

2. **Authentication Check**:
   - When the app starts, it checks if a valid token exists in secure storage
   - If a token exists, the user is directed to the home screen
   - If no token exists, the user is directed to the login screen

3. **Authenticated Requests**:
   - The `fetchWithAuth` function automatically adds the JWT token to the Authorization header
   - Usage: `fetchWithAuth('https://api.example.com/data')` instead of regular `fetch`

4. **Logout Process**:
   - User presses the logout button on the profile screen
   - Token is removed from secure storage
   - User is redirected to the login screen

## Secure Token Storage

The app uses `expo-secure-store` to securely store authentication tokens. This provides:
- Encrypted storage for sensitive data
- Protection against unauthorized access
- Platform-specific security mechanisms

## Using Authentication in API Requests

To make authenticated API requests:

```typescript
import { fetchWithAuth } from '~/lib/auth';

// Example of an authenticated API request
async function fetchUserData() {
  try {
    const response = await fetchWithAuth('https://pejuangkorea.vercel.app/api/user/profile');
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}
```

## JWT Token Decoding and User Information

The authentication system includes utilities to decode JWT tokens and extract user information:

```typescript
import { getCurrentUser } from '~/lib/auth';

// Get current user information from JWT token
async function displayUserProfile() {
  const userInfo = await getCurrentUser();
  
  if (userInfo) {
    console.log('User name:', userInfo.name);
    console.log('User email:', userInfo.email);
    console.log('User role:', userInfo.role);
  }
}
```

### User Profile Integration

The profile screen (`app/home/profil.tsx`) uses the JWT token data to display user information:

1. On component mount, it fetches user information from the stored JWT token
2. Displays user's name, email, and role if available
3. Falls back to sensible defaults if certain information is missing
4. Shows a loading indicator while fetching the data

This approach ensures that the UI reflects the actual authenticated user's information, enhancing the personalized experience.

## Future Improvements

The following improvements could be made to the authentication system:

1. **Token Expiration Handling**:
   - Implement JWT token expiration detection
   - Add refresh token functionality
   - Implement automatic re-login when possible

2. **Social Login Integration**:
   - Add support for Google/Apple login via deep linking
   - Integrate with social auth providers from Auth.js

3. **Enhanced Security**:
   - Implement biometric authentication for token access
   - Add two-factor authentication support
   - Include device fingerprinting for additional security

## Files Created/Modified

1. **New Files**:
   - `mobile/lib/auth.ts`: Core authentication utilities
   - `mobile/components/ui/input.tsx`: Input component for login form
   - `mobile/app/auth/_layout.tsx`: Layout for auth screens
   - `mobile/app/auth/login.tsx`: Login screen implementation

2. **Modified Files**:
   - `mobile/app/_layout.tsx`: Added auth routes
   - `mobile/app/index.tsx`: Added authentication check
   - `mobile/app/home/profil.tsx`: Added logout functionality

## Dependencies

- `expo-secure-store`: For secure token storage
- `expo-router`: For navigation and redirection

## Conclusion

This authentication implementation provides a secure and user-friendly login flow that integrates with the existing Auth.js backend. It follows security best practices by securely storing tokens and properly handling the authentication lifecycle.
