import React, { useState } from 'react';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  label,
  className = '',
  disabled = false
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!disabled) {
        onChange(!checked);
      }
    }
  };

  const baseClasses = `
    relative inline-flex items-center justify-center
    w-4 h-4 rounded-sm border transition-all duration-200
    cursor-pointer select-none
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  const stateClasses = checked
    ? 'bg-blue-500 border-blue-500'
    : 'bg-strala-border border-strala-accent hover:border-blue-400 hover:bg-strala-accent';

  const focusClasses = isFocused && !disabled
    ? 'ring-2 ring-blue-500/50 ring-offset-0'
    : '';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={`${baseClasses} ${stateClasses} ${focusClasses}`}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          boxShadow: isFocused && !disabled 
            ? '0 0 0 2px rgba(59, 130, 246, 0.5)' 
            : undefined
        }}
      >
        {checked && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M10 3L4.5 8.5L2 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {label && (
        <span 
          className={`text-xs text-gray-400 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
          onClick={() => !disabled && onChange(!checked)}
        >
          {label}
        </span>
      )}
    </div>
  );
};