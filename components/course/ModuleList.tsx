import React, { useState, useCallback, forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import { View, TouchableOpacity, useColorScheme, Animated, Dimensions } from 'react-native';
import { Text } from '~/components/ui/text';
import { CourseModule } from '~/lib/api/types';
import BottomSheet, { BottomSheetView, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { NAV_THEME } from '~/lib/constants';
import { Lock, CheckCircle } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';
import Reanimated, { useSharedValue, runOnJS, useAnimatedReaction } from 'react-native-reanimated';

interface ModuleListProps {
  modules: CourseModule[];
  onModuleSelect: (module: CourseModule) => void;
  courseTitle: string;
  onOpenChange?: (isOpen: boolean) => void;
  onSheetHeightChange?: (heightPercentage: number) => void;
}

export interface ModuleListRef {
  open: () => void;
  close: () => void;
}

const ModuleList = forwardRef<ModuleListRef, ModuleListProps>(({ 
  modules, 
  onModuleSelect,
  courseTitle,
  onOpenChange,
  onSheetHeightChange
}, ref) => {
  // Bottom sheet setup
  const snapPoints = ['25%', '90%'];
  const [sheetIndex, setSheetIndex] = useState(-1);
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const animatedPosition = useSharedValue(0);
  
  // Screen dimensions for calculating height percentage
  const screenHeight = Dimensions.get('window').height;

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
    onOpenChange?.(index >= 0);
  }, [onOpenChange]);

  // Real-time position tracking for dynamic scaling
  useAnimatedReaction(
    () => animatedPosition.value,
    (position) => {
      // Convert position to height percentage
      const heightPercentage = Math.max(0, position / screenHeight);
      
      // Call the height change callback on JS thread
      runOnJS(onSheetHeightChange ?? (() => {}))(heightPercentage);
    },
    [screenHeight, onSheetHeightChange]
  );

  const renderBackdrop = useCallback(
    () => null,
    []
  );

  const handleModuleSelect = (module: CourseModule) => {
    if (!module.isLocked) {
      onModuleSelect(module);
      bottomSheetRef.current?.close();
    }
  };



  const colorScheme = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      animatedPosition={animatedPosition}
      enablePanDownToClose={true}
      enableContentPanningGesture={sheetIndex === snapPoints.length - 1}
      enableHandlePanningGesture={true}
      enableOverDrag={false}
      enableDynamicSizing={false}
      backgroundStyle={{ backgroundColor: theme.card }}
      backdropComponent={renderBackdrop}
      handleStyle={{
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderWidth: 1,
        borderColor: theme.border,
        borderBottomWidth: 0
      }}
      handleIndicatorStyle={{ 
        backgroundColor: theme.border,
        width: 40,
        height: 4,
        borderRadius: 2,
        opacity: 0.6
      }}
    >
      <BottomSheetView className="flex-1 overflow-hidden border-x border-border">
        {/* Header */}
        <View className="mx-4 my-4">
          <Text className="text-xl font-bold">Course Modules</Text>
          <Text className="text-sm text-muted-foreground" numberOfLines={1}>
            {courseTitle}
          </Text>
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
                    <View key={module.id} className="relative mb-3">
                      <TouchableOpacity
                        onPress={() => handleModuleSelect(module)}
                        disabled={module.isLocked}
                        
                        className={`p-4 rounded-lg border ${
                          module.isLocked 
                            ? 'bg-muted/20 border-muted opacity-40' 
                            : 'bg-secondary/30 border-transparent'
                        }`}
                      >
                        <View className="gap-2">
                          <Text 
                            className={`font-semibold text-base ${
                              module.isLocked ? 'text-muted-foreground' : 'text-foreground'
                            }`}
                            numberOfLines={1}
                          >
                            {module.title}
                          </Text>
                          
                          <Text 
                            className={`text-sm ${
                              module.isLocked ? 'text-muted-foreground' : 'text-muted-foreground'
                            }`} 
                            numberOfLines={2}
                          >
                            {module.description}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      
                      {/* Completion Indicator */}
                      {module.isCompleted && (
                        <View className="absolute top-2 right-2">
                          <View className="bg-green-500/30 p-0.5 rounded-full shadow-lg">
                            {(() => {
                              const CheckIcon = iconWithClassName(CheckCircle);
                              return <CheckIcon size={10} className="text-white" />;
                            })()}
                          </View>
                        </View>
                      )}
                      
                      {/* Lock Overlay */}
                      {module.isLocked && (
                        <View className="absolute inset-0 flex justify-center items-center bg-background/20 rounded-lg">
                          <View className="bg-background/90 p-2 rounded-full">
                            {(() => {
                              const LockIcon = iconWithClassName(Lock);
                              return <LockIcon size={20} className="text-muted-foreground" />;
                            })()}
                          </View>
                        </View>
                      )}
                    </View>
                  ))
              )}
            </View>
          </BottomSheetScrollView>
        </View>

    

      </BottomSheetView>
    </BottomSheet>
  );
});

ModuleList.displayName = 'ModuleList';

export default ModuleList;
