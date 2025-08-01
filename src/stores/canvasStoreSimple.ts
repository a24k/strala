import { create } from 'zustand';
import type { AppConfig } from '../types';

// "Luminous Mandala" default configuration - high resolution cosmic theme
const defaultConfig: AppConfig = {
  circlePoints: 54,
  backgroundColor: '#0a0a18',
  showPointNumbers: true,
  rotation: 0,
  canvasSize: {
    width: 800,
    height: 800
  }
};

interface CanvasState {
  config: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => void;
  updateCanvasSize: (size: { width: number; height: number }) => void;
  resetConfig: () => void;
}

export const useCanvasStoreSimple = create<CanvasState>((set) => ({
  config: defaultConfig,
  
  updateConfig: (updates) => {
    set((state) => ({
      config: { ...state.config, ...updates }
    }));
  },
  
  updateCanvasSize: (size) => {
    set((state) => ({
      config: {
        ...state.config,
        canvasSize: size
      }
    }));
  },
  
  resetConfig: () => {
    set({ config: defaultConfig });
  }
}));