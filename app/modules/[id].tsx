import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

import { useQuery } from '@tanstack/react-query';
import { getModule } from '~/lib/api/modules';
import { ModuleDetail } from '../../components/module/module-detail';
import { Text } from '~/components/ui/text';


export default function ModuleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const moduleId = parseInt(id as string, 10);


  const {
    data: module,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: () => getModule(moduleId),
    enabled: !isNaN(moduleId),
  });

  if (isNaN(moduleId)) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Stack.Screen options={{ title: 'Invalid Module' }} />
        <Text className="text-lg text-destructive">Invalid module ID</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" className="text-primary" />
        <Text className="mt-4 text-muted-foreground">Loading module...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Stack.Screen options={{ title: 'Error' }} />
        <Text className="text-lg text-destructive mb-4">Failed to load module</Text>
        <Text className="text-muted-foreground text-center mb-4">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </Text>
      </View>
    );
  }

  if (!module) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Stack.Screen options={{ title: 'Not Found' }} />
        <Text className="text-lg text-destructive">Module not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
          
        }} 
      />
      <View className="flex-1 bg-background">
        <ModuleDetail module={module} onRefresh={refetch} />
      </View>
    </>
  );
}
