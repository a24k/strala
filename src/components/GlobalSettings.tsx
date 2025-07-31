import { useCanvasStoreSimple } from '../stores/canvasStoreSimple';
import { SimpleColorPicker } from './ui/ColorPicker';
import { SLIDER_CLASSES } from './ui/sliderStyles';
import { NumberInputWithSpinner } from './ui/NumberInputWithSpinner';
import { CustomCheckbox } from './ui/CustomCheckbox';

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
        <div className="flex items-center gap-2 mb-2">
          <div className="w-20 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-100">
              Points
            </label>
            <CustomCheckbox
              checked={config.showPointNumbers}
              onChange={(checked) => updateConfig({ showPointNumbers: checked })}
            />
          </div>
          <div className="flex items-center gap-2 flex-1">
            <input 
              type="range" 
              min="8" 
              max="100" 
              value={config.circlePoints}
              onChange={(e) => updateConfig({ circlePoints: parseInt(e.target.value) })}
              className={SLIDER_CLASSES}
            />
            <NumberInputWithSpinner
              value={config.circlePoints}
              onChange={(value) => updateConfig({ circlePoints: value })}
              min={8}
              max={100}
              className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
        
        {/* Rotation Control */}
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-medium text-gray-100 w-20">
            Rotate
          </label>
          <div className="flex items-center gap-2 flex-1">
            <input 
              type="range" 
              min="0" 
              max="360" 
              value={config.rotation}
              onChange={(e) => updateConfig({ rotation: parseInt(e.target.value) })}
              className={SLIDER_CLASSES}
            />
            <NumberInputWithSpinner
              value={config.rotation}
              onChange={(value) => updateConfig({ rotation: value })}
              min={0}
              max={360}
              className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
        
        {/* Background Control */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-100 w-20">
            Background
          </label>
          <div className="flex items-center gap-2 flex-1">
            <SimpleColorPicker
              value={config.backgroundColor}
              onChange={(value) => updateConfig({ backgroundColor: value })}
            />
            <input 
              type="text" 
              value={config.backgroundColor}
              onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
              className="w-20 h-8 px-2 text-xs rounded border font-mono bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}