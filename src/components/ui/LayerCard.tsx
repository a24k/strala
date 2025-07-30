import React from 'react';

interface LayerCardProps {
  name: string;
  visible: boolean;
  isActive: boolean;
  startPoint: number;
  stepSize: number;
  alpha: number;
  lineWidth: number;
  color: {
    type: 'solid' | 'gradient';
    primary: string;
    secondary?: string;
  };
  canMoveUp: boolean;
  canMoveDown: boolean;
  onClick: () => void;
  onToggleVisibility: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const LayerCard: React.FC<LayerCardProps> = ({
  name,
  visible,
  isActive,
  startPoint,
  stepSize,
  alpha,
  lineWidth,
  color,
  canMoveUp,
  canMoveDown,
  onClick,
  onToggleVisibility,
  onMoveUp,
  onMoveDown
}) => {
  return (
    <div
      className={`px-2 py-3 rounded-lg border cursor-pointer transition-colors ${
        isActive
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            className="w-6 h-6 flex items-center justify-center text-lg text-slate-400 hover:text-slate-100 transition-colors cursor-pointer select-none"
            title={visible ? 'Hide layer' : 'Show layer'}
          >
            {visible ? '◉' : '○'}
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <span className="font-medium text-slate-100 text-sm">
              {name}
            </span>
            <div 
              className="h-0.5 rounded-full"
              style={{
                background: color.type === 'gradient' && color.secondary
                  ? `linear-gradient(45deg, ${color.primary}, ${color.secondary})`
                  : color.primary,
                opacity: alpha,
                height: `${Math.max(1, lineWidth * 0.5)}px`
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            className={`w-6 h-6 flex items-center justify-center text-sm transition-colors ${
              canMoveUp 
                ? 'text-slate-400 hover:text-slate-100' 
                : 'text-slate-600 cursor-not-allowed'
            }`}
            title="Move layer up"
            disabled={!canMoveUp}
          >
            ↑
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            className={`w-6 h-6 flex items-center justify-center text-sm transition-colors ${
              canMoveDown 
                ? 'text-slate-400 hover:text-slate-100' 
                : 'text-slate-600 cursor-not-allowed'
            }`}
            title="Move layer down"
            disabled={!canMoveDown}
          >
            ↓
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span>Start: {startPoint}</span>
        <span>Step: {stepSize}</span>
        <span>α: {Math.round(alpha * 100)}%</span>
      </div>
    </div>
  );
};