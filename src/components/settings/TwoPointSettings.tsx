import { SLIDER_CLASSES } from '../ui/sliderStyles';
import { NumberInputWithSpinner } from '../ui/NumberInputWithSpinner';
import { calculateMaxIterations } from '../../utils/math';

interface TwoPointSettingsProps {
  pointA: {
    initialPosition: number;
    stepSize: number;
  };
  pointB: {
    relativeOffset: number;
    stepSize: number;
  };
  iterations: number;
  maxPoints: number;
  onUpdatePointA: (updates: Partial<{ initialPosition: number; stepSize: number }>) => void;
  onUpdatePointB: (updates: Partial<{ relativeOffset: number; stepSize: number }>) => void;
  onUpdateIterations: (value: number) => void;
}

export function TwoPointSettings({
  pointA,
  pointB,
  iterations,
  maxPoints,
  onUpdatePointA,
  onUpdatePointB,
  onUpdateIterations
}: TwoPointSettingsProps) {
  const maxIterations = calculateMaxIterations(maxPoints, pointA.stepSize, pointB.stepSize);

  return (
    <>
      {/* Point A Position */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-100 w-20">
          A: Start
        </label>
        <div className="flex items-center gap-2 flex-1">
          <input 
            type="range" 
            min="0" 
            max={maxPoints - 1} 
            value={pointA.initialPosition}
            onChange={(e) => onUpdatePointA({ initialPosition: parseInt(e.target.value) })}
            className={SLIDER_CLASSES}
          />
          <NumberInputWithSpinner
            value={pointA.initialPosition}
            onChange={(value) => onUpdatePointA({ initialPosition: value })}
            min={0}
            max={maxPoints - 1}
            className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Point A Step */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-100 w-20">
          A: Step
        </label>
        <div className="flex items-center gap-2 flex-1">
          <input 
            type="range" 
            min="1" 
            max={maxPoints - 1} 
            value={pointA.stepSize}
            onChange={(e) => onUpdatePointA({ stepSize: parseInt(e.target.value) })}
            className={SLIDER_CLASSES}
          />
          <NumberInputWithSpinner
            value={pointA.stepSize}
            onChange={(value) => onUpdatePointA({ stepSize: value })}
            min={1}
            max={maxPoints - 1}
            className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Point B Offset */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-100 w-20">
          B: Offset
        </label>
        <div className="flex items-center gap-2 flex-1">
          <input 
            type="range" 
            min="0" 
            max={maxPoints - 1} 
            value={pointB.relativeOffset}
            onChange={(e) => onUpdatePointB({ relativeOffset: parseInt(e.target.value) })}
            className={SLIDER_CLASSES}
          />
          <NumberInputWithSpinner
            value={pointB.relativeOffset}
            onChange={(value) => onUpdatePointB({ relativeOffset: value })}
            min={0}
            max={maxPoints - 1}
            className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Point B Step */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-100 w-20">
          B: Step
        </label>
        <div className="flex items-center gap-2 flex-1">
          <input 
            type="range" 
            min="1" 
            max={maxPoints - 1} 
            value={pointB.stepSize}
            onChange={(e) => onUpdatePointB({ stepSize: parseInt(e.target.value) })}
            className={SLIDER_CLASSES}
          />
          <NumberInputWithSpinner
            value={pointB.stepSize}
            onChange={(value) => onUpdatePointB({ stepSize: value })}
            min={1}
            max={maxPoints - 1}
            className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Iterations */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-100 w-20">
          Iterations
        </label>
        <div className="flex items-center gap-2 flex-1">
          <input 
            type="range" 
            min="1" 
            max={maxIterations}
            value={iterations}
            onChange={(e) => onUpdateIterations(parseInt(e.target.value))}
            className={SLIDER_CLASSES}
          />
          <NumberInputWithSpinner
            value={iterations}
            onChange={onUpdateIterations}
            min={1}
            max={maxIterations}
            className="w-12 h-8 text-xs text-center rounded border bg-strala-border border-strala-accent text-strala-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>
    </>
  );
}