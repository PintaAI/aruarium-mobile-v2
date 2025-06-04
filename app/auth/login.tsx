import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Card } from '~/components/ui/card';
import { login } from '~/lib/auth';
import { Mail, Lock, Eye, EyeOff, Sparkles, Shield, ArrowRight } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';
import { useGoogleAuth } from '~/lib/hooks/useGoogleAuth';

// Create styled icons
const MailIcon = iconWithClassName(Mail);
const LockIcon = iconWithClassName(Lock);
const EyeIcon = iconWithClassName(Eye);
const EyeOffIcon = iconWithClassName(EyeOff);
const SparklesIcon = iconWithClassName(Sparkles);
const ShieldIcon = iconWithClassName(Shield);
const ArrowRightIcon = iconWithClassName(ArrowRight);

export default function LoginScreen() {
  const router = useRouter();
  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      const response = await login({ email, password });
      
      if (response.success && response.token) {
        // Navigate to home screen after successful login
        router.replace('/home');
      } else {
        Alert.alert(
          'Login Failed',
          response.error || 'Please check your email and password'
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="light" />
      <Stack.Screen
        options={{
          title: '',
          headerShown: false,
        }}
      />
      
      {/* Background */}
      <View className="absolute inset-0 bg-background" />
      
      <KeyboardAvoidingView 
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View className="flex-1 justify-center px-6 py-12">
            <View className="items-center gap-5">
              {/* Logo/Icon */}
              <View className="w-20 h-20 bg-primary/20 rounded-full items-center justify-center">
                <ShieldIcon size={40} className="text-primary" />
              </View>
              
              {/* Welcome Text */}
              <View className="items-center gap-2">
                <View className="flex-row items-center gap-2">
                  <Text className="text-3xl font-bold text-foreground">Pejuangkorea</Text>
                
                </View>
                <Text className="text-muted-foreground text-center text-lg mb-2">
                  silahkan masuk untuk melanjutkan
                </Text>
              </View>
            </View>

            {/* Login Card */}
            <Card className="bg-white/95 p-6 rounded-3xl shadow-xl">
              {/* Form Header */}
              <View className="items-center gap-1 mb-6">
                <Text className="text-xl font-semibold text-gray-800">Sign In</Text>
                <Text className="text-gray-600">Access your account</Text>
              </View>

              {/* Email Input */}
              <View className="gap-4">
                <View className="gap-2">
                  <View className="flex-row items-center gap-2">
                    <MailIcon size={18} className="text-gray-600" />
                    <Text className="text-gray-700 font-medium">Email Address</Text>
                  </View>
                  <Input
                    placeholder="Enter your email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    error={errors.email}
                    className='bg-foreground/10 rounded-md border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary h-10 p-2'
                  />
                </View>

                {/* Password Input */}
                <View className="gap-2">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <LockIcon size={18} className="text-gray-600" />
                      <Text className="text-gray-700 font-medium">Password</Text>
                    </View>
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <View className="flex-row items-center gap-1">
                        {showPassword ? (
                          <EyeOffIcon size={16} className="text-gray-500" />
                        ) : (
                          <EyeIcon size={16} className="text-gray-500" />
                        )}
                        <Text className="text-gray-500 text-sm">
                          {showPassword ? 'Hide' : 'Show'}
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                  <Input
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    error={errors.password}
                    className='bg-foreground/10 rounded-md border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary h-10 p-2'
                  />
                </View>
              </View>

              {/* Login Button */}
              <Button 
                onPress={handleLogin} 
                disabled={isLoading}
                className="bg-secondary py-4 rounded-2xl mt-6"
              >
                <View className="flex-row items-center justify-center gap-2">
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Text className="text-primary font-semibold text-lg">Sign In</Text>
                      <ArrowRightIcon size={20} className="text-primary" />
                    </>
                  )}
                </View>
              </Button>

              {/* Divider */}
              <View className="flex-row items-center mt-6 gap-4">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="text-gray-500 text-sm">or</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

              {/* Google Sign-In Button */}
              <Button 
                onPress={signInWithGoogle} 
                disabled={isGoogleLoading}
                className="bg-white border border-gray-300 py-4 rounded-2xl mt-4"
              >
                <View className="flex-row items-center justify-center gap-3">
                  {isGoogleLoading ? (
                    <ActivityIndicator size="small" color="#4285F4" />
                  ) : (
                    <>
                      <Text className="text-lg">🔍</Text>
                      <Text className="text-gray-700 font-semibold text-lg">Continue with Google</Text>
                    </>
                  )}
                </View>
              </Button>

              {/* Additional Actions */}
              <View className="items-center mt-6">
                <Pressable>
                  <Text className="text-primary font-medium">Forgot Password?</Text>
                </Pressable>
              </View>
            </Card>

            {/* Footer */}
            <View className="items-center mt-8">
              <Text className="text-white/70 text-center">
                Don't have an account?{' '}
                <Text className="text-white font-semibold">Sign Up</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
