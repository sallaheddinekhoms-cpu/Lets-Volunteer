"use client"
import Link from 'next/link';
import { motion } from 'framer-motion';
import {ArrowRight } from 'lucide-react'; 

import React from 'react'

interface ReturnHeaderProps {
      label : string , 
      href : string
}

const ReturnHeader:React.FC<ReturnHeaderProps> = ({label = "العودة" , href="/"}) => {
  return (
      <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm"
>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

            <Link href={href} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                  <ArrowRight className="w-5 h-5 ml-2" />
                  {label}
            </Link>
      </div>
</motion.div>
  )
}

export default ReturnHeader
