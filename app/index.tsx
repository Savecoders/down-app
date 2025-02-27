import * as React from 'react';
import { Image, Text, TextInput, View, ScrollView } from 'react-native';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Download } from '../lib/icons/Download';
import { LoaderCircleIcon } from '../lib/icons/LoaderCircleIcon';
import { RefreshCw } from '../lib/icons/RefreshCw';
import { Separator } from '~/components/ui/separator';

import { H3, H4, P } from '~/components/ui/typography';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import GridVideo from '~/components/GridVideo';
import { AnimatedView } from 'react-native-reanimated/lib/typescript/component/View';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { useVideoDownload } from '~/hooks/useVideoDownload';
import { useVideoSearch } from '~/hooks/useVideoSearch';
import { DownloadProgress } from '~/components/DownloadPogress';
import Animated, {
  Easing,
  BaseAnimationBuilder,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Skeleton } from '~/components/ui/skeleton';
import { downloadVideo, VideoInfo } from '~/api/youtube';

export default function Screen() {
  const inputRef = React.useRef<TextInput>(null);
  const [value, setValue] = React.useState('');
  const { isLoading: isSearching, error: searchError, videos, searchVideo } = useVideoSearch();

  const {
    isLoading: isDownloading,
    error: downloadError,
    currentVideo,
    handleDownload,
  } = useVideoDownload();

  const [showError, setShowError] = React.useState(false);
  const [url, setUrl] = React.useState('');

  // animation
  const duration = 2000;
  const easing = Easing.bezier(0.25, -0.5, 0.25, 1);
  const rotation = useSharedValue<number>(0);

  React.useEffect(() => {
    rotation.value = withRepeat(withTiming(1, { duration, easing }), -1);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 360}deg` }],
  }));

  React.useEffect(() => {
    if (searchError || downloadError) {
      setShowError(true);
    }
  }, [searchError, downloadError]);
  const handleDownloadAllVideos = async (videos: VideoInfo[]) => {
    try {
      for (const video of videos) {
        await handleDownload(video);
      }
    } catch (error) {
      setShowError(true);
    } finally {
    }
  };

  const onChangedText = (text: string) => {
    setValue(text);
  };

  return (
    <>
      <ScrollView className='flex-1'>
        <View className='flex-1 gap-6 p-6 w-full h-full'>
          <Label className='native:text-xl font-normal'>Download Url Video</Label>
          <View className='flex flex-row gap-6'>
            <Input
              className='flex-1'
              placeholder='Enter video URL'
              ref={inputRef}
              editable={!isSearching}
              onChangeText={onChangedText}
            />
            <Button
              className='w-14 native:h-14'
              variant='default'
              onPress={() => searchVideo(value)}
            >
              {isSearching ? (
                <Animated.View style={animatedStyle}>
                  <LoaderCircleIcon className='native:w-6 native:h-6 dark:text-zinc-900 text-white' />
                </Animated.View>
              ) : (
                <RefreshCw className='native:w-6 native:h-6 dark:text-zinc-900 text-white' />
              )}
            </Button>
          </View>

          {/* Results to fetching videos */}

          {isSearching && <Skeleton className='h-48 w-full' />}

          {videos && (
            <>
              <View className='relative flex items-center'>
                <Separator decorative={true} className='absolute w-full top-1/2' />
                <P className='px-4 bg-background relative z-10 text-zinc-400'>
                  Videos Result ({videos.length || 0})
                </P>
              </View>
              {Array.isArray(videos) && videos.length > 1 && !isSearching && (
                <Button
                  className='w-full native:h-14 items-center justify-center flex flex-row gap-2 animate-accordion-down '
                  variant='outline'
                  onPress={() => handleDownloadAllVideos(videos)}
                >
                  <P className='text-white'>Download all Videos</P>
                  <Download className='native:w-6 native:h-6 dark:text-white text-zinc-900' />
                </Button>
              )}

              {!isSearching && (
                <GridVideo
                  videos={videos}
                  onDownload={handleDownload}
                  isDownloading={isDownloading}
                />
              )}
            </>
          )}

          {/* DownloadProgress */}
          <DownloadProgress open={isDownloading} fileName={currentVideo?.title || ''} />
        </View>
      </ScrollView>

      <Dialog open={showError} onOpenChange={() => setShowError(false)}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogTitle className='text-center'>'Could not get video info.'</DialogTitle>
          <DialogDescription>
            An error occurred while trying to get the video info. Please try again later.
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='default' onPress={() => setShowError(false)}>
                <Text>OK</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
