import { useState } from 'react';
import { getVideoInfo, VideoInfo } from '~/api/youtube';

interface SearchState {
  isLoading: boolean;
  error: string | null;
  videos: VideoInfo[] | null;
}

export function useVideoSearch() {
  const [state, setState] = useState<SearchState>({
    isLoading: false,
    error: null,
    videos: null,
  });

  const searchVideo = async (url: string) => {
    if (!isValidYoutubeUrl(url)) {
      setState(prev => ({
        ...prev,
        error: 'Invalid URL. Please enter a valid YouTube URL',
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const info = await getVideoInfo(url);
      setState(prev => ({ ...prev, videos: [info] }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to get video info',
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const isValidYoutubeUrl = (url: string) => {
    const validDomains = [
      'youtube.com',
      'youtu.be',
      'm.youtube.com',
      'music.youtube.com',
      'www.youtube.com',
      'gaming.youtube.com',
    ];
    return validDomains.some(domain => url.includes(domain));
  };

  return {
    ...state,
    searchVideo,
  };
}
