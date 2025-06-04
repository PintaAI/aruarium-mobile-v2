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

const GOOGLE_CLIENT_ID = '1085407842332-qaupcjrih32ep700c0jiv00o83tjm9uq.apps.googleusercontent.com';

export const useGoogleAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: makeRedirectUri({
        scheme: 'myapp',
      }),
      responseType: 'id_token',
      extraParams: {
        nonce: 'nonce',
      },
    },
    discovery
  );

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await promptAsync();
      
      if (result?.type === 'success') {
        const { id_token } = result.params;
        
        if (id_token) {
          // Send the ID token to your backend
          const response = await fetch('https://pejuangkorea.vercel.app/api/mobile/auth/callback/google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idToken: id_token,
            }),
          });

          const data = await response.json();

          if (data.success && data.token) {
            // Store the JWT token securely
            await SecureStore.setItemAsync('authToken', data.token);
            await SecureStore.setItemAsync('userData', JSON.stringify(data.user));
            
            // Navigate to home screen
            router.replace('/home');
          } else {
            Alert.alert('Login Failed', data.error || 'Authentication failed');
          }
        }
      } else if (result?.type === 'error') {
        Alert.alert('Error', 'Authentication failed');
      }
      // result.type === 'cancel' - User cancelled, do nothing
    } catch (error) {
      console.error('Google Sign-In error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle: handleGoogleSignIn,
    isLoading,
  };
};
