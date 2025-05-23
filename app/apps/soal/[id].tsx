import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Text } from '../../../components/ui/text';

export default function SoalScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-2xl font-bold">Soal Screen</Text>
      <Text>ID: {id}</Text>
    </View>
  );
}
