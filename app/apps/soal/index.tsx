import { View } from 'react-native';
import { Text } from '../../../components/ui/text';

export default function SoalIndexScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-2xl font-bold">Soal Index Screen</Text>
      <Text className="mt-4 text-foreground/80">Select a soal to view details</Text>
    </View>
  );
}
