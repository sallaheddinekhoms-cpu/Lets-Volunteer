"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface SimpleDateInputProps {
  id: string
  label?: string
  value?: Date
  onChange: (date: Date | undefined) => void
  error?: string
  className?: string
  disabled?: boolean
}

export function SimpleDateInput({ 
  id, 
  label, 
  value, 
  onChange, 
  error, 
  className, 
  disabled = false 
}: SimpleDateInputProps) {
  
  // Format date for display in input (YYYY-MM-DD format)
  const formattedValue = value ? value.toISOString().split('T')[0] : ""

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    if (dateValue) {
      const newDate = new Date(dateValue)
      onChange(newDate)
    } else {
      onChange(undefined)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="block text-right">
          {label}
        </Label>
      )}
      <Input
        id={id}
        type="date"
        value={formattedValue}
        onChange={handleDateChange}
        disabled={disabled}
        className={cn(
          "w-full text-right border-primary/20 focus:border-primary transition-all duration-200",
          disabled && "opacity-70 cursor-not-allowed"
        )}
        dir="rtl"
      />
      {error && <p className="text-destructive text-sm mt-1 text-right">{error}</p>}
    </div>
  )
}