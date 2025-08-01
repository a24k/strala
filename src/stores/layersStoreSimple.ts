import { create } from 'zustand';

// Complete layer interface matching original implementation
interface SimpleLayer {
  id: string;
  name: string;
  visible: boolean;
  connectionType: 'single-point' | 'two-point';
  startPoint: number;
  stepSize: number;
  color: {
    type: 'solid' | 'gradient';
    primary: string;
    secondary?: string;
    alpha: number;
  };
  lineWidth: number;
  // Two-point properties
  pointA: {
    initialPosition: number;
    stepSize: number;
  };
  pointB: {
    relativeOffset: number;
    stepSize: number;
  };
  maxIterations: number;
}

// Simplified default for testing two-point logic
function createDefaultLayers(): SimpleLayer[] {
  return [
    {
      id: 'layer-1',
      name: 'Two-Point Test',
      visible: true,
      connectionType: 'two-point',
      startPoint: 0, // For compatibility
      stepSize: 1,   // For compatibility
      pointA: {
        initialPosition: 0,
        stepSize: 3
      },
      pointB: {
        relativeOffset: 10,
        stepSize: 5
      },
      maxIterations: 20,
      color: {
        type: 'solid',
        primary: '#3b82f6',
        alpha: 0.8
      },
      lineWidth: 1
    }
  ];
}

interface LayersState {
  layers: SimpleLayer[];
  activeLayerId: string | null;
  
  addLayer: () => void;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<SimpleLayer>) => void;
  duplicateLayer: (id: string) => void;
  setActiveLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  moveLayerUp: (id: string) => void;
  moveLayerDown: (id: string) => void;
  resetToDefaults: () => void;
}

export const useLayersStoreSimple = create<LayersState>((set, get) => ({
  layers: createDefaultLayers(),
  activeLayerId: 'layer-1',
  
  addLayer: () => {
    const currentLayers = get().layers;
    const newLayer: SimpleLayer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${currentLayers.length + 1}`,
      visible: true,
      connectionType: 'single-point',
      startPoint: 0,
      stepSize: 5,
      color: {
        type: 'solid',
        primary: '#ffffff',
        alpha: 0.7
      },
      lineWidth: 1,
      pointA: {
        initialPosition: 0,
        stepSize: 7
      },
      pointB: {
        relativeOffset: 12,
        stepSize: 7
      },
      maxIterations: 24
    };
    
    set((state) => ({
      layers: [...state.layers, newLayer],
      activeLayerId: newLayer.id
    }));
  },
  
  removeLayer: (id) => {
    const currentLayers = get().layers;
    if (currentLayers.length <= 1) return;
    
    set((state) => {
      const newLayers = state.layers.filter(layer => layer.id !== id);
      const newActiveId = state.activeLayerId === id 
        ? (newLayers[0]?.id || null)
        : state.activeLayerId;
        
      return {
        layers: newLayers,
        activeLayerId: newActiveId
      };
    });
  },
  
  updateLayer: (id, updates) => {
    set((state) => ({
      layers: state.layers.map(layer =>
        layer.id === id ? { ...layer, ...updates } : layer
      )
    }));
  },
  
  duplicateLayer: (id) => {
    const currentLayers = get().layers;
    const index = currentLayers.findIndex(layer => layer.id === id);
    if (index === -1) return;
    
    const originalLayer = currentLayers[index];
    const duplicatedLayer: SimpleLayer = {
      ...originalLayer,
      id: `layer-${Date.now()}`,
      name: `${originalLayer.name} Copy`
    };
    
    set((state) => {
      const newLayers = [...state.layers];
      newLayers.splice(index + 1, 0, duplicatedLayer);
      return {
        layers: newLayers,
        activeLayerId: duplicatedLayer.id
      };
    });
  },
  
  setActiveLayer: (id) => {
    const currentLayers = get().layers;
    if (currentLayers.some(layer => layer.id === id)) {
      set({ activeLayerId: id });
    }
  },
  
  toggleLayerVisibility: (id) => {
    set((state) => ({
      layers: state.layers.map(layer =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      )
    }));
  },
  
  moveLayerUp: (id) => {
    const currentLayers = get().layers;
    const index = currentLayers.findIndex(layer => layer.id === id);
    if (index > 0) {
      set((state) => {
        const newLayers = [...state.layers];
        [newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]];
        return { layers: newLayers };
      });
    }
  },
  
  moveLayerDown: (id) => {
    const currentLayers = get().layers;
    const index = currentLayers.findIndex(layer => layer.id === id);
    if (index >= 0 && index < currentLayers.length - 1) {
      set((state) => {
        const newLayers = [...state.layers];
        [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
        return { layers: newLayers };
      });
    }
  },
  
  resetToDefaults: () => {
    set({
      layers: createDefaultLayers(),
      activeLayerId: 'layer-1'
    });
  }
}));

// Selector hooks
export const useActiveLayerSimple = () => {
  return useLayersStoreSimple((state) => 
    state.layers.find(layer => layer.id === state.activeLayerId) || null
  );
};

export const useVisibleLayersSimple = () => {
  return useLayersStoreSimple((state) => 
    state.layers.filter(layer => layer.visible)
  );
};