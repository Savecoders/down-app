import { View, Image } from 'react-native';
import React from 'react';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Download } from '~/lib/icons/Download';
import type { VideoInfo } from '~/api/youtube';

interface VideoProps {
  title: string;
  thumbnail: string;
  duration: string;
  url: string;
  onDownload: (video: VideoInfo) => Promise<void>;
  isDownloading?: boolean;
}

export default function CoverVideo({
  title,
  thumbnail,
  duration,
  url,
  onDownload,
  isDownloading,
}: VideoProps) {
  return (
    <Card className='p-1 m-0 rounded-xl'>
      <CardHeader className='flex flex-col gap-6'>
        <Image
          className='w-full h-44 bg-cover rounded-lg shadow-inherit drop-shadow-lg overflow-hidden'
          source={{ uri: thumbnail }}
          resizeMode='cover'
        />
        <View className='flex flex-row items-center justify-between'>
          <CardTitle className='flex-1'>{title}</CardTitle>
          <Button
            className='w-12'
            variant='ghost'
            disabled={isDownloading}
            onPress={() => onDownload({ title, thumbnail, duration, url })}
          >
            <Download className='native:w-6 native:h-6 dark:text-zinc-400 text-zinc-900' />
          </Button>
        </View>
      </CardHeader>
    </Card>
  );
}
