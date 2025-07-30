import React from 'react';

interface NumberInputWithSpinnerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

export const NumberInputWithSpinner: React.FC<NumberInputWithSpinnerProps> = ({
  value,
  onChange,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  className = '',
  disabled = false
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue)) {
      onChange(Math.max(min, Math.min(max, newValue)));
    }
  };

  const handleIncrement = () => {
    if (!disabled) {
      const newValue = Math.min(value + step, max);
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    if (!disabled) {
      const newValue = Math.max(value - step, min);
      onChange(newValue);
    }
  };

  return (
    <div className="relative">
      <input 
        type="number" 
        min={min} 
        max={max} 
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        className={`pr-5 pl-1 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className}`}
      />
      <div className="absolute right-0 top-0 h-full flex flex-col">
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className="flex-1 px-1 flex items-center justify-center bg-strala-border hover:brightness-110 transition-all border border-strala-accent rounded-tr"
        >
          <svg className={`w-2 h-2 ${disabled || value >= max ? 'text-strala-text-primary/30' : 'text-strala-text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className="flex-1 px-1 flex items-center justify-center bg-strala-border hover:brightness-110 transition-all border border-strala-accent border-t-0 rounded-br"
        >
          <svg className={`w-2 h-2 ${disabled || value <= min ? 'text-strala-text-primary/30' : 'text-strala-text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};