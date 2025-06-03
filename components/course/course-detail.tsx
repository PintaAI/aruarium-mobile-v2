import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Alert, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { joinCourse, leaveCourse } from '~/lib/api/courses';
import { CourseWithModules, CourseModule } from '~/lib/api/types';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { RichContentRenderer } from './RichContentRenderer';
import ModuleList, { ModuleListRef } from './ModuleList';
import { List, LogOut } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';

interface CourseDetailProps {
  course: CourseWithModules;
  onRefresh?: () => void;
}

const HEADER_HEIGHT = 256; // h-64 in pixels
const CONTENT_OFFSET = HEADER_HEIGHT - 80; // Start content 80px before header ends

export function CourseDetail({ course, onRefresh }: CourseDetailProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);
  const scrollY = new Animated.Value(0);
  const moduleListRef = useRef<ModuleListRef>(null);
  const { colorScheme } = useColorScheme();
  
  // Get background color based on theme
  const backgroundColor = colorScheme === 'dark' ? 'rgb(9, 9, 11)' : 'rgb(255, 255, 255)';

  const joinMutation = useMutation({
    mutationFn: () => joinCourse(course.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', course.id] });
      onRefresh?.();
      Alert.alert('Success', 'Successfully joined the course!');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to join course. Please try again.');
      console.error('Join course error:', error);
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => leaveCourse(course.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', course.id] });
      onRefresh?.();
      Alert.alert('Success', 'Successfully left the course!');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to leave course. Please try again.');
      console.error('Leave course error:', error);
    },
  });

  const handleJoinLeave = () => {
    if (course.isJoined) {
      Alert.alert(
        'Leave Course',
        'Are you sure you want to leave this course?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Leave', 
            style: 'destructive',
            onPress: () => leaveMutation.mutate()
          }
        ]
      );
    } else {
      joinMutation.mutate();
    }
  };

  const handleModuleSelect = (module: CourseModule) => {
    console.log('Selected module:', module);
    router.push(`/modules/${module.id}`);
  };

  const handleOpenModuleList = () => {
    moduleListRef.current?.open();
  };
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-green-500';
      case 'INTERMEDIATE':
        return 'bg-yellow-500';
      case 'ADVANCED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getLevelText = (level: string) => {
    return level.charAt(0) + level.slice(1).toLowerCase();
  };

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT / 2],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT / 4, HEADER_HEIGHT / 2],
    outputRange: [1, 0.3, 0.0],
    extrapolate: 'clamp',
  });

  // For bounce effect on over-scroll
  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });
  return (
    <View className="flex-1">
      {/* Fixed Parallax Header */}
      <Animated.View
        className="absolute top-0 left-0 right-0 z-0"
        style={{
          height: HEADER_HEIGHT,
          transform: [{ translateY: headerTranslateY }],
        }}
      >
        {course.thumbnail ? (
          <Animated.View
            className="w-full h-full"
            style={{
              opacity: imageOpacity,
              transform: [{ scale: imageScale }]
            }}
          >
            <Image
              source={{ uri: course.thumbnail }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', backgroundColor]}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              locations={[0.2, 1]}
            />
          </Animated.View>
        ) : (
          <Animated.View
            className="w-full h-full bg-muted items-center justify-center"
            style={{
              opacity: imageOpacity,
              transform: [{ scale: imageScale }]
            }}
          >
            <Text className="text-muted-foreground">No image available</Text>
          </Animated.View>
        )}
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: CONTENT_OFFSET }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        bounces={true}
      >
        {/* Course Header Info */}
        <View className="p-4 gap-4 bg-background rounded-t-3xl">
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold flex-1">{course.title}</Text>
            <View className={`px-3 py-1 rounded-full ${getLevelColor(course.level)}`}>
              <Text className="text-white text-sm font-medium">
                {getLevelText(course.level)}
              </Text>
            </View>
          </View>
          
          {/* Author Info */}
          <View className="flex-row items-center gap-2">
            <Text className="text-muted-foreground">by</Text>
            <Text className="font-medium text-primary">
              {course.author.name || course.author.email}
            </Text>
          </View>

          {/* Course Stats */}
          <View className="flex-row gap-4">
            <View className="flex-row items-center gap-1">
              <Text className="text-sm text-muted-foreground">
                {course.totalMembers} members
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="text-sm text-muted-foreground">
                {course.totalModules} modules
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-3">
          {/* Joined Course Actions */}
          {course.isJoined ? (
            course.modules && course.modules.length > 0 ? (
              /* 70-30 Layout: View Modules (70%) + Leave Course (30%) */
              <View className="flex-row gap-3">
                {/* View Modules Button - 70% */}
                <TouchableOpacity
                  onPress={handleOpenModuleList}
                  className="flex-1 py-3 px-4 rounded-lg bg-primary"
                  style={{ flex: 0.9 }}
                >
                  <View className="flex-row items-center justify-center gap-2">
                    {(() => {
                      const ListIcon = iconWithClassName(List);
                      return <ListIcon size={18} className="text-primary-foreground" />;
                    })()}
                    <Text className="text-primary-foreground font-medium text-sm">
                      Lihat module
                    </Text>
                  </View>
                </TouchableOpacity>
                
                {/* Leave Course Button - 30% (Icon Only) */}
                <TouchableOpacity
                  onPress={handleJoinLeave}
                  disabled={leaveMutation.isPending}
                  className={`py-3 px-3 rounded-lg border border-destructive items-center justify-center ${
                    leaveMutation.isPending ? 'opacity-50' : ''
                  }`}
                  style={{ flex: 0.1 }}
                >
                  {leaveMutation.isPending ? (
                    <Text className="text-destructive text-xs font-medium">...</Text>
                  ) : (
                    (() => {
                      const LogOutIcon = iconWithClassName(LogOut);
                      return <LogOutIcon size={18} className="text-destructive" />;
                    })()
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              /* No modules - Only Leave Course Button */
              <TouchableOpacity
                onPress={handleJoinLeave}
                disabled={leaveMutation.isPending}
                className={`py-2.5 px-4 rounded-lg border border-destructive ${
                  leaveMutation.isPending ? 'opacity-50' : ''
                }`}
              >
                <Text className="text-center font-medium text-sm text-destructive">
                  {leaveMutation.isPending ? 'Processing...' : 'Leave Course'}
                </Text>
              </TouchableOpacity>
            )
          ) : (
            /* Join Course Button - Single Primary Action */
            <TouchableOpacity
              onPress={handleJoinLeave}
              disabled={joinMutation.isPending}
              className={`py-3 px-4 rounded-lg bg-primary ${
                joinMutation.isPending ? 'opacity-50' : ''
              }`}
            >
              <Text className="text-center font-medium text-sm text-primary-foreground">
                {joinMutation.isPending ? 'Joining...' : 'Join Course'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

        {/* Course Description */}
        {course.description && (
          <Card className="m-4 p-4">
            <RichContentRenderer 
              jsonDescription={course.jsonDescription}
              fallbackDescription={course.description}
              className="text-muted-foreground"
            />
          </Card>
        )}
      </Animated.ScrollView>
      
      {/* Module List Bottom Sheet */}
      <ModuleList
        ref={moduleListRef}
        modules={course.modules || []}
        onModuleSelect={handleModuleSelect}
        courseTitle={course.title}
      />
    </View>
  );
}
