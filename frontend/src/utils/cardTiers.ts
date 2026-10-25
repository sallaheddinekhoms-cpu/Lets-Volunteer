import type React from "react"
import { Award, Medal, Trophy } from "lucide-react"

export interface CardTier {
  name: string
  color: string
  gradient: string
  textColor: string
  borderColor: string
  icon: React.ComponentType<{ className?: string }>
  minHours: number
  shineOverlay: string
  badgeGradient: string
  shadowColor: string
}

export const cardTiers: CardTier[] = [
  {
    name: "بطاقة برونزية",
    color: "bg-orange-700",
    gradient: "bg-orange-50",
    textColor: "text-orange-900",
    borderColor: "border-orange-600",
    icon: Award,
    minHours: 100,
    shineOverlay: "bg-gradient-to-r from-transparent via-white/20 to-transparent",
    badgeGradient: "bg-gradient-to-r from-orange-600 to-orange-700",
    shadowColor: "shadow-orange-300/50",
  },
  {
    name: "بطاقة فضية",
    color: "bg-gray-600",
    gradient: "bg-gray-50",
    textColor: "text-gray-800",
    borderColor: "border-gray-400",
    icon: Medal,
    minHours: 150,
    shineOverlay: "bg-gradient-to-r from-transparent via-white/30 to-transparent",
    badgeGradient: "bg-gradient-to-r from-gray-500 to-gray-600",
    shadowColor: "shadow-gray-400/50",
  },
  {
    name: "بطاقة ذهبية",
    color: "bg-yellow-500",
    gradient: "bg-yellow-50",
    textColor: "text-yellow-900",
    borderColor: "border-yellow-500",
    icon: Trophy,
    minHours: 200,
    shineOverlay: "bg-gradient-to-r from-transparent via-white/40 to-transparent",
    badgeGradient: "bg-gradient-to-r from-yellow-500 to-yellow-600",
    shadowColor: "shadow-yellow-400/50",
  },
]

export function getCardTier(totalHours: number): CardTier | null {
  // Sort tiers by minHours in descending order to get the highest tier first
  const sortedTiers = [...cardTiers].sort((a, b) => b.minHours - a.minHours)

  for (const tier of sortedTiers) {
    if (totalHours >= tier.minHours) {
      return tier
    }
  }

  return null // No tier achieved
}

export function getNextTier(totalHours: number): { tier: CardTier; hoursNeeded: number } | null {
  // Sort tiers by minHours in ascending order
  const sortedTiers = [...cardTiers].sort((a, b) => a.minHours - b.minHours)

  for (const tier of sortedTiers) {
    if (totalHours < tier.minHours) {
      return {
        tier,
        hoursNeeded: tier.minHours - totalHours,
      }
    }
  }

  return null // All tiers achieved
}
