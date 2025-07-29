import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface StyledSelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export const StyledSelect: React.FC<StyledSelectProps> = ({
  label,
  value,
  options,
  onChange
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-3">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-slate-300 w-20 shrink-0">
          {label}
        </label>
        <div className="flex-1 relative">
          <select
            value={value}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 appearance-none pr-10"
          >
            {options.map(option => (
              <option key={option.value} value={option.value} className="bg-slate-800 text-slate-100">
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};