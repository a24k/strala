import { RangeSlider } from '../ui/RangeSlider';
import { NumberInputWithSpinner } from '../ui/NumberInputWithSpinner';

interface SinglePointSettingsProps {
  startPoint: number;
  stepSize: number;
  maxPoints: number;
  onUpdateStartPoint: (value: number) => void;
  onUpdateStepSize: (value: number) => void;
}

export function SinglePointSettings({
  startPoint,
  stepSize,
  maxPoints,
  onUpdateStartPoint,
  onUpdateStepSize
}: SinglePointSettingsProps) {
  return (
    <>
      {/* Start Point */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-100 w-20">
          Start
        </label>
        <div className="flex items-center gap-2 flex-1">
          <RangeSlider
            min={0}
            max={maxPoints - 1}
            value={startPoint}
            onChange={onUpdateStartPoint}
          />
          <NumberInputWithSpinner
            value={startPoint}
            onChange={onUpdateStartPoint}
            min={0}
            max={maxPoints - 1}
            className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Step Size */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-100 w-20">
          Step
        </label>
        <div className="flex items-center gap-2 flex-1">
          <RangeSlider
            min={1}
            max={maxPoints - 1}
            value={stepSize}
            onChange={onUpdateStepSize}
          />
          <NumberInputWithSpinner
            value={stepSize}
            onChange={onUpdateStepSize}
            min={1}
            max={maxPoints - 1}
            className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>
    </>
  );
}