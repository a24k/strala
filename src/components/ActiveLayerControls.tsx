import { useCanvasStoreSimple } from '../stores/canvasStoreSimple';
import { useLayersStoreSimple, useActiveLayerSimple } from '../stores/layersStoreSimple';

export function ActiveLayerControls() {
  const { config } = useCanvasStoreSimple();
  const { updateLayer } = useLayersStoreSimple();
  const activeLayer = useActiveLayerSimple();

  if (!activeLayer) return null;

  return (
    <div className="flex-shrink-0 px-4 py-5 border-t border-gray-600 bg-slate-800">
      <h3 className="text-lg font-semibold mb-4 text-gray-100">
        Active Layer Setting
      </h3>
      
      {/* Active Layer Name */}
      <div 
        className="mb-4 p-3 rounded-md bg-blue-500/10 border border-blue-500/20"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full border border-blue-500/30"
            style={{ backgroundColor: activeLayer.color.primary }}
          />
          <span className="text-sm font-medium text-gray-100">
            {activeLayer.name}
          </span>
        </div>
      </div>
      
      {/* Controls Container - Scrollable */}
      <div className="max-h-80 overflow-y-auto space-y-4">
        
        {/* Connection Type */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-100 w-20">
            Connection
          </label>
          <select 
            value={activeLayer.connectionType}
            onChange={(e) => updateLayer(activeLayer.id, { 
              connectionType: e.target.value as 'single-point' | 'two-point' 
            })}
            className="flex-1 h-8 px-2 text-sm rounded border bg-strala-border border-strala-accent text-strala-text-primary"
          >
            <option value="single-point">Single Point</option>
            <option value="two-point">Two Point</option>
          </select>
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
                  className="flex-1 h-1.5 bg-strala-border rounded-sm outline-none appearance-none"
                />
                <input 
                  type="number" 
                  min="0" 
                  max={config.circlePoints - 1} 
                  value={activeLayer.startPoint}
                  onChange={(e) => updateLayer(activeLayer.id, { startPoint: parseInt(e.target.value) })}
                  className="w-12 h-7 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary"
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
                  className="flex-1 h-1.5 bg-strala-border rounded-sm outline-none appearance-none"
                />
                <input 
                  type="number" 
                  min="1" 
                  max="50" 
                  value={activeLayer.stepSize}
                  onChange={(e) => updateLayer(activeLayer.id, { stepSize: parseInt(e.target.value) })}
                  className="w-12 h-7 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary"
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
                  className="flex-1 h-1.5 bg-strala-border rounded-sm outline-none appearance-none"
                />
                <input 
                  type="number" 
                  min="0" 
                  max={config.circlePoints - 1} 
                  value={activeLayer.pointA.initialPosition}
                  onChange={(e) => updateLayer(activeLayer.id, { 
                    pointA: { ...activeLayer.pointA, initialPosition: parseInt(e.target.value) }
                  })}
                  className="w-12 h-7 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary"
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
                  className="flex-1 h-1.5 bg-strala-border rounded-sm outline-none appearance-none"
                />
                <input 
                  type="number" 
                  min="1" 
                  max="50" 
                  value={activeLayer.pointA.stepSize}
                  onChange={(e) => updateLayer(activeLayer.id, { 
                    pointA: { ...activeLayer.pointA, stepSize: parseInt(e.target.value) }
                  })}
                  className="w-12 h-7 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary"
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
                  className="flex-1 h-1.5 bg-strala-border rounded-sm outline-none appearance-none"
                />
                <input 
                  type="number" 
                  min="0" 
                  max={config.circlePoints - 1} 
                  value={activeLayer.pointB.relativeOffset}
                  onChange={(e) => updateLayer(activeLayer.id, { 
                    pointB: { ...activeLayer.pointB, relativeOffset: parseInt(e.target.value) }
                  })}
                  className="w-12 h-7 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary"
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
                  className="flex-1 h-1.5 bg-strala-border rounded-sm outline-none appearance-none"
                />
                <input 
                  type="number" 
                  min="1" 
                  max="50" 
                  value={activeLayer.pointB.stepSize}
                  onChange={(e) => updateLayer(activeLayer.id, { 
                    pointB: { ...activeLayer.pointB, stepSize: parseInt(e.target.value) }
                  })}
                  className="w-12 h-7 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary"
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
                  className="flex-1 h-1.5 bg-strala-border rounded-sm outline-none appearance-none"
                />
                <input 
                  type="number" 
                  min="1" 
                  max="100" 
                  value={activeLayer.maxIterations}
                  onChange={(e) => updateLayer(activeLayer.id, { maxIterations: parseInt(e.target.value) })}
                  className="w-12 h-7 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary"
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
              className="flex-1"
              style={{
                appearance: 'none',
                height: '6px',
                background: '#2a3f5f',
                borderRadius: '3px',
                outline: 'none'
              }}
            />
            <input 
              type="number" 
              min="0" 
              max="100" 
              value={Math.round(activeLayer.color.alpha * 100)}
              onChange={(e) => updateLayer(activeLayer.id, { 
                color: { ...activeLayer.color, alpha: parseInt(e.target.value) / 100 }
              })}
              className="w-12 h-7 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary"
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
              className="flex-1"
              style={{
                appearance: 'none',
                height: '6px',
                background: '#2a3f5f',
                borderRadius: '3px',
                outline: 'none'
              }}
            />
            <input 
              type="number" 
              min="1" 
              max="10" 
              value={activeLayer.lineWidth}
              onChange={(e) => updateLayer(activeLayer.id, { lineWidth: parseInt(e.target.value) })}
              className="w-12 h-7 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary"
            />
          </div>
        </div>

        {/* Color Type */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-100 w-20">
            Type
          </label>
          <select 
            value={activeLayer.color.type}
            onChange={(e) => updateLayer(activeLayer.id, { 
              color: { ...activeLayer.color, type: e.target.value as 'solid' | 'gradient' }
            })}
            className="flex-1 h-8 px-2 text-sm rounded border bg-strala-border border-strala-accent text-strala-text-primary"
          >
            <option value="solid">Solid</option>
            <option value="gradient">Gradient</option>
          </select>
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
              className="w-8 h-7 rounded border-0 cursor-pointer"
            />
            <input 
              type="text" 
              value={activeLayer.color.primary}
              onChange={(e) => updateLayer(activeLayer.id, { 
                color: { ...activeLayer.color, primary: e.target.value }
              })}
              className="flex-1 h-7 px-2 text-xs rounded border font-mono bg-strala-border border-strala-accent text-strala-text-primary"
              placeholder="#000000"
            />
            <button 
              className="w-7 h-7 rounded text-sm font-bold transition-all bg-blue-500 text-white hover:bg-blue-600"
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
              <input 
                type="color" 
                value={activeLayer.color.secondary || '#f39c12'}
                onChange={(e) => updateLayer(activeLayer.id, { 
                  color: { ...activeLayer.color, secondary: e.target.value }
                })}
                className="w-8 h-7 rounded border-0 cursor-pointer"
              />
              <input 
                type="text" 
                value={activeLayer.color.secondary || '#f39c12'}
                onChange={(e) => updateLayer(activeLayer.id, { 
                  color: { ...activeLayer.color, secondary: e.target.value }
                })}
                className="flex-1 h-7 px-2 text-xs rounded border font-mono bg-strala-border border-strala-accent text-strala-text-primary"
                placeholder="#000000"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}