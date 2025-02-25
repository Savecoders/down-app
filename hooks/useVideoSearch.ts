import { useState } from 'react';
import { getPlaylistInfo, getVideoInfo, VideoInfo } from '~/api/youtube';

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

  // ...existing code...

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
        const videos = await getPlaylistInfo(list);
        if (videos && videos.length > 0) {
          setState(prev => ({ ...prev, videos, isLoading: false }));
          return;
        }
        // If we get here, playlist was empty or invalid - try as single video
      } catch (error) {
        // Don't set error yet - try as single video instead
        console.log('Playlist fetch failed, trying as single video:', error);
      }
    }

    // Try getting single video info
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
