// 共通のスライダースタイル定数
export const SLIDER_CLASSES = `
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
`.trim().replace(/\s+/g, ' ');