import { useCanvasStoreSimple } from '../stores/canvasStoreSimple';
import { useLayersStoreSimple, useActiveLayerSimple } from '../stores/layersStoreSimple';
import { SimpleColorPicker } from './ui/ColorPicker';
import { SLIDER_CLASSES } from './ui/sliderStyles';

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
          <>
            {/* Start Point */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-100 w-20">
                Start
              </label>
              <div className="flex items-center gap-2 flex-1">
                <input 
                  type="range" 
                  min="0" 
                  max={config.circlePoints - 1} 
                  value={activeLayer.startPoint}
                  onChange={(e) => updateLayer(activeLayer.id, { startPoint: parseInt(e.target.value) })}
                  className={SLIDER_CLASSES}
                />
                <input 
                  type="number" 
                  min="0" 
                  max={config.circlePoints - 1} 
                  value={activeLayer.startPoint}
                  onChange={(e) => updateLayer(activeLayer.id, { startPoint: parseInt(e.target.value) })}
                  className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {/* Step Size */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-100 w-20">
                Step
              </label>
              <div className="flex items-center gap-2 flex-1">
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={activeLayer.stepSize}
                  onChange={(e) => updateLayer(activeLayer.id, { stepSize: parseInt(e.target.value) })}
                  className={SLIDER_CLASSES}
                />
                <input 
                  type="number" 
                  min="1" 
                  max="50" 
                  value={activeLayer.stepSize}
                  onChange={(e) => updateLayer(activeLayer.id, { stepSize: parseInt(e.target.value) })}
                  className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
          </>
        )}

        {/* Two-point controls */}
        {activeLayer.connectionType === 'two-point' && (
          <>
            {/* Point A Position */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-100 w-20">
                A: Position
              </label>
              <div className="flex items-center gap-2 flex-1">
                <input 
                  type="range" 
                  min="0" 
                  max={config.circlePoints - 1} 
                  value={activeLayer.pointA.initialPosition}
                  onChange={(e) => updateLayer(activeLayer.id, { 
                    pointA: { ...activeLayer.pointA, initialPosition: parseInt(e.target.value) }
                  })}
                  className={SLIDER_CLASSES}
                />
                <input 
                  type="number" 
                  min="0" 
                  max={config.circlePoints - 1} 
                  value={activeLayer.pointA.initialPosition}
                  onChange={(e) => updateLayer(activeLayer.id, { 
                    pointA: { ...activeLayer.pointA, initialPosition: parseInt(e.target.value) }
                  })}
                  className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {/* Point A Step */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-100 w-20">
                A: Step
              </label>
              <div className="flex items-center gap-2 flex-1">
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={activeLayer.pointA.stepSize}
                  onChange={(e) => updateLayer(activeLayer.id, { 
                    pointA: { ...activeLayer.pointA, stepSize: parseInt(e.target.value) }
                  })}
                  className={SLIDER_CLASSES}
                />
                <input 
                  type="number" 
                  min="1" 
                  max="50" 
                  value={activeLayer.pointA.stepSize}
                  onChange={(e) => updateLayer(activeLayer.id, { 
                    pointA: { ...activeLayer.pointA, stepSize: parseInt(e.target.value) }
                  })}
                  className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {/* Point B Offset */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-100 w-20">
                B: Offset
              </label>
              <div className="flex items-center gap-2 flex-1">
                <input 
                  type="range" 
                  min="0" 
                  max={config.circlePoints - 1} 
                  value={activeLayer.pointB.relativeOffset}
                  onChange={(e) => updateLayer(activeLayer.id, { 
                    pointB: { ...activeLayer.pointB, relativeOffset: parseInt(e.target.value) }
                  })}
                  className={SLIDER_CLASSES}
                />
                <input 
                  type="number" 
                  min="0" 
                  max={config.circlePoints - 1} 
                  value={activeLayer.pointB.relativeOffset}
                  onChange={(e) => updateLayer(activeLayer.id, { 
                    pointB: { ...activeLayer.pointB, relativeOffset: parseInt(e.target.value) }
                  })}
                  className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {/* Point B Step */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-100 w-20">
                B: Step
              </label>
              <div className="flex items-center gap-2 flex-1">
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={activeLayer.pointB.stepSize}
                  onChange={(e) => updateLayer(activeLayer.id, { 
                    pointB: { ...activeLayer.pointB, stepSize: parseInt(e.target.value) }
                  })}
                  className={SLIDER_CLASSES}
                />
                <input 
                  type="number" 
                  min="1" 
                  max="50" 
                  value={activeLayer.pointB.stepSize}
                  onChange={(e) => updateLayer(activeLayer.id, { 
                    pointB: { ...activeLayer.pointB, stepSize: parseInt(e.target.value) }
                  })}
                  className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {/* Max Iterations */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-100 w-20">
                Max Iter
              </label>
              <div className="flex items-center gap-2 flex-1">
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={activeLayer.maxIterations}
                  onChange={(e) => updateLayer(activeLayer.id, { maxIterations: parseInt(e.target.value) })}
                  className={SLIDER_CLASSES}
                />
                <input 
                  type="number" 
                  min="1" 
                  max="100" 
                  value={activeLayer.maxIterations}
                  onChange={(e) => updateLayer(activeLayer.id, { maxIterations: parseInt(e.target.value) })}
                  className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
          </>
        )}

        {/* Opacity */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-100 w-20">
            Opacity (%)
          </label>
          <div className="flex items-center gap-2 flex-1">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={Math.round(activeLayer.color.alpha * 100)}
              onChange={(e) => updateLayer(activeLayer.id, { 
                color: { ...activeLayer.color, alpha: parseInt(e.target.value) / 100 }
              })}
              className={SLIDER_CLASSES}
            />
            <input 
              type="number" 
              min="0" 
              max="100" 
              value={Math.round(activeLayer.color.alpha * 100)}
              onChange={(e) => updateLayer(activeLayer.id, { 
                color: { ...activeLayer.color, alpha: parseInt(e.target.value) / 100 }
              })}
              className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* Line Width */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-100 w-20">
            Width (px)
          </label>
          <div className="flex items-center gap-2 flex-1">
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={activeLayer.lineWidth}
              onChange={(e) => updateLayer(activeLayer.id, { lineWidth: parseInt(e.target.value) })}
              className={SLIDER_CLASSES}
            />
            <input 
              type="number" 
              min="1" 
              max="10" 
              value={activeLayer.lineWidth}
              onChange={(e) => updateLayer(activeLayer.id, { lineWidth: parseInt(e.target.value) })}
              className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* Color Type */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-100 w-20">
            Type
          </label>
          <div className="flex-1 relative">
            <select 
              value={activeLayer.color.type}
              onChange={(e) => updateLayer(activeLayer.id, { 
                color: { ...activeLayer.color, type: e.target.value as 'solid' | 'gradient' }
              })}
              className="w-full h-8 px-2 pr-8 text-sm rounded border bg-strala-border border-strala-accent text-strala-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="solid">Solid</option>
              <option value="gradient">Gradient</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Primary Color */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-100 w-20">
            Color
          </label>
          <div className="flex items-center gap-2 flex-1">
            <input 
              type="color" 
              value={activeLayer.color.primary}
              onChange={(e) => updateLayer(activeLayer.id, { 
                color: { ...activeLayer.color, primary: e.target.value }
              })}
              className="w-8 h-8 rounded border border-gray-400 cursor-pointer"
              style={{ padding: 0, outline: 'none', appearance: 'none', WebkitAppearance: 'none' }}
            />
            <input 
              type="text" 
              value={activeLayer.color.primary}
              onChange={(e) => updateLayer(activeLayer.id, { 
                color: { ...activeLayer.color, primary: e.target.value }
              })}
              className="w-20 h-8 px-2 text-xs rounded border font-mono bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="#000000"
            />
            <button 
              className="w-8 h-8 rounded text-sm font-bold transition-all bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => {
                console.log('Color harmony generation');
              }}
              title="Generate color harmony"
            >
              ⚸
            </button>
          </div>
        </div>

        {/* Secondary Color (for gradients) */}
        {activeLayer.color.type === 'gradient' && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-100 w-20">
              Color 2
            </label>
            <div className="flex items-center gap-2 flex-1">
              <SimpleColorPicker
                value={activeLayer.color.secondary || '#f39c12'}
                onChange={(value) => updateLayer(activeLayer.id, { 
                  color: { ...activeLayer.color, secondary: value }
                })}
              />
              <input 
                type="text" 
                value={activeLayer.color.secondary || '#f39c12'}
                onChange={(e) => updateLayer(activeLayer.id, { 
                  color: { ...activeLayer.color, secondary: e.target.value }
                })}
                className="w-20 h-8 px-2 text-xs rounded border font-mono bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="#000000"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}