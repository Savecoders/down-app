import { View, Text } from 'react-native';
import React from 'react';
import CoverVideo from './CoverVideo';
import { VideoInfo } from '~/core/youtube';

interface GridVideoProps {
  videos: VideoInfo[];
}

export default function GridVideo({ videos }: GridVideoProps) {
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
        />
      ))}
    </View>
  );
}
