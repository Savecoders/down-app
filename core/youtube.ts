import ytdl from '@distube/ytdl-core';
import * as RNFS from 'react-native-fs';
import ytpl from '@distube/ytpl';
import RNFSB from 'react-native-blob-util';

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  formats: ytdl.videoFormat[];
}

function getDurationSecondsFormat(lengthSeconds: string): string {
  const durationInSeconds = parseInt(lengthSeconds);
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export async function getVideoInfo(url: string): Promise<VideoInfo> {
  try {
    const info = await ytdl.getInfo(url);
    // Get video duration in seconds and convert to MM:SS format
    const duration = `${getDurationSecondsFormat(info.videoDetails.lengthSeconds)}`;

    return {
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0].url,
      duration: duration,
      formats: info.formats,
    };
  } catch (error) {
    throw new Error(`Failed to get video info: ${error}`);
  }
}

export async function getPlaylistInfo(url: string): Promise<VideoInfo[]> {
  try {
    const isList = url.includes('list=');
    const playlist = await ytpl(url);
    const wrappedVideos = playlist.items.map(video => {
      return {
        title: video.title,
        thumbnail: video.thumbnail,
        duration: video.duration,
        formats: [],
      };
    });
    return wrappedVideos as VideoInfo[];
  } catch (error) {
    throw new Error(`Failed to get playlist info: ${error}`);
    return [];
  }
}

export async function downloadVideo(
  url: string,
  formats: ytdl.videoFormat,
  title: string,
): Promise<void> {
  try {
    const videoTitle = title;
    const format = ytdl.chooseFormat(formats, {
      quality: 'highest',
      filter: 'audioandvideo',
    });
    const videoUrl = url;
    const fileName = `${videoTitle}_${format.qualityLabel}.mp4`;
    const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    await RNFSB.config({ path: filePath }).fetch('GET', videoUrl);
  } catch (error) {
    throw new Error(`Failed to download video: ${error}`);
  }
}
