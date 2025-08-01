import { SLIDER_CLASSES } from '../ui/sliderStyles';
import { NumberInputWithSpinner } from '../ui/NumberInputWithSpinner';
import { SimpleColorPicker } from '../ui/ColorPicker';
import { ColorUtils } from '../../types';

interface LayerAppearanceSettingsProps {
  color: {
    type: 'solid' | 'gradient';
    primary: string;
    secondary?: string;
    alpha: number;
  };
  lineWidth: number;
  onUpdateColor: (updates: Partial<{
    type: 'solid' | 'gradient';
    primary: string;
    secondary?: string;
    alpha: number;
  }>) => void;
  onUpdateLineWidth: (value: number) => void;
}

export function LayerAppearanceSettings({
  color,
  lineWidth,
  onUpdateColor,
  onUpdateLineWidth
}: LayerAppearanceSettingsProps) {
  return (
    <>
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
            value={Math.round(color.alpha * 100)}
            onChange={(e) => onUpdateColor({ alpha: parseInt(e.target.value) / 100 })}
            className={SLIDER_CLASSES}
          />
          <NumberInputWithSpinner
            value={Math.round(color.alpha * 100)}
            onChange={(value) => onUpdateColor({ alpha: value / 100 })}
            min={0}
            max={100}
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
            value={lineWidth}
            onChange={(e) => onUpdateLineWidth(parseInt(e.target.value))}
            className={SLIDER_CLASSES}
          />
          <NumberInputWithSpinner
            value={lineWidth}
            onChange={onUpdateLineWidth}
            min={1}
            max={10}
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
            value={color.type}
            onChange={(e) => {
              const newType = e.target.value as 'solid' | 'gradient';
              if (newType === 'gradient' && color.type === 'solid') {
                // Generate harmony color when switching to gradient
                const harmonies = ColorUtils.generateColorHarmony(color.primary, 'complementary');
                onUpdateColor({ 
                  type: newType,
                  secondary: harmonies[1] || '#f39c12'
                });
              } else {
                onUpdateColor({ type: newType });
              }
            }}
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
            value={color.primary}
            onChange={(e) => onUpdateColor({ primary: e.target.value })}
            className="w-8 h-8 rounded border border-gray-400 cursor-pointer"
            style={{ padding: 0, outline: 'none', appearance: 'none', WebkitAppearance: 'none' }}
          />
          <input 
            type="text" 
            value={color.primary}
            onChange={(e) => onUpdateColor({ primary: e.target.value })}
            className="w-20 h-8 px-2 text-xs rounded border font-mono bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Secondary Color (for gradients) */}
      {color.type === 'gradient' && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-100 w-20">
            Color 2
          </label>
          <div className="flex items-center gap-2 flex-1">
            <SimpleColorPicker
              value={color.secondary || '#f39c12'}
              onChange={(value) => onUpdateColor({ secondary: value })}
            />
            <input 
              type="text" 
              value={color.secondary || '#f39c12'}
              onChange={(e) => onUpdateColor({ secondary: e.target.value })}
              className="w-20 h-8 px-2 text-xs rounded border font-mono bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="#000000"
            />
          </div>
        </div>
      )}
    </>
  );
}