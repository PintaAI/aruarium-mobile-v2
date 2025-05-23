import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { router } from 'expo-router';

export default function FlashcardGame() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-6">
        <Card className="w-full rounded-2xl mb-4">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Flashcard Game</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="items-center p-4">
              <Text className="text-lg mb-6 text-center">
                This is a placeholder for the Flashcard game.
              </Text>
              <Button 
                onPress={() => router.back()}
                className="px-8"
              >
                <Text className="text-primary-foreground font-bold">Return to Menu</Text>
              </Button>
            </View>
          </CardContent>
        </Card>
      </View>
    </SafeAreaView>
  );
}
