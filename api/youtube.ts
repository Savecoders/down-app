import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const API_BASE_URL = 'http://192.168.100.15:3000';

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  url: string;
}

export async function getVideoInfo(url: string): Promise<VideoInfo> {
  try {
    const url_with_api = `${API_BASE_URL}/api/info?url=${url}`;
    console.log('url_with_api', url_with_api);
    const video = await fetch(url_with_api, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    console.log('video', video);
    const videoInfo = await video.json();
    return {
      title: videoInfo.title,
      thumbnail: videoInfo.thumbnail,
      duration: videoInfo.duration,
      url: videoInfo.url,
    };
  } catch (error) {
    console.log('error', error);
    throw new Error(`Failed to get video info: ${error}`);
  }
}

export async function getPlaylistInfo(url: string): Promise<VideoInfo[]> {
  try {
    const playlist = await fetch(`${API_BASE_URL}/api/list/info?url=${url}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return playlist.json();
  } catch (error) {
    throw new Error(`Failed to get playlist info: ${error}`);
    return [];
  }
}

export async function downloadVideo(
  url: string,
  onProgress?: (progress: number) => void,
): Promise<void> {
  let downloadResumable: FileSystem.DownloadResumable | null = null;

  try {
    // Initialize progress
    onProgress?.(0);

    // grant permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Se necesitan permisos para guardar el video');
    }

    const videoInfo = await getVideoInfo(url);
    const downloadUrl = `${API_BASE_URL}/api/download?url=${encodeURIComponent(url)}`;
    const filename = videoInfo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    // download temp file
    const fileUri = `${FileSystem.cacheDirectory}${filename}.mp4`;

    downloadResumable = FileSystem.createDownloadResumable(
      downloadUrl,
      fileUri,
      {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        cache: false, // Disable caching to ensure proper progress tracking
      },
      downloadProgress => {
        const { totalBytesWritten, totalBytesExpectedToWrite } = downloadProgress;

        // Only update progress if we have valid values
        if (totalBytesExpectedToWrite > 0 && totalBytesWritten > 0) {
          const progress = (totalBytesWritten / totalBytesExpectedToWrite) * 100;
          const safeProgress = Math.min(Math.max(progress, 0), 100);

          // Update progress callback
          onProgress?.(safeProgress);

          // Log progress for debugging
          console.log(`Progress: ${safeProgress.toFixed(2)}%`);
          console.log(`Bytes: ${totalBytesWritten}/${totalBytesExpectedToWrite}`);
        }
      },
    );

    // Start download and wait for completion
    const { uri: downloadedUri } = (await downloadResumable.downloadAsync()) || {};

    if (!downloadedUri) {
      throw new Error('La descarga no se completó correctamente.');
    }

    // Update progress to indicate file processing
    onProgress?.(95);

    // move file to Downloads
    const asset = await MediaLibrary.createAssetAsync(downloadedUri);
    await MediaLibrary.createAlbumAsync('Downloads', asset, false);

    // Clean up temp file
    await FileSystem.deleteAsync(downloadedUri);

    // Signal full completion
    onProgress?.(100);
    console.log('Video guardado en Descargas:', asset.uri);
  } catch (error) {
    // Reset progress on error
    onProgress?.(0);

    // Cancel download if in progress
    if (downloadResumable) {
      try {
        await downloadResumable.pauseAsync();
      } catch (pauseError) {
        console.error('Error al cancelar la descarga:', pauseError);
      }
    }

    const message = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error al descargar el video: ${message}`);
  }
}

export interface DownloadProgressData {
  totalBytesWritten: number;
  totalBytesExpectedToWrite: number;
}

export type ProgressCallback = (progress: number) => void;
