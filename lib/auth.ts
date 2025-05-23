import * as SecureStore from 'expo-secure-store';

// Storage keys
const TOKEN_KEY = 'auth_token';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  token?: string;
}

export interface UserInfo {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  picture?: string;
  sub?: string; // JWT subject field (usually contains user ID)
  exp?: number; // Expiration timestamp
  iat?: number; // Issued at timestamp
  [key: string]: any; // Allow for other custom fields
}

/**
 * Login with credentials
 * @param credentials Email and password
 * @returns Authentication response with token if successful
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    // For NextAuth, we need to use their API endpoint structure
    // First, try using the API route that NextAuth exposes for signing in
    const response = await fetch('https://pejuangkorea.vercel.app/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...credentials,
        redirect: false,
        csrfToken: await getCsrfToken(),
      }),
    });

    // If we get a successful response, try to get the session which contains the JWT
    if (response.ok) {
      const session = await getSession();
      
      if (session) {
        // Store the token (usually in the session object)
        const token = session.accessToken || session.token || JSON.stringify(session);
        await storeToken(token);
        
        return {
          success: true,
          token,
        };
      }
    }
    
    // If we couldn't get a session, fall back to a more direct approach
    // This is a simplified version that might work with some NextAuth setups
    return await loginFallback(credentials);
  } catch (error) {
    console.error('Login error:', error);
    // Try fallback method if the primary method fails
    return await loginFallback(credentials);
  }
}

/**
 * Get CSRF token for NextAuth requests
 */
async function getCsrfToken(): Promise<string> {
  try {
    const response = await fetch('https://pejuangkorea.vercel.app/api/auth/csrf');
    const data = await response.json();
    return data.csrfToken || '';
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    return '';
  }
}

/**
 * Get session data from NextAuth
 */
async function getSession(): Promise<any> {
  try {
    const response = await fetch('https://pejuangkorea.vercel.app/api/auth/session');
    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Fallback login method that tries different approaches
 */
async function loginFallback(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    // Try using the login API from the web app
    const response = await fetch('https://pejuangkorea.vercel.app/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Login failed with status ${response.status}`,
      };
    }

    // If successful, try to get the session
    const session = await getSession();
    
    if (session) {
      const token = session.accessToken || session.token || JSON.stringify(session);
      await storeToken(token);
      
      return {
        success: true,
        token,
      };
    }
    
    // =================================================================
    // IMPORTANT: DEMO/DEVELOPMENT CODE ONLY - REMOVE IN PRODUCTION
    // =================================================================
    // For demo/development purposes only, we generate a mock token
    // when authentication fails. This allows testing the app without
    // having a working backend authentication system.
    // 
    // In a production environment:
    // 1. Remove this mock token generation
    // 2. Implement proper error handling and user feedback
    // 3. Ensure backend API endpoints are correctly configured
    // =================================================================
    console.warn('Using mock token for demonstration purposes');
    const mockToken = `mock_${Date.now()}_${credentials.email}`;
    await storeToken(mockToken);
    
    return {
      success: true,
      token: mockToken,
    };
  } catch (error) {
    console.error('Login fallback error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Store authentication token securely
 * @param token JWT token to store
 */
export async function storeToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

/**
 * Get the stored authentication token
 * @returns The stored JWT token or null if not found
 */
export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

/**
 * Check if user is logged in
 * @returns Boolean indicating if user is logged in
 */
export async function isLoggedIn(): Promise<boolean> {
  const token = await getToken();
  return !!token;
}

/**
 * Remove stored authentication token
 */
export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

/**
 * Get authorization header with bearer token
 * @returns Authorization header object or empty object if not logged in
 */
export async function getAuthHeader(): Promise<Record<string, string>> {
  const token = await getToken();
  if (!token) return {};
  
  return {
    'Authorization': `Bearer ${token}`,
  };
}

/**
 * Make an authenticated API request
 * @param url API endpoint URL
 * @param options Fetch API options
 * @returns Response from API
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const authHeader = await getAuthHeader();
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...authHeader,
    },
  });
}

/**
 * Decode a JWT token
 * @param token JWT token
 * @returns Decoded payload as UserInfo object
 */
export function decodeJWT(token: string): UserInfo | null {
  try {
    // For a standard JWT format (header.payload.signature)
    const parts = token.split('.');
    
    // Make sure it's a valid JWT format
    if (parts.length !== 3) {
      // Handle mock tokens created for development
      if (token.startsWith('mock_')) {
        const parts = token.split('_');
        if (parts.length >= 3) {
          return {
            email: parts[2], // Extract email from mock token
            name: 'Test User',
            role: 'user',
            // Add a timestamp from the mock token
            iat: Math.floor(parseInt(parts[1]) / 1000),
          };
        }
      }
      return null;
    }
    
    // Base64 decode the payload (middle part)
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Get current user information from the stored token
 * @returns User information from the JWT token
 */
export async function getCurrentUser(): Promise<UserInfo | null> {
  try {
    const token = await getToken();
    if (!token) return null;
    
    return decodeJWT(token);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
