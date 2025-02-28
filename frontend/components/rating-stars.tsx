"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating?: number
  maxRating?: number
  onRatingChange?: (rating: number) => void
  readOnly?: boolean
  size?: "sm" | "md" | "lg"
}

export function RatingStars({
  rating = 0,
  maxRating = 5,
  onRatingChange,
  readOnly = true,
  size = "sm",
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const handleClick = (index: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(index)
    }
  }

  return (
    <div className="flex items-center">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1
        const isFilled = readOnly ? starValue <= Math.round(rating) : starValue <= (hoverRating || rating)

        return (
          <button
            key={index}
            type="button"
            className={cn("text-yellow-400 focus:outline-none", readOnly ? "cursor-default" : "cursor-pointer")}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => !readOnly && setHoverRating(starValue)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            disabled={readOnly}
          >
            <Star className={cn(sizeClasses[size], isFilled ? "fill-yellow-400" : "fill-muted stroke-muted")} />
          </button>
        )
      })}
    </div>
  )
}

