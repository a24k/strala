import React from 'react';

interface RangeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
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
            className="flex-1 h-2 bg-strala-border rounded-sm outline-none appearance-none
                      [&::-webkit-slider-thumb]:appearance-none 
                      [&::-webkit-slider-thumb]:w-[18px] 
                      [&::-webkit-slider-thumb]:h-[18px] 
                      [&::-webkit-slider-thumb]:bg-strala-accent 
                      [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:border-2 
                      [&::-webkit-slider-thumb]:border-white 
                      [&::-webkit-slider-thumb]:shadow-md 
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:transition-all
                      [&::-webkit-slider-thumb]:hover:bg-blue-600
                      [&::-webkit-slider-thumb]:hover:scale-110
                      [&::-moz-range-thumb]:appearance-none
                      [&::-moz-range-thumb]:w-[18px]
                      [&::-moz-range-thumb]:h-[18px]
                      [&::-moz-range-thumb]:bg-strala-accent
                      [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:border-2
                      [&::-moz-range-thumb]:border-white
                      [&::-moz-range-thumb]:shadow-md
                      [&::-moz-range-thumb]:cursor-pointer"
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