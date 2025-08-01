import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppConfig } from '../types';
import { STORAGE_KEYS, detectAndMigrateLegacyData, setSchemaVersion } from '../utils/persistence';

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

export const useCanvasStoreSimple = create<CanvasState>()(
  persist(
    (set) => {
      // Check for legacy data on initialization
      const legacyData = detectAndMigrateLegacyData();
      const initialConfig = legacyData?.config || defaultConfig;
      
      // Set schema version
      setSchemaVersion();
      
      return {
        config: initialConfig,
        
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
      };
    },
    {
      name: STORAGE_KEYS.config,
      version: 1,
      // Debounced writes (500ms) for performance
      partialize: (state) => ({ config: state.config }),
    }
  )
);