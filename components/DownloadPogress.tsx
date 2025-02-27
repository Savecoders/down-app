import * as React from 'react';
import { Text } from 'react-native';
import { useDownloadStore } from '~/stores/DownloadStore';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { H4 } from './ui/typography';
import Animated, { FadeInUp, FadeOutDown, LayoutAnimationConfig } from 'react-native-reanimated';

interface DownloadProgressProps {
  open: boolean;
  fileName: string;
  onCancel?: () => void;
}
export function DownloadProgress({ open, fileName }: DownloadProgressProps) {
  const progress = useDownloadStore(state => state.progress);
  const safeProgress = Math.max(0, Math.min(progress, 100));

  const getStatus = (progress: number) => {
    if (progress === 0) return 'Preparing...';
    if (progress === 100) return 'Completed';
    if (progress >= 95) return 'Processing...';
    return 'Downloading...';
  };

  const displayName = React.useMemo(() => {
    return fileName.length > 50 ? fileName.substring(0, 47) + '...' : fileName;
  }, [fileName]);

  return (
    <Dialog open={open}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogTitle>{getStatus(safeProgress)}</DialogTitle>
        <DialogDescription className='flex flex-col space-y-4 max-h-40'>
          <H4 className='text-muted-foreground'>{displayName}</H4>
          <Progress value={safeProgress} className='flex-1 h-2' indicatorClassName='bg-sky-600' />
        </DialogDescription>
        <DialogFooter>
          <LayoutAnimationConfig skipEntering>
            <Animated.View
              key={safeProgress}
              entering={FadeInUp}
              exiting={FadeOutDown}
              className='w-11 items-center'
            >
              <Text className='text-sm font-bold text-sky-600 py-4'>{safeProgress}%</Text>
            </Animated.View>
          </LayoutAnimationConfig>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
