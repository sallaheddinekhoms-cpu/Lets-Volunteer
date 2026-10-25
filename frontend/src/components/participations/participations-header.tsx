"use client"
import React from 'react'
import { motion } from 'framer-motion';

const ParticipationHeader = () => {
  return (
      <div className="text-center space-y-4 mb-12">
      <motion.div
        className="inline-block bg-primary/5 rounded-lg px-6 py-2 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-primary font-medium">طلبات المشاركة</span>
      </motion.div>
      <motion.h1 
        className="text-4xl font-bold text-primary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        إدارة طلبات المتطوعين
      </motion.h1>
      <motion.p 
        className="text-muted-foreground text-lg max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        تتبع وإدارة طلبات المشاركة في الفرص التطوعية
      </motion.p>
    </div>
  )
}

export default ParticipationHeader
