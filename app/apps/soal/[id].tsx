import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import Quiz from '../../../components/soal/quiz';

export default function SoalScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'Quiz' }} />
      <Quiz collectionId={id as string} />
    </View>
  );
}
