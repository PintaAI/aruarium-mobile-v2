import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { router } from 'expo-router';

export default function FypSoal() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center p-4">
        <Card className="w-full rounded-2xl">
          <CardContent className="items-center p-4 gap-4">
            <View className="items-center gap-2">
              <Text className="text-3xl font-bold text-primary">Segera Hadir!</Text>
              <Text className="text-muted-foreground text-center">
                Fitur FYP Soal sedang dalam pengembangan dan akan segera tersedia untuk membantumu berlatih soal-soal.
              </Text>
            </View>
            <Button 
              onPress={() => router.back()}
              className="w-full"
            >
              <Text className="text-primary-foreground font-bold">Kembali</Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </SafeAreaView>
  );
}
