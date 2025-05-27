import { ScrollView, View } from 'react-native';
import { AppList } from '~/components/AppList';
import { Articles } from '~/components/Articles';
import { DailyVocabs } from '~/components/DailyVocabs';
import { RecentCourses } from '~/components/RecentCourses';
import { RecentVocabulary } from '~/components/RecentVocabulary';

export function HomeScreen() {
  return (
    
    <ScrollView className="flex-1 p-6 bg-secondary/30">
      <View className="mx-auto w-full max-w-lg flex gap-6">
        <AppList />
        <RecentCourses />
        <RecentVocabulary />
        <Articles />
        <DailyVocabs />
      </View>
    </ScrollView>
  );
}
