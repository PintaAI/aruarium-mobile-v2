import React, { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';
import { Modal, View, StatusBar } from 'react-native';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import { Text } from '~/components/ui/text';

type UpdateState = 'idle' | 'checking' | 'available' | 'downloading' | 'error';

export function UpdateChecker() {
  const [updateState, setUpdateState] = useState<UpdateState>('idle');
  const [showModal, setShowModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function checkForUpdates() {
      try {
        // Only check for updates in production builds
        if (!__DEV__ && Updates.isEnabled) {
          setUpdateState('checking');
          const update = await Updates.checkForUpdateAsync();
          
          if (update.isAvailable) {
            setUpdateState('available');
            setShowModal(true);
          } else {
            setUpdateState('idle');
          }
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
        setUpdateState('error');
        setErrorMessage('Gagal memeriksa pembaruan');
      }
    }

    // Check for updates when component mounts
    checkForUpdates();
  }, []);

  const handleUpdateNow = async () => {
    try {
      setUpdateState('downloading');
      setDownloadProgress(0);

      // Simulate progress updates (Expo doesn't provide real-time progress)
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await Updates.fetchUpdateAsync();
      
      clearInterval(progressInterval);
      setDownloadProgress(100);
      
      // Small delay to show 100% completion
      setTimeout(async () => {
        await Updates.reloadAsync();
      }, 500);
    } catch (error) {
      console.error('Error updating app:', error);
      setUpdateState('error');
      setErrorMessage('Gagal mengunduh pembaruan');
    }
  };

  const handleLater = () => {
    setShowModal(false);
    setUpdateState('idle');
  };

  const handleRetry = () => {
    setUpdateState('idle');
    setErrorMessage('');
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <Modal
      visible={showModal}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center text-primary">
              {updateState === 'error' ? '⚠️ Error' : '🚀 Update Tersedia'}
            </CardTitle>
            <CardDescription className="text-center">
              {updateState === 'error' 
                ? errorMessage
                : updateState === 'downloading'
                ? 'Mengunduh pembaruan...'
                : 'Versi baru aplikasi tersedia dengan fitur dan perbaikan terbaru'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="gap-4">
            {updateState === 'downloading' && (
              <View className="gap-2">
                <Progress value={downloadProgress} className="h-2" />
                <Text className="text-xs text-center text-muted-foreground">
                  {downloadProgress}% selesai
                </Text>
              </View>
            )}

            {updateState === 'available' && (
              <View className="gap-2 bg-secondary/50 p-3 rounded-md">
                <Text className="text-sm font-medium">✨ Yang Baru:</Text>
                <Text className="text-xs text-muted-foreground">
                  • Peningkatan performa{'\n'}
                  • Perbaikan bug{'\n'}
                  • Fitur baru yang menarik
                </Text>
              </View>
            )}
          </CardContent>

          <CardFooter className="gap-2">
            {updateState === 'error' ? (
              <Button 
                variant="default" 
                className="flex-1"
                onPress={handleRetry}
              >
                <Text>Coba Lagi</Text>
              </Button>
            ) : updateState === 'downloading' ? (
              <View className="flex-1 items-center">
                <Text className="text-sm text-muted-foreground">
                  Mohon tunggu...
                </Text>
              </View>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onPress={handleLater}
                >
                  <Text>Nanti</Text>
                </Button>
                <Button 
                  variant="default" 
                  className="flex-1"
                  onPress={handleUpdateNow}
                >
                  <Text>Update Sekarang</Text>
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </View>
    </Modal>
  );
}
