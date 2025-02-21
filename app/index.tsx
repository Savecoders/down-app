import * as React from 'react';
import { Image, Text, TextInput, View, ScrollView } from 'react-native';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Download } from '../lib/icons/Download';
import { Search } from '../lib/icons/Search';
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

interface VideoMetadata {
  title: string;
  thumbnail: string;
  duration: string;
}

export default function Screen() {
  const inputRef = React.useRef<TextInput>(null);
  const [value, setValue] = React.useState('');

  const handleDownload = () => {
    const url = value;
    if (!url) {
      inputRef.current?.focus();
      return;
    }
    // validate url yt or instagram
    const validatesUrls = ['youtube.com', 'youtu.be'];
    const isValid = validatesUrls.some(v => url.includes(v));
    if (!isValid) {
      console.log('Invalid url');
      return;
    }
    console.log('Downloading...', url);
  };

  const onChangedText = (text: string) => {
    setValue(text);
  };

  return (
    <ScrollView className='flex-1'>
      <View className='flex-1 gap-6 p-6 w-full h-full'>
        <Label className='native:text-2xl'>Download Url Video</Label>
        <View className='flex flex-row gap-6'>
          <Input
            className='flex-1'
            placeholder='https://'
            ref={inputRef}
            onChangeText={onChangedText}
          />
          <Button className='w-14 native:h-14' variant='default' onPress={handleDownload}>
            <Search className='native:w-6 native:h-6 dark:text-zinc-900 text-white' />
          </Button>
        </View>
        <View className='relative flex items-center'>
          <Separator decorative={true} className='absolute w-full top-1/2' />
          <P className='px-4 bg-background relative z-10 text-zinc-400'>Videos Result (1)</P>
        </View>

        <GridVideo />
      </View>
    </ScrollView>
  );
}
