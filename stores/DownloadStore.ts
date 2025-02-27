import { create } from 'zustand';

interface DownloadState {
  progress: number;
  setProgress: (progress: number) => void;
}

export const useDownloadStore = create<DownloadState>(set => ({
  progress: 0,
  setProgress: (progress: number) => set({ progress }),
}));
