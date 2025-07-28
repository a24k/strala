import React from 'react';

interface ModernSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

export const ModernSlider: React.FC<ModernSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="mb-3">
      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-300 w-20 shrink-0">
          {label}
        </label>
        <div className="flex-1 flex items-center gap-3">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleSliderChange}
            className="flex-1"
          />
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleInputChange}
            className="w-16 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-slate-100 text-center text-sm"
          />
        </div>
      </div>
    </div>
  );
};