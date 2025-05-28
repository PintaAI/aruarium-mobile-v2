# Mobile Authentication System Documentation

## Overview
This document details the complete mobile authentication system implementation that enables secure JWT-based authentication between the mobile app and web API endpoints.

## Architecture

### Authentication Flow
```
📱 Mobile App
    ↓ POST /api/mobile/auth/login
🌐 Web API Server
    ↓ JWT Token Response
💾 Secure Token Storage
    ↓ Bearer Token Headers
🔒 Protected API Endpoints
    ↓ JWT Validation
✅ Authenticated Data Access
```

## Implementation Details

### 1. Mobile Authentication (`mobile/lib/auth.ts`)

#### Core Functions:
- **`login(credentials)`** - Authenticates with mobile auth endpoint
- **`fetchWithAuth(url, options)`** - Adds Bearer token to API requests
- **`getCurrentUser()`** - Decodes JWT to get user information
- **`logout()`** - Clears stored authentication token

#### Features:
- JWT token storage using Expo SecureStore
- Comprehensive logging with emoji indicators
- Proper error handling and user feedback
- Support for both JWT and session token formats

#### Network Configuration:
```typescript
// Development
const response = await fetch('http://192.168.15.34:3000/api/mobile/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentials),
});

// Production (when deployed)
const response = await fetch('https://pejuangkorea.vercel.app/api/mobile/auth/login', {
  // ... same configuration
});
```

### 2. Mobile API Integration (`mobile/lib/api/vocabulary.ts`)

#### Updated Functions:
- **`getVocabularyCollections(type?)`** - Fetches collections with auth
- **`getCollectionItems(collectionId, type?)`** - Fetches items with auth
- **`searchVocabulary(query)`** - Searches vocabulary with auth

#### Authentication Integration:
```typescript
// All API calls now use authenticated requests
const response = await fetchWithAuth(url);

// Proper 401 handling
if (response.status === 401) {
  console.warn('🔒 Authentication required');
  throw new Error('Authentication required');
}
```

#### Platform-Specific URLs:
```typescript
const DEV_URL = Platform.select({
  android: 'http://10.0.2.2:3000',         // Android emulator
  ios: 'http://192.168.15.34:3000',        // iOS real device
  default: 'http://localhost:3000'          // iOS simulator
});
```

### 3. Server-Side Authentication (`web/app/api/mobile/auth/login/route.ts`)

#### Login Endpoint:
- Validates user credentials against database
- Uses bcrypt for password verification
- Returns JWT tokens with 7-day expiration
- Includes user data in response

#### JWT Token Structure:
```typescript
const token = jwt.sign({
  sub: user.id,           // Subject (user ID)
  email: user.email,      // User email
  name: user.name,        // Display name
  role: user.role,        // User role
  plan: user.plan,        // Subscription plan
  iat: Math.floor(Date.now() / 1000),     // Issued at
  exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // Expires in 7 days
}, jwtSecret, { algorithm: "HS256" });
```

### 4. API Protection (`web/app/api/mobile/vocab/route.ts`)

#### JWT Validation Middleware:
```typescript
async function verifyToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }
  
  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, jwtSecret);
  return decoded;
}
```

#### Protected Endpoints:
- All vocabulary API endpoints require authentication
- Returns 401 for missing or invalid tokens
- Validates JWT signature and expiration
- Logs authentication attempts for debugging

### 5. Debug Interface (`mobile/app/home/profil.tsx`)

#### JWT Debug Section:
- **Decoded User Info:** Complete JWT payload as JSON
- **Raw Token:** First 100 characters of stored token
- **Token Type Detection:** JWT vs Session token identification
- **All User Properties:** Individual property display

#### Debug Display:
```typescript
// Shows decoded JWT content
{userInfo ? JSON.stringify(userInfo, null, 2) : 'No user info available'}

// Token type detection
{rawToken?.startsWith('{') ? '📄 Session Token (JSON)' : 
 rawToken?.split('.').length === 3 ? '🔐 JWT Token' : 
 '❓ Unknown Token Format'}
```

## Security Features

### Token Management:
- **Secure Storage:** Uses Expo SecureStore for token persistence
- **Automatic Headers:** Bearer token added to all authenticated requests
- **Expiration Handling:** 7-day token lifetime with proper validation
- **Clean Logout:** Complete token removal on logout

### Server Validation:
- **JWT Signature Verification:** Uses AUTH_SECRET for validation
- **Token Expiration Checks:** Automatic expiry validation
- **User Data Validation:** Database user verification during login
- **Error Logging:** Comprehensive server-side logging

## Development Workflow

### Local Development:
1. **Start Next.js dev server:** `bun run dev`
2. **Configure mobile app:** Update IP address in mobile config
3. **Test authentication:** Use debug interface to verify JWT content
4. **API testing:** All vocabulary endpoints require valid tokens

### Production Deployment:
1. **Deploy web changes:** Upload to Vercel/production server
2. **Update mobile config:** Switch to production URLs
3. **Test authentication flow:** Verify JWT creation and validation
4. **Monitor logs:** Check authentication success/failure rates

## Logging System

### Mobile Logs:
```
🔐 Starting mobile authentication...
📡 Connecting to mobile auth endpoint...
📊 Auth endpoint response: 200
✅ Authentication successful
💾 Token stored successfully
```

### API Logs:
```
📚 Fetching vocabulary collections...
📊 Collections API response: 200
✅ Retrieved 5 vocabulary collections
```

### Server Logs:
```
🔐 Verifying authentication token...
🔑 Token extracted from header
✅ Token verified for user: user@example.com
```

## Troubleshooting

### Common Issues:

#### 1. Network Connection:
- **Check IP Address:** Ensure mobile config matches dev server IP
- **Firewall Settings:** Verify port 3000 is accessible
- **CORS Issues:** Check server CORS configuration

#### 2. Authentication Failures:
- **Invalid Credentials:** Verify user exists in database
- **Token Expiration:** Check JWT expiry in debug interface
- **Secret Mismatch:** Ensure AUTH_SECRET matches between environments

#### 3. API Access Issues:
- **Missing Authorization:** Verify Bearer token in request headers
- **Token Format:** Check if token is properly formatted JWT
- **Server Validation:** Review server logs for validation errors

## Migration Notes

### Changes from Previous System:
1. **Removed NextAuth Dependencies:** No longer uses NextAuth session endpoints
2. **Dedicated Mobile Endpoints:** Custom `/api/mobile/*` endpoints for mobile
3. **JWT-Based Authentication:** Proper JWT tokens instead of session cookies
4. **Enhanced Security:** Server-side JWT validation on all mobile endpoints

### Benefits:
- **Mobile-Optimized:** Designed specifically for mobile app requirements
- **Stateless Authentication:** JWT tokens don't require server sessions
- **Better Performance:** Reduced authentication overhead
- **Enhanced Debugging:** Comprehensive logging and debug interface

## Files Modified

### Mobile App:
- `mobile/lib/auth.ts` - Core authentication functions
- `mobile/lib/api/vocabulary.ts` - API integration with auth
- `mobile/app/home/profil.tsx` - Debug interface

### Web API:
- `web/app/api/mobile/auth/login/route.ts` - Mobile auth endpoint
- `web/app/api/mobile/vocab/route.ts` - Protected vocabulary API

## Future Enhancements

### Potential Improvements:
1. **Token Refresh:** Implement automatic token renewal
2. **Biometric Auth:** Add fingerprint/face recognition
3. **Role-Based Access:** Fine-grained permission system
4. **Audit Logging:** Detailed authentication event tracking
5. **Rate Limiting:** API request throttling for security

---

**Last Updated:** May 27, 2025  
**Version:** 1.0  
**Status:** Production Ready
