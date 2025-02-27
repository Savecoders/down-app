import { useDownloadStore } from '~/stores/DownloadStore';
import { downloadVideo, VideoInfo } from '~/api/youtube';
import React from 'react';

export function useVideoDownload() {
  const setProgress = useDownloadStore(state => state.setProgress);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = React.useState<VideoInfo | null>(null);

  const handleDownload = async (video: VideoInfo) => {
    if (isLoading) return;
    setIsLoading(true);
    setCurrentVideo(video);
    setError(null);
    setProgress(0);

    try {
      await downloadVideo(video.url, progress => {
        setProgress(Math.max(0, Math.min(progress, 100)));
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to download video');
    } finally {
      setIsLoading(false);
      setCurrentVideo(null);
    }
  };

  return {
    isLoading,
    error,
    currentVideo,
    handleDownload,
  };
}
