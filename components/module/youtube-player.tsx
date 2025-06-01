import React, { useState } from 'react';
import { View,} from 'react-native';
import { WebView } from 'react-native-webview';
import { Text } from '~/components/ui/text';
import { Play,} from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';

interface YouTubePlayerProps {
  videoId: string;
  startTime?: number;
  width?: number;
  height?: number;
}

export function YouTubePlayer({ 
  videoId, 
  startTime = 0,  
  height = 220 
}: YouTubePlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);



  const embedUrl = `https://www.youtube.com/embed/${videoId}?${new URLSearchParams({
    start: startTime.toString(),
    autoplay: '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  }).toString()}`;

  const handleWebViewError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleWebViewLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  if (hasError) {
    return (
      <View 
        className="bg-muted items-center justify-center p-4 rounded-lg"
        style={{ height }}
      >
        <View className="items-center gap-3">
          {(() => {
            const PlayIcon = iconWithClassName(Play);
            return <PlayIcon size={32} className="text-muted-foreground" />;
          })()}
          <Text className="text-muted-foreground text-center">
            Unable to load video
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="relative">
      {/* Loading State */}
      {isLoading && (
        <View 
          className="absolute inset-0 bg-background items-center justify-center z-10"
          style={{ height }}
        >
          <View className="items-center gap-2">
            {(() => {
              const PlayIcon = iconWithClassName(Play);
              return <PlayIcon size={32} className="text-red-600" />;
            })()}
          
          </View>
        </View>
      )}

      {/* Video Player */}
      <View style={{ height }} className="rounded-0 overflow-hidden">
        <WebView
          source={{ uri: embedUrl }}
          style={{ flex: 1 }}
          onLoad={handleWebViewLoad}
          onError={handleWebViewError}
          onHttpError={handleWebViewError}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          scalesPageToFit={true}
          scrollEnabled={false}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

    </View>
  );
}
