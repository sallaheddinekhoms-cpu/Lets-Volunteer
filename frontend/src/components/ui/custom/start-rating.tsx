"use client"

import type React from "react"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  initialRating?: number
  onChange?: (rating: number) => void
  readOnly?: boolean
}

export const StarRating: React.FC<StarRatingProps> = ({ initialRating = 0, onChange, readOnly = false }) => {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)

  const handleClick = (index: number) => {
    if (readOnly) return
    const newRating = index + 1
    setRating(newRating)
    if (onChange) onChange(newRating)
  }

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const filled = index < (hoverRating || rating)

        return (
          <Star
            key={index}
            className={`w-5 h-5 cursor-${readOnly ? "default" : "pointer"} transition-colors ${
              filled ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => !readOnly && setHoverRating(index + 1)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
          />
        )
      })}
    </div>
  )
}
