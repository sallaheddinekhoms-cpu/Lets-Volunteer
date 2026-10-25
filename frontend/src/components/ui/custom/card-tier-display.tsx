"use client"

import React from "react"
import { motion } from "framer-motion"
import { getCardTier, getNextTier } from "@/utils/cardTiers"
import { Star } from "lucide-react"

interface CardTierDisplayProps {
  totalHours: number
  className?: string
}

export const CardTierDisplay: React.FC<CardTierDisplayProps> = ({ totalHours, className = "" }) => {
  const currentTier = getCardTier(totalHours)
  const nextTier = getNextTier(totalHours)

  if (currentTier) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-4 rounded-lg border-2 ${currentTier.gradient} ${currentTier.borderColor} ${className}`}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <currentTier.icon className={`w-6 h-6 ${currentTier.textColor}`} />
          <span className={`font-semibold ${currentTier.textColor}`}>{currentTier.name}</span>
        </div>
        <p className={`text-center text-sm ${currentTier.textColor}`}>
          تم تحقيق {totalHours} ساعة تطوع
        </p>
        {nextTier && (
          <p className={`text-center text-xs mt-1 ${currentTier.textColor} opacity-80`}>
            {nextTier.hoursNeeded} ساعات للوصول للـ{nextTier.tier.name}
          </p>
        )}
      </motion.div>
    )
  }

  if (nextTier) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-4 rounded-lg border-2 bg-gray-50 border-gray-200 ${className}`}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-6 h-6 text-gray-600" />
          <span className="font-semibold text-gray-700">ابدأ رحلة التطوع</span>
        </div>
        <p className="text-center text-sm text-gray-600">
          لديك {totalHours} ساعة تطوع
        </p>
        <p className="text-center text-xs mt-1 text-gray-500">
          {nextTier.hoursNeeded} ساعات للحصول على {nextTier.tier.name}
        </p>
        
        {/* Progress bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min((totalHours / nextTier.tier.minHours) * 100, 100)}%` 
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            {Math.round((totalHours / nextTier.tier.minHours) * 100)}% مكتمل
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-lg border-2 bg-gray-50 border-gray-200 ${className}`}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <Star className="w-6 h-6 text-gray-400" />
        <span className="font-semibold text-gray-500">لا توجد ساعات تطوع بعد</span>
      </div>
      <p className="text-center text-sm text-gray-500">
        ابدأ التطوع لكسب ساعات والحصول على البطاقات الخاصة
      </p>
    </motion.div>
  )
}