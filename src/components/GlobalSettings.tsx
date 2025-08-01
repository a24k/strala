import { useCanvasStoreSimple } from '../stores/canvasStoreSimple';
import { useLayersStoreSimple } from '../stores/layersStoreSimple';
import { SimpleColorPicker } from './ui/ColorPicker';
import { RangeSlider } from './ui/RangeSlider';
import { NumberInputWithSpinner } from './ui/NumberInputWithSpinner';
import { CustomCheckbox } from './ui/CustomCheckbox';
import { RotateCcw, ClipboardCopy, ClipboardPaste } from 'lucide-react';

export function GlobalSettings() {
  const { config, updateConfig } = useCanvasStoreSimple();
  const { layers, activeLayerId } = useLayersStoreSimple();

  const handleResetToDefaults = () => {
    if (confirm('Reset all settings to "Luminous Mandala" defaults?\nCurrent work will be lost.')) {
      try {
        // Clear all Strala persistent storage
        const keysToRemove: string[] = [];
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('strala-v')) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Reload page to reinitialize with defaults
        window.location.reload();
      } catch (error) {
        console.error('❌ Failed to reset to defaults:', error);
        alert('Reset failed. Please reload the page.');
      }
    }
  };

  const handleExportSettings = async () => {
    try {
      const exportData = {
        version: 3,
        timestamp: new Date().toISOString(),
        config,
        layers,
        activeLayerId
      };
      
      const jsonString = JSON.stringify(exportData, null, 2);
      
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(jsonString);
        alert('Settings copied to clipboard!');
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = jsonString;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Settings copied to clipboard!');
      }
    } catch (error) {
      console.error('❌ Failed to export settings:', error);
      alert('Failed to export settings.');
    }
  };

  const validateImportData = (data: any): { valid: boolean; message: string } => {
    // Basic structure validation
    if (!data || typeof data !== 'object') {
      return { valid: false, message: 'Invalid JSON object.' };
    }
    
    if (!data.version || typeof data.version !== 'number') {
      return { valid: false, message: 'Invalid version information.' };
    }
    
    if (!data.config || typeof data.config !== 'object') {
      return { valid: false, message: 'Invalid canvas settings.' };
    }
    
    if (!Array.isArray(data.layers) || data.layers.length === 0) {
      return { valid: false, message: 'Invalid layer information.' };
    }
    
    // Config validation
    const { config } = data;
    if (typeof config.circlePoints !== 'number' || config.circlePoints < 8 || config.circlePoints > 100) {
      return { valid: false, message: 'Invalid point count (must be between 8-100).' };
    }
    
    if (typeof config.backgroundColor !== 'string' || !config.backgroundColor.startsWith('#')) {
      return { valid: false, message: 'Invalid background color.' };
    }
    
    if (typeof config.rotation !== 'number' || config.rotation < 0 || config.rotation > 360) {
      return { valid: false, message: 'Invalid rotation angle (must be between 0-360).' };
    }
    
    // Layers validation
    for (let i = 0; i < data.layers.length; i++) {
      const layer = data.layers[i];
      
      if (!layer.id || typeof layer.id !== 'string') {
        return { valid: false, message: `Layer ${i + 1} has invalid ID.` };
      }
      
      if (!layer.name || typeof layer.name !== 'string') {
        return { valid: false, message: `Layer ${i + 1} has invalid name.` };
      }
      
      if (typeof layer.visible !== 'boolean') {
        return { valid: false, message: `Layer ${i + 1} has invalid visibility setting.` };
      }
      
      if (!['single-point', 'two-point'].includes(layer.connectionType)) {
        return { valid: false, message: `Layer ${i + 1} has invalid connection type.` };
      }
      
      if (!layer.color || typeof layer.color !== 'object') {
        return { valid: false, message: `Layer ${i + 1} has invalid color settings.` };
      }
      
      if (!['solid', 'gradient'].includes(layer.color.type)) {
        return { valid: false, message: `Layer ${i + 1} has invalid color type.` };
      }
      
      if (typeof layer.color.alpha !== 'number' || layer.color.alpha < 0 || layer.color.alpha > 1) {
        return { valid: false, message: `Layer ${i + 1} has invalid opacity (must be between 0-1).` };
      }
    }
    
    return { valid: true, message: '' };
  };

  const handleImportSettings = async () => {
    try {
      let jsonString = '';
      
      if (navigator.clipboard) {
        jsonString = await navigator.clipboard.readText();
      } else {
        jsonString = prompt('Please paste JSON data:') || '';
      }
      
      if (!jsonString.trim()) {
        alert('Data is empty.');
        return;
      }
      
      const importData = JSON.parse(jsonString);
      
      // Comprehensive validation
      const validation = validateImportData(importData);
      if (!validation.valid) {
        alert(`Data validation error: ${validation.message}`);
        return;
      }
      
      if (confirm('Overwrite current settings?\nCurrent work will be lost.')) {
        // Clear existing data
        const keysToRemove: string[] = [];
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('strala-v')) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Import new data by setting localStorage directly and reloading
        localStorage.setItem('strala-v3-config', JSON.stringify({ config: importData.config }));
        localStorage.setItem('strala-v3-layers', JSON.stringify({ 
          layers: importData.layers, 
          activeLayerId: importData.activeLayerId || importData.layers[0]?.id 
        }));
        localStorage.setItem('strala-v3-schema', '3');
        
        // Reload page to apply imported settings
        window.location.reload();
      }
    } catch (error) {
      console.error('❌ Failed to import settings:', error);
      alert('Failed to import settings. Please check data format.');
    }
  };

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
        {/* Global Settings Header with Action Buttons */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-100 leading-tight">
            Global Settings
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSettings}
              className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold transition-all bg-blue-500/80 hover:bg-blue-500 border border-blue-400/50 hover:border-blue-400"
              title="Copy settings as JSON"
            >
              <ClipboardCopy size={16} />
            </button>
            <button
              onClick={handleImportSettings}
              className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold transition-all bg-green-500/80 hover:bg-green-500 border border-green-400/50 hover:border-green-400"
              title="Import settings from JSON"
            >
              <ClipboardPaste size={16} />
            </button>
            <button
              onClick={handleResetToDefaults}
              className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold transition-all bg-red-500/80 hover:bg-red-500 border border-red-400/50 hover:border-red-400"
              title="Reset all to defaults"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
        
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
            <RangeSlider
              min={8}
              max={100}
              value={config.circlePoints}
              onChange={(value) => updateConfig({ circlePoints: value })}
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
            <RangeSlider
              min={0}
              max={360}
              value={config.rotation}
              onChange={(value) => updateConfig({ rotation: value })}
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