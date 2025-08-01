import { useLayersStoreSimple } from '../stores/layersStoreSimple';
import { LayerCard } from './ui/LayerCard';
import { Plus, Copy, X } from 'lucide-react';

export function LayersList() {
  const { 
    layers, 
    activeLayerId, 
    setActiveLayer, 
    addLayer, 
    duplicateLayer,
    removeLayer,
    toggleLayerVisibility,
    moveLayerUp,
    moveLayerDown
  } = useLayersStoreSimple();

  return (
    <div className="flex-1 flex flex-col overflow-hidden px-4 py-2">
      {/* Layers Header */}
      <div className="flex items-center justify-between mb-1 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-100 leading-tight">
          Layers
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={addLayer}
            className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold transition-all bg-blue-500/80 hover:bg-blue-500 border border-blue-400/50 hover:border-blue-400"
            title="Add new layer"
          >
            <Plus size={16} />
          </button>
          <button 
            onClick={() => activeLayerId && duplicateLayer(activeLayerId)}
            disabled={!activeLayerId}
            className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold transition-all bg-purple-500/80 hover:bg-purple-500 border border-purple-400/50 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Duplicate selected layer"
          >
            <Copy size={16} />
          </button>
          <button 
            onClick={() => activeLayerId && removeLayer(activeLayerId)}
            disabled={!activeLayerId || layers.length <= 1}
            className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold transition-all bg-red-500/80 hover:bg-red-500 border border-red-400/50 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete selected layer"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {/* Layers List - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {layers.map((layer, index) => (
          <LayerCard
            key={layer.id}
            name={layer.name}
            visible={layer.visible}
            isActive={layer.id === activeLayerId}
            connectionType={layer.connectionType}
            startPoint={layer.startPoint}
            stepSize={layer.stepSize}
            pointA={layer.pointA}
            pointB={layer.pointB}
            alpha={layer.color.alpha}
            lineWidth={layer.lineWidth}
            color={layer.color}
            canMoveUp={index > 0}
            canMoveDown={index < layers.length - 1}
            onClick={() => setActiveLayer(layer.id)}
            onToggleVisibility={() => toggleLayerVisibility(layer.id)}
            onMoveUp={() => moveLayerUp(layer.id)}
            onMoveDown={() => moveLayerDown(layer.id)}
          />
        ))}
      </div>
    </div>
  );
}