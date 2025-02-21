import { View, Text, Image } from 'react-native';
import React from 'react';
import { Card, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Download } from '~/lib/icons/Download';

interface VideoProps {
  title: string;
  thumbnail: string;
  duration: string;
}

export default function CoverVideo({ title, thumbnail, duration }: VideoProps) {
  return (
    <Card className='p-1 m-0 rounded-xl'>
      <CardHeader className='flex flex-col gap-6'>
        <Image
          className='w-full h-44 bg-cover rounded-lg shadow-inherit drop-shadow-lg overflow-hidden'
          source={{
            uri: thumbnail,
          }}
          resizeMode='cover'
        />
        <View className='flex flex-row items-center justify-between'>
          <CardTitle className='flex-1'>{title}</CardTitle>
          <Button className='w-12' variant='ghost' onPress={() => {}}>
            <Download className='native:w-6 native:h-6 dark:text-zinc-400 text-zinc-900' />
          </Button>
        </View>
      </CardHeader>
    </Card>
  );
}
