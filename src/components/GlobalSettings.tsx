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
    if (confirm('すべての設定を"Luminous Mandala"デフォルトに戻しますか？\n現在の作業内容は失われます。')) {
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
        alert('リセットに失敗しました。ページをリロードしてください。');
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
        alert('設定をクリップボードにコピーしました！');
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = jsonString;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('設定をクリップボードにコピーしました！');
      }
    } catch (error) {
      console.error('❌ Failed to export settings:', error);
      alert('設定のエクスポートに失敗しました。');
    }
  };

  const validateImportData = (data: any): { valid: boolean; message: string } => {
    // Basic structure validation
    if (!data || typeof data !== 'object') {
      return { valid: false, message: '無効なJSONオブジェクトです。' };
    }
    
    if (!data.version || typeof data.version !== 'number') {
      return { valid: false, message: 'バージョン情報が不正です。' };
    }
    
    if (!data.config || typeof data.config !== 'object') {
      return { valid: false, message: 'Canvas設定が不正です。' };
    }
    
    if (!Array.isArray(data.layers) || data.layers.length === 0) {
      return { valid: false, message: 'レイヤー情報が不正です。' };
    }
    
    // Config validation
    const { config } = data;
    if (typeof config.circlePoints !== 'number' || config.circlePoints < 8 || config.circlePoints > 100) {
      return { valid: false, message: 'ポイント数が不正です（8-100の範囲で指定してください）。' };
    }
    
    if (typeof config.backgroundColor !== 'string' || !config.backgroundColor.startsWith('#')) {
      return { valid: false, message: '背景色が不正です。' };
    }
    
    if (typeof config.rotation !== 'number' || config.rotation < 0 || config.rotation > 360) {
      return { valid: false, message: '回転角度が不正です（0-360の範囲で指定してください）。' };
    }
    
    // Layers validation
    for (let i = 0; i < data.layers.length; i++) {
      const layer = data.layers[i];
      
      if (!layer.id || typeof layer.id !== 'string') {
        return { valid: false, message: `レイヤー${i + 1}のIDが不正です。` };
      }
      
      if (!layer.name || typeof layer.name !== 'string') {
        return { valid: false, message: `レイヤー${i + 1}の名前が不正です。` };
      }
      
      if (typeof layer.visible !== 'boolean') {
        return { valid: false, message: `レイヤー${i + 1}の表示設定が不正です。` };
      }
      
      if (!['single-point', 'two-point'].includes(layer.connectionType)) {
        return { valid: false, message: `レイヤー${i + 1}の接続タイプが不正です。` };
      }
      
      if (!layer.color || typeof layer.color !== 'object') {
        return { valid: false, message: `レイヤー${i + 1}の色設定が不正です。` };
      }
      
      if (!['solid', 'gradient'].includes(layer.color.type)) {
        return { valid: false, message: `レイヤー${i + 1}の色タイプが不正です。` };
      }
      
      if (typeof layer.color.alpha !== 'number' || layer.color.alpha < 0 || layer.color.alpha > 1) {
        return { valid: false, message: `レイヤー${i + 1}の透明度が不正です（0-1の範囲で指定してください）。` };
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
        jsonString = prompt('JSONデータを貼り付けてください:') || '';
      }
      
      if (!jsonString.trim()) {
        alert('データが空です。');
        return;
      }
      
      const importData = JSON.parse(jsonString);
      
      // Comprehensive validation
      const validation = validateImportData(importData);
      if (!validation.valid) {
        alert(`データ検証エラー: ${validation.message}`);
        return;
      }
      
      if (confirm('現在の設定を上書きしますか？\n現在の作業内容は失われます。')) {
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
      alert('設定のインポートに失敗しました。データ形式を確認してください。');
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
              title="設定をJSONでコピー"
            >
              <ClipboardCopy size={16} />
            </button>
            <button
              onClick={handleImportSettings}
              className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold transition-all bg-green-500/80 hover:bg-green-500 border border-green-400/50 hover:border-green-400"
              title="設定をJSONから読み込み"
            >
              <ClipboardPaste size={16} />
            </button>
            <button
              onClick={handleResetToDefaults}
              className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold transition-all bg-red-500/80 hover:bg-red-500 border border-red-400/50 hover:border-red-400"
              title="すべてをデフォルトに戻す"
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