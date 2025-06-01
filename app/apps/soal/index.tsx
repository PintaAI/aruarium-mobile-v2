import { View } from 'react-native';
import SoalList from '../../../components/soal/soal-list';

export default function SoalIndexScreen() {
  return (
    <View className="flex-1 bg-background">
      <SoalList />
    </View>
  );
}
