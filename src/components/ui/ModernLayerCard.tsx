import React from 'react';

interface ModernLayerCardProps {
  name: string;
  visible: boolean;
  isActive: boolean;
  startPoint: number;
  stepSize: number;
  alpha: number;
  primaryColor: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onClick: () => void;
  onToggleVisibility: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const ModernLayerCard: React.FC<ModernLayerCardProps> = ({
  name,
  visible,
  isActive,
  startPoint,
  stepSize,
  alpha,
  primaryColor,
  canMoveUp,
  canMoveDown,
  onClick,
  onToggleVisibility,
  onMoveUp,
  onMoveDown
}) => {
  return (
    <div
      className={`p-3 rounded-lg border cursor-pointer transition-colors mb-2 ${
        isActive
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded border border-slate-600/50"
            style={{ backgroundColor: primaryColor }}
          />
          <span className="font-medium text-slate-100 text-sm">
            {name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            className={`text-sm transition-colors ${
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
            className={`text-sm transition-colors ${
              canMoveDown 
                ? 'text-slate-400 hover:text-slate-100' 
                : 'text-slate-600 cursor-not-allowed'
            }`}
            title="Move layer down"
            disabled={!canMoveDown}
          >
            ↓
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            className="text-lg text-slate-400 hover:text-slate-100 transition-colors"
            title={visible ? 'Hide layer' : 'Show layer'}
          >
            {visible ? '◉' : '○'}
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