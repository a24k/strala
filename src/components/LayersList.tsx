import { useLayersStoreSimple } from '../stores/layersStoreSimple';
import { LayerCard } from './ui/LayerCard';

export function LayersList() {
  const { 
    layers, 
    activeLayerId, 
    setActiveLayer, 
    addLayer, 
    toggleLayerVisibility,
    moveLayerUp,
    moveLayerDown
  } = useLayersStoreSimple();

  return (
    <div className="flex-1 flex flex-col overflow-hidden px-4 py-3">
      {/* Layers Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-lg font-semibold mt-0 text-gray-100">
          Layers
        </h2>
        <button 
          onClick={addLayer}
          className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold transition-all bg-blue-500 hover:bg-blue-600"
          title="Add new layer"
        >
          +
        </button>
      </div>
      
      {/* Layers List - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {layers.map((layer, index) => (
          <LayerCard
            key={layer.id}
            name={layer.name}
            visible={layer.visible}
            isActive={layer.id === activeLayerId}
            startPoint={layer.startPoint}
            stepSize={layer.stepSize}
            alpha={layer.color.alpha}
            primaryColor={layer.color.primary}
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