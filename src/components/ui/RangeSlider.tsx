import React, { forwardRef } from 'react';

interface RangeSliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value' | 'min' | 'max'> {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  className?: string;
}

export const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
  ({ value, onChange, min, max, step = 1, className = '', ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseInt(e.target.value));
    };

    return (
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className={`
          flex-1 h-2 bg-strala-border rounded-sm outline-none appearance-none
          [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:w-[18px] 
          [&::-webkit-slider-thumb]:h-[18px] 
          [&::-webkit-slider-thumb]:bg-strala-accent 
          [&::-webkit-slider-thumb]:rounded-full
          [&::-moz-range-thumb]:appearance-none
          [&::-moz-range-thumb]:w-[18px]
          [&::-moz-range-thumb]:h-[18px]
          [&::-moz-range-thumb]:bg-strala-accent
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-none
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      />
    );
  }
);

RangeSlider.displayName = 'RangeSlider';