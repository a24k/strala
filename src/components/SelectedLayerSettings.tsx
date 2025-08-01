import { useCanvasStoreSimple } from '../stores/canvasStoreSimple';
import { useLayersStoreSimple, useActiveLayerSimple } from '../stores/layersStoreSimple';
import { SinglePointSettings } from './settings/SinglePointSettings';
import { TwoPointSettings } from './settings/TwoPointSettings';
import { LayerAppearanceSettings } from './settings/LayerAppearanceSettings';

export function SelectedLayerSettings() {
  const { config } = useCanvasStoreSimple();
  const { updateLayer } = useLayersStoreSimple();
  const activeLayer = useActiveLayerSimple();

  if (!activeLayer) return null;

  return (
    <div className="flex-shrink-0 px-4 py-3 border-t border-gray-600 bg-slate-800">
      <h2 className="text-lg font-semibold mb-4 mt-0 text-gray-100">
        Selected Layer Settings
      </h2>
      
      {/* Controls Container */}
      <div className="space-y-2">
        
        {/* Layer Name */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-100 w-20">
            Name
          </label>
          <input
            type="text"
            value={activeLayer.name}
            onChange={(e) => updateLayer(activeLayer.id, { name: e.target.value })}
            className="flex-1 h-8 px-2 text-sm rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Layer name"
          />
        </div>
        
        {/* Connection Type */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-100 w-20">
            Connection
          </label>
          <div className="flex-1 relative">
            <select 
              value={activeLayer.connectionType}
              onChange={(e) => updateLayer(activeLayer.id, { 
                connectionType: e.target.value as 'single-point' | 'two-point' 
              })}
              className="w-full h-8 px-2 pr-8 text-sm rounded border bg-strala-border border-strala-accent text-strala-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="single-point">Single Point</option>
              <option value="two-point">Two Point</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Single-point controls */}
        {activeLayer.connectionType === 'single-point' && (
          <SinglePointSettings
            startPoint={activeLayer.startPoint}
            stepSize={activeLayer.stepSize}
            maxPoints={config.circlePoints}
            onUpdateStartPoint={(value) => updateLayer(activeLayer.id, { startPoint: value })}
            onUpdateStepSize={(value) => updateLayer(activeLayer.id, { stepSize: value })}
          />
        )}

        {/* Two-point controls */}
        {activeLayer.connectionType === 'two-point' && (
          <TwoPointSettings
            pointA={activeLayer.pointA}
            pointB={activeLayer.pointB}
            iterations={activeLayer.iterations}
            maxPoints={config.circlePoints}
            onUpdatePointA={(updates) => updateLayer(activeLayer.id, { 
              pointA: { ...activeLayer.pointA, ...updates }
            })}
            onUpdatePointB={(updates) => updateLayer(activeLayer.id, { 
              pointB: { ...activeLayer.pointB, ...updates }
            })}
            onUpdateIterations={(value) => updateLayer(activeLayer.id, { iterations: value })}
          />
        )}

        {/* Appearance Settings */}
        <LayerAppearanceSettings
          color={activeLayer.color}
          lineWidth={activeLayer.lineWidth}
          onUpdateColor={(updates) => updateLayer(activeLayer.id, { 
            color: { ...activeLayer.color, ...updates }
          })}
          onUpdateLineWidth={(value) => updateLayer(activeLayer.id, { lineWidth: value })}
        />
      </div>
    </div>
  );
}