import { useState } from 'react';
import { getPlaylistInfo, getVideoInfo, VideoInfo } from '~/api/youtube';

interface SearchState {
  isLoading: boolean;
  error: string | null;
  videos: VideoInfo[] | null;
}

export function useVideoSearch() {
  let isSearchPlatlist = false;
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

    if (url.includes('playlist') || url.includes('list')) {
      try {
        const list = new URL(url).searchParams.get('list');
        if (!list) {
          throw new Error('Invalid playlist URL');
        }
        const videosList = await getPlaylistInfo(list);
        if (videosList && videosList.length > 0) {
          setState(prev => ({ ...prev, videos: videosList, isLoading: false, error: null }));
          isSearchPlatlist = true;
          return;
        }
      } catch (error) {
        console.log('Playlist fetch failed, trying as single video:', error);
      }
    }

    if (!isSearchPlatlist) {
      try {
        const info = await getVideoInfo(url);
        setState(prev => ({
          ...prev,
          videos: [info],
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to get video info',
          isLoading: false,
          videos: null,
        }));
      }
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
