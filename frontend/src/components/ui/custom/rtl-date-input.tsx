"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface RTLDateInputProps {
  id: string
  label: string
  value?: Date
  onChange: (date: Date | undefined) => void
  error?: string
  className?: string
  disabled?: boolean
}

export function RTLDateInput({ id, label, value, onChange, error, className, disabled = false }: RTLDateInputProps) {
  const [date, setDate] = useState<Date | undefined>(value)
  const [open, setOpen] = useState(false)

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    onChange(newDate)
    if (newDate) setOpen(false)
  }

  // Format date for display in Arabic format
  const formattedDate = date ? format(date, "yyyy-MM-dd") : ""

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="block text-right">
          {label}
        </Label>
      )}
      <Popover open={open && !disabled} onOpenChange={disabled ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-right border-primary/20 bg-white/10 text-primary transition-all duration-200",
              !date && "text-primary/50",
              disabled && "opacity-70 cursor-not-allowed",
              !disabled && "hover:border-primary focus:border-primary",
            )}
            disabled={disabled}
          >
            {date ? formattedDate : "اختر تاريخ..."}
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
            dir="rtl"
            className="rounded-md border border-primary/20 shadow-md"
          />
        </PopoverContent>
      </Popover>
      {/* Hidden input for form submission */}
      <Input
        id={id}
        type="date"
        value={date ? format(date, "yyyy-MM-dd") : ""}
        onChange={(e) => {
          const newDate = e.target.value ? new Date(e.target.value) : undefined
          handleDateChange(newDate)
        }}
        className="hidden"
        disabled={disabled}
      />
      {error && <p className="text-destructive text-sm mt-1 text-right">{error}</p>}
    </div>
  )
}
