import { useState } from 'react';
import { downloadVideo, VideoInfo } from '~/api/youtube';

interface DownloadState {
  isLoading: boolean;
  progress: number;
  error: string | null;
  currentVideo: VideoInfo | null;
}

export function useVideoDownload() {
  const [state, setState] = useState<DownloadState>({
    isLoading: false,
    progress: 0,
    error: null,
    currentVideo: null,
  });

  const handleDownload = async (video: VideoInfo) => {
    if (state.isLoading) return; // Prevent multiple downloads

    setState(prev => ({
      ...prev,
      isLoading: true,
      currentVideo: video,
      error: null,
      progress: 0,
    }));

    try {
      await downloadVideo(video.url, progress => {
        setState(prev => ({
          ...prev,
          progress: Math.max(0, Math.min(progress, 100)),
        }));
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to download video',
      }));
    } finally {
      setState(prev => ({
        ...prev,
        isLoading: false,
        progress: 0,
        currentVideo: null,
      }));
    }
  };

  return {
    ...state,
    handleDownload,
  };
}
