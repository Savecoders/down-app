import { View, Text } from 'react-native';
import React from 'react';
import CoverVideo from './CoverVideo';
import { VideoInfo } from '~/api/youtube';

interface GridVideoProps {
  videos: VideoInfo[];
  onDownload: (video: VideoInfo) => Promise<void>;
  isDownloading?: boolean;
}

export default function GridVideo({ videos, onDownload, isDownloading }: GridVideoProps) {
  return (
    <View className='flex flex-col gap-8'>
      {/* <CoverVideo
        title='Neovaii - Feel Better'
        thumbnail='https://i.ytimg.com/vi/fEgn87WTj68/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBq41cOjW9Qgqehhiab1RYj22olYw'
        duration='3:47'
      /> */}
      {videos.map((video, index) => (
        <CoverVideo
          key={index}
          title={video.title}
          thumbnail={video.thumbnail}
          duration={video.duration}
          url={video.url}
          onDownload={onDownload}
          isDownloading={isDownloading}
        />
      ))}
    </View>
  );
}
