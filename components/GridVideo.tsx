import { View, Text } from 'react-native';
import React from 'react';
import CoverVideo from './CoverVideo';

export default function GridVideo() {
  return (
    <View className='flex flex-col gap-8'>
      <CoverVideo
        title='Neovaii - Feel Better'
        thumbnail='https://i.ytimg.com/vi/fEgn87WTj68/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBq41cOjW9Qgqehhiab1RYj22olYw'
        duration='3:47'
      />
      <CoverVideo
        title=' ⚡️Era el ASESINO MÁS FUERTE pero se CONVIRTIÓ en UN PADRE de FAMILIA | SAKAMOTO DAYS TEMPORADA 1 '
        thumbnail='https://via.placeholder.com/150'
        duration='10:00'
      />
      <CoverVideo title='Title' thumbnail='https://via.placeholder.com/150' duration='10:00' />
    </View>
  );
}
