import { useCanvasStoreSimple } from '../stores/canvasStoreSimple';

export function GlobalSettings() {
  const { config, updateConfig } = useCanvasStoreSimple();

  return (
    <div className="flex-shrink-0 px-4 py-3 border-b border-strala-border bg-strala-dark-blue">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-0 mt-0 text-strala-text-primary">
          Strala
        </h1>
        <p className="text-sm text-gray-300 mt-0 mb-0">
          String Art Mandala Simulator
        </p>
      </div>

      {/* Global Settings */}
      <div>
        <h2 className="text-lg font-semibold mb-4 mt-0 text-gray-100">
          Global Settings
        </h2>
        
        {/* Points Control */}
        <div className="flex items-center gap-2 mb-4">
          <label className="text-sm font-medium text-gray-100 w-16">
            Points
          </label>
          <div className="flex items-center gap-2 flex-1">
            <input 
              type="range" 
              min="8" 
              max="100" 
              value={config.circlePoints}
              onChange={(e) => updateConfig({ circlePoints: parseInt(e.target.value) })}
              className="flex-1 h-2 bg-strala-border rounded-sm outline-none appearance-none"
            />
            <input 
              type="number" 
              min="8" 
              max="100" 
              value={config.circlePoints}
              onChange={(e) => updateConfig({ circlePoints: parseInt(e.target.value) })}
              className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary"
            />
          </div>
        </div>
        
        {/* Background Control */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-100 w-16">
            Background
          </label>
          <div className="flex items-center gap-2 flex-1">
            <input 
              type="color" 
              value={config.backgroundColor} 
              onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
              className="w-8 h-8 rounded border-0 cursor-pointer"
            />
            <input 
              type="text" 
              value={config.backgroundColor}
              onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
              className="flex-1 h-8 px-2 text-xs rounded border font-mono bg-strala-border border-strala-accent text-strala-text-primary"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}