"use client"
import React from 'react'
import { motion } from "framer-motion";
import { 
  Leaf, 
  Heart, 
  HandHeart
} from "lucide-react";
const BackgroundDecorations = (
      {children } : {children : React.ReactNode}
) => {
  return (
    <>
    <motion.div
        className="absolute top-20 left-10 text-primary/10"
        animate={{ rotate: [0, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Leaf size={80} />
      </motion.div>

      <motion.div
        className="absolute top-40 right-20 text-secondary/10"
        animate={{ rotate: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <HandHeart size={100} />
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-1/4 text-primary/10"
        animate={{ rotate: [0, 10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Heart size={70} />
      </motion.div>

      {/* Background Gradients */}
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl" />

      {children }



      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 200L60 186.7C120 173.3 240 146.7 360 133.3C480 120 600 120 720 133.3C840 146.7 960 173.3 1080 173.3C1200 173.3 1320 146.7 1380 133.3L1440 120V200H1380C1320 200 1200 200 1080 200C960 200 840 200 720 200C600 200 480 200 360 200C240 200 120 200 60 200H0Z"
            fill="currentColor"
            className="text-primary opacity-5"
          />
        </svg>
      </div>


</>
  )
}

export default BackgroundDecorations
