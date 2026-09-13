import { create } from 'zustand';
import { ProcessingState } from '../types';

interface AppState {
  currentFile: File | null;
  processingState: ProcessingState;
  processingStage: string;
  processingProgress: number;
  error: string | null;
  recentTools: string[];
  
  setCurrentFile: (file: File | null) => void;
  setProcessingState: (state: ProcessingState) => void;
  setProcessingStage: (stage: string) => void;
  setProcessingProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  addRecentTool: (slug: string) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentFile: null,
  processingState: 'idle',
  processingStage: '',
  processingProgress: 0,
  error: null,
  recentTools: [],

  setCurrentFile: (file) => set({ currentFile: file }),
  setProcessingState: (state) => set({ processingState: state }),
  setProcessingStage: (stage) => set({ processingStage: stage }),
  setProcessingProgress: (progress) => set({ processingProgress: progress }),
  setError: (error) => set({ error }),
  addRecentTool: (slug) => set((state) => ({
    recentTools: [slug, ...state.recentTools.filter(t => t !== slug)].slice(0, 5)
  })),
  reset: () => set({
    currentFile: null,
    processingState: 'idle',
    processingStage: '',
    processingProgress: 0,
    error: null,
  }),
}));
