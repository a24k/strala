import { create } from 'zustand';
import type { AppConfig } from '../types';

// Default configuration - matching main branch values
const defaultConfig: AppConfig = {
  circlePoints: 24,
  backgroundColor: '#1a1a2e',
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