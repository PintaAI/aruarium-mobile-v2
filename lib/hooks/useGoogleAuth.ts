import { useState } from 'react';
import { Alert } from 'react-native';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

// Google OAuth discovery document
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

const GOOGLE_CLIENT_ID = '1085407842332-6jt7i5cn8scfc5bc2emb1juaqh6uv5ol.apps.googleusercontent.com';

export const useGoogleAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Use the custom scheme from app.json
  const redirectUri = makeRedirectUri({
    scheme: 'com.googleusercontent.apps.1085407842332-6jt7i5cn8scfc5bc2emb1juaqh6uv5ol',
    path: 'oauth2redirect/google',
  });

  console.log('🔧 Google Auth Config:', {
    clientId: GOOGLE_CLIENT_ID,
    redirectUri,
    scopes: ['openid', 'profile', 'email'],
  });

  const [, response, promptAsync] = useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: 'code', // Use authorization code flow instead of implicit
      usePKCE: true, // Enable PKCE for better security
    },
    discovery
  );

  const handleGoogleSignIn = async () => {
    try {
      console.log('🚀 Starting Google Sign-In with expo-auth-session...');
      setIsLoading(true);
      
      console.log('📱 Prompting user for authentication...');
      const result = await promptAsync();
      
      console.log('📋 Auth result:', {
        type: result?.type,
        hasParams: !!(result as any)?.params,
        paramsKeys: (result as any)?.params ? Object.keys((result as any).params) : [],
      });
      
      if (result?.type === 'success') {
        console.log('✅ Authentication successful');
        const { code } = (result as any).params;
        
        if (code) {
          console.log('🎫 Authorization code received, length:', code.length);
          
          // Send the authorization code to your backend
          console.log('🌐 Sending code to backend...');
          const response = await fetch('https://pejuangkorea.vercel.app/api/mobile/auth/callback/google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: code,
              redirectUri: redirectUri,
            }),
          });

          console.log('📡 Backend response status:', response.status);
          const data = await response.json();
          console.log('📄 Backend response data:', {
            success: data.success,
            hasToken: !!data.token,
            hasUser: !!data.user,
            error: data.error,
          });

          if (data.success && data.token) {
            console.log('💾 Storing tokens securely...');
            // Store the JWT token securely (using the same key as lib/auth.ts)
            await SecureStore.setItemAsync('auth_token', data.token);
            await SecureStore.setItemAsync('userData', JSON.stringify(data.user));
            
            console.log('🏠 Navigating to home screen...');
            // Navigate to home screen
            router.replace('/home');
          } else {
            console.error('❌ Login failed:', data.error);
            Alert.alert('Login Failed', data.error || 'Authentication failed');
          }
        } else {
          console.error('❌ No authorization code received');
          Alert.alert('Error', 'No authorization code received');
        }
      } else if (result?.type === 'error') {
        console.error('❌ Authentication error:', result.error);
        Alert.alert('Error', `Authentication failed: ${result.error?.message || 'Unknown error'}`);
      } else if (result?.type === 'cancel') {
        console.log('🚫 User cancelled authentication');
      } else {
        console.log('ℹ️ Unexpected result type:', result?.type);
      }
    } catch (error) {
      console.error('💥 Google Sign-In error:', error);
      Alert.alert('Error', `An unexpected error occurred: ${(error as Error).message || error}`);
    } finally {
      setIsLoading(false);
      console.log('🏁 Google Sign-In process completed');
    }
  };

  return {
    signInWithGoogle: handleGoogleSignIn,
    isLoading,
  };
};
