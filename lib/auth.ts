import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from './config';

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
  console.log('🔐 Starting mobile authentication...');
  
  try {
    console.log('📡 Connecting to mobile auth endpoint...');
    
    const response = await fetch(`${API_BASE_URL}/api/mobile/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log(`📊 Auth endpoint response: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Authentication successful');
      
      if (data.success && data.token) {
        await storeToken(data.token);
        console.log('💾 Token stored successfully');
        
        return {
          success: true,
          token: data.token,
        };
      } else {
        console.warn('❌ Invalid response format');
        return {
          success: false,
          error: data.error || 'Authentication failed',
        };
      }
    } else {
      console.warn(`❌ Auth failed with status: ${response.status}`);
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        error: errorData?.error || `Login failed with status ${response.status}`,
      };
    }
  } catch (error) {
    console.error('💥 Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
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
    // Check if it's a session-based token (JSON string)
    if (token.startsWith('{')) {
      const sessionData = JSON.parse(token);
      if (sessionData.user) {
        return {
          id: sessionData.user.id,
          email: sessionData.user.email,
          name: sessionData.user.name,
          role: sessionData.user.role,
          picture: sessionData.user.image,
          ...sessionData.user,
        };
      }
    }
    
    // For a standard JWT format (header.payload.signature)
    const parts = token.split('.');
    
    // Make sure it's a valid JWT format
    if (parts.length !== 3) {
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
