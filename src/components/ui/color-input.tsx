import * as React from "react"
import { Label } from "./label"
import { Input } from "./input"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { Palette } from "lucide-react"

interface ColorInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  showHarmonyButton?: boolean
  onHarmonyClick?: () => void
  className?: string
}

export const ColorInput: React.FC<ColorInputProps> = ({
  label,
  value,
  onChange,
  showHarmonyButton = false,
  onHarmonyClick,
  className
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Input
            type="color"
            value={value}
            onChange={handleColorChange}
            className="w-12 h-10 p-1 border-2 cursor-pointer"
          />
        </div>
        <Input
          type="text"
          value={value}
          onChange={handleInputChange}
          className="flex-1 font-mono text-sm"
          placeholder="#000000"
        />
        {showHarmonyButton && onHarmonyClick && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onHarmonyClick}
            className="shrink-0"
            title="Generate color harmony"
          >
            <Palette className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}