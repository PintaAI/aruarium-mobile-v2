import React from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { updateModuleCompletion, isModuleCompleted } from '~/lib/api/modules';
import { getCourse } from '~/lib/api/courses';
import { ModuleDetail as ModuleDetailType } from '~/lib/api/types';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { RichContentRenderer } from '../course/RichContentRenderer';
import { BookOpen } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';
import { YouTubePlayer } from './youtube-player';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ModuleDetailProps {
  module: ModuleDetailType;
  onRefresh?: () => void;
}

export function ModuleDetail({ module, onRefresh }: ModuleDetailProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  
  const isCompleted = isModuleCompleted(module);

  // Fetch course details to get author information
  const { data: courseData } = useQuery({
    queryKey: ['course', module.courseId],
    queryFn: () => getCourse(module.courseId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const completionMutation = useMutation({
    mutationFn: (completed: boolean) => updateModuleCompletion(module.id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module', module.id] });
      queryClient.invalidateQueries({ queryKey: ['course', module.courseId] });
      onRefresh?.();
      Alert.alert(
        'Success', 
        `Module marked as ${isCompleted ? 'incomplete' : 'completed'}!`
      );
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to update completion status. Please try again.');
      console.error('Update completion error:', error);
    },
  });

  const handleCompletionToggle = () => {
    const newStatus = !isCompleted;
    const action = newStatus ? 'complete' : 'mark as incomplete';
    
    Alert.alert(
      `${newStatus ? 'Complete' : 'Mark Incomplete'} Module`,
      `Are you sure you want to ${action} this module?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: newStatus ? 'Complete' : 'Mark Incomplete',
          onPress: () => completionMutation.mutate(newStatus)
        }
      ]
    );
  };

  const parseYouTubeVideos = () => {
    try {
      const parsed = JSON.parse(module.jsonDescription);
      const videos: Array<{
        videoId: string;
        src: string;
        start?: number;
        width?: number;
        height?: number;
      }> = [];

      function traverse(content: any) {
        if (Array.isArray(content)) {
          content.forEach(traverse);
        } else if (content && typeof content === 'object') {
          if (content.type === 'youtube' && content.attrs?.src) {
            const videoIdMatch = content.attrs.src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
            if (videoIdMatch) {
              videos.push({
                videoId: videoIdMatch[1],
                src: content.attrs.src,
                start: content.attrs.start || 0,
                width: content.attrs.width || 640,
                height: content.attrs.height || 480,
              });
            }
          }
          if (content.content) {
            traverse(content.content);
          }
        }
      }

      traverse(parsed);
      return videos;
    } catch (error) {
      console.error('Failed to parse YouTube videos:', error);
      return [];
    }
  };

  const youtubeVideos = parseYouTubeVideos();

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* YouTube Videos - Absolute positioned */}
      {youtubeVideos.length > 0 && (
        <View className="absolute top-16 left-0 right-0 z-10">
          {youtubeVideos.map((video, index) => (
            <Card key={index} className="p-0 rounded-none overflow-hidden">
              <YouTubePlayer
                videoId={video.videoId}
                startTime={video.start}
              />
            </Card>
          ))}
        </View>
      )}

      {/* Scrollable Content */}
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        style={{ 
          marginTop: youtubeVideos.length > 0 ? 225 : 0 // Adjust based on video player height
        }}
      >
        <View>
          {/* Module Header */}
          <Card className="p-4 border-0 shadow-none m-2">
            <View className="gap-3">
              {/* Title Row with Level Badge */}
              <View className="flex-row items-start justify-between">
                <Text className="text-xl font-bold text-foreground flex-1 pr-2">
                  {module.title}
                </Text>
                {courseData?.level && (
                  <View className="px-3 py-1 bg-secondary/70 rounded-full">
                    <Text className="text-xs font-medium text-secondary-foreground">
                      {courseData.level}
                    </Text>
                  </View>
                )}
              </View>
              
              {/* Author and Course Info */}
              <View className="gap-2">
                {/* Author */}
                {courseData?.author && (
                  <View className="flex-row items-center gap-1">
                    <Text className="text-sm text-muted-foreground">By:</Text>
                    <Text className="text-sm font-medium text-foreground">
                      {courseData.author.name || courseData.author.email}
                    </Text>
                  </View>
                )}
                
                {/* Course and Module */}
                <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center gap-1">
                    <Text className="text-sm text-muted-foreground">Course:</Text>
                    <Text className="text-sm font-medium text-foreground">
                      {module.course.title}
                    </Text>
                  </View>
                  
                </View>
              </View>
              
              {/* Module Description */}
              {module.description && (
                <Text className="text-sm text-muted-foreground leading-5">
                  {module.description}
                </Text>
              )}
            </View>
          </Card>

          {/* Rich Content */}
          <Card className="p-4 m-2">
            
            <RichContentRenderer 
              jsonDescription={module.jsonDescription}
              fallbackDescription={module.description}
              className="text-foreground"
            />
          </Card>

          {/* Completion Action */}
          <Card className="p-4 m-2">
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="font-semibold text-foreground">Progress</Text>
                <View className={`px-3 py-1 rounded-full ${
                  isCompleted ? 'bg-green-500/20' : 'bg-secondary/20'
                }`}>
                  <Text className={`text-sm font-medium ${
                    isCompleted ? 'text-green-500' : 'text-muted-foreground'
                  }`}>
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </Text>
                </View>
              </View>

              {module.userCompletion?.completedAt && (
                <Text className="text-sm text-muted-foreground">
                  Completed on {new Date(module.userCompletion.completedAt).toLocaleDateString()}
                </Text>
              )}

              <Button
                onPress={handleCompletionToggle}
                disabled={completionMutation.isPending}
                variant={isCompleted ? "outline" : "default"}
                className="w-full"
              >
                <Text className={`font-medium ${
                  isCompleted ? 'text-foreground' : 'text-primary-foreground'
                }`}>
                  {completionMutation.isPending
                    ? 'Updating...'
                    : isCompleted 
                      ? 'Mark as Incomplete' 
                      : 'Mark as Complete'
                  }
                </Text>
              </Button>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
