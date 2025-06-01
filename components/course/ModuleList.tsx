import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { View, TouchableOpacity, useColorScheme } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { CourseModule } from '~/lib/api/types';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { NAV_THEME } from '~/lib/constants';
import { BookOpen, Lock, CheckCircle } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';

interface ModuleListProps {
  modules: CourseModule[];
  onModuleSelect: (module: CourseModule) => void;
  courseTitle: string;
}

export interface ModuleListRef {
  open: () => void;
  close: () => void;
}

const ModuleList = forwardRef<ModuleListRef, ModuleListProps>(({ 
  modules, 
  onModuleSelect,
  courseTitle 
}, ref) => {
  // Bottom sheet setup
  const snapPoints = ['25%', '70%'];
  const [sheetIndex, setSheetIndex] = useState(-1);
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.expand();
    },
    close: () => {
      bottomSheetRef.current?.close();
    },
  }));

  const handleSheetChanges = useCallback((index: number) => {
    setSheetIndex(index);
  }, []);

  const handleModuleSelect = (module: CourseModule) => {
    if (!module.isLocked) {
      onModuleSelect(module);
      bottomSheetRef.current?.close();
    }
  };

  const getModuleIcon = (module: CourseModule) => {
    if (module.isCompleted) {
      const CheckIcon = iconWithClassName(CheckCircle);
      return <CheckIcon size={16} className="text-green-600" />;
    }
    if (module.isLocked) {
      const LockIcon = iconWithClassName(Lock);
      return <LockIcon size={16} className="text-muted-foreground" />;
    }
    const BookIcon = iconWithClassName(BookOpen);
    return <BookIcon size={16} className="text-primary" />;
  };

  const getModuleStatus = (module: CourseModule) => {
    if (module.isCompleted) return 'Completed';
    if (module.isLocked) return 'Locked';
    return 'Available';
  };

  const getModuleStatusColor = (module: CourseModule) => {
    if (module.isCompleted) return 'bg-green-500/20 text-green-600';
    if (module.isLocked) return 'bg-muted text-muted-foreground';
    return 'bg-primary/20 text-primary';
  };

  const colorScheme = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      enableContentPanningGesture={sheetIndex === snapPoints.length - 1}
      enableHandlePanningGesture={true}
      enableOverDrag={false}
      enableDynamicSizing={false}
      backgroundStyle={{ backgroundColor: theme.card }}
      handleIndicatorStyle={{ backgroundColor: theme.border }}
    >
      <BottomSheetView className="flex-1 rounded-3xl overflow-hidden border border-border">
        {/* Header */}
        <View className="flex-row justify-between items-center p-4 border-b border-border">
          <View className="flex-1">
            <Text className="text-xl font-bold">Course Modules</Text>
            <Text className="text-sm text-muted-foreground mt-1" numberOfLines={1}>
              {courseTitle}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="h-[50vh]">
          <BottomSheetScrollView className="flex-1">
            <View className="p-4">
              {modules.length === 0 ? (
                <Text className="text-center text-muted-foreground py-8">
                  No modules available
                </Text>
              ) : (
                modules
                  .sort((a, b) => a.order - b.order)
                  .map((module) => (
                    <TouchableOpacity
                      key={module.id}
                      onPress={() => handleModuleSelect(module)}
                      disabled={module.isLocked}
                      className={`p-3 rounded-lg flex-row justify-between items-center border mb-3 ${
                        module.isLocked 
                          ? 'bg-muted/30 border-muted opacity-60' 
                          : 'bg-secondary/30 border-transparent'
                      }`}
                    >
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2">
                          <View className="w-6 h-6 rounded-full flex justify-center items-center bg-background">
                            {getModuleIcon(module)}
                          </View>
                          <Text className={`font-bold text-lg ${
                            module.isLocked ? 'text-muted-foreground' : 'text-foreground'
                          }`}>
                            {module.title}
                          </Text>
                        </View>
                        
                        <Text className={`text-xs mt-1 ml-8 ${
                          module.isLocked ? 'text-muted-foreground' : 'text-muted-foreground'
                        }`} numberOfLines={2}>
                          {module.description}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center gap-2">
                        <View className="bg-secondary/50 px-2 py-1 rounded">
                          <Text className="text-xs font-bold text-foreground">
                            #{module.order}
                          </Text>
                        </View>
                        <View className={`px-2 py-1 rounded ${getModuleStatusColor(module)}`}>
                          <Text className="text-xs font-bold">
                            {getModuleStatus(module)}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
              )}
            </View>
          </BottomSheetScrollView>
        </View>

        {/* Footer */}
        <View className="p-4 border-t border-border">
          <Button
            onPress={() => bottomSheetRef.current?.close()}
            className="w-full"
            variant="secondary"
          >
            <Text className="text-secondary-foreground font-medium">Close</Text>
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

ModuleList.displayName = 'ModuleList';

export default ModuleList;
