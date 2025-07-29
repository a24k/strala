import React from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showHarmonyButton?: boolean;
  onHarmonyClick?: () => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  showHarmonyButton = false,
  onHarmonyClick
}) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-3">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-slate-300 w-20 shrink-0">
          {label}
        </label>
        <div className="flex-1 flex items-center gap-3">
          <input
            type="color"
            value={value}
            onChange={handleColorChange}
            className="w-10 h-10 rounded-lg border-2 border-slate-600/50 cursor-pointer bg-transparent hover:ring-2 hover:ring-blue-500/50 hover:border-blue-500/50 transition-all duration-200 shadow-sm"
          />
          <input
            type="text"
            value={value}
            onChange={handleTextChange}
            placeholder="#000000"
            className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
          />
          {showHarmonyButton && (
            <button
              onClick={onHarmonyClick}
              className="w-8 h-8 p-0 rounded-lg bg-purple-600/80 text-white hover:bg-purple-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              title="Generate color harmony"
            >
              <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};