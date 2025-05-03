"use client"

import { motion } from "framer-motion"

export default function EgyptianPatternBorder({ children }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Top border with improved animation */}
      <div className="absolute top-0 left-0 right-0 h-5 bg-primary-800/80 flex">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={`top-${i}`}
            className="w-8 h-5 bg-secondary-600"
            initial={{ opacity: 0.5 }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
              backgroundColor: ["#B3922D", "#D4AF37", "#B3922D"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: (i * 0.1) % 2,
            }}
          />
        ))}
      </div>

      {/* Bottom border with improved animation */}
      <div className="absolute bottom-0 left-0 right-0 h-5 bg-primary-800/80 flex">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={`bottom-${i}`}
            className="w-8 h-5 bg-secondary-600"
            initial={{ opacity: 0.5 }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
              backgroundColor: ["#B3922D", "#D4AF37", "#B3922D"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: (i * 0.1) % 2,
            }}
          />
        ))}
      </div>

      {/* Left border with improved animation */}
      <div className="absolute top-5 left-0 bottom-5 w-5 bg-primary-800/80 flex flex-col">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`left-${i}`}
            className="w-5 h-8 bg-secondary-600"
            initial={{ opacity: 0.5 }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
              backgroundColor: ["#B3922D", "#D4AF37", "#B3922D"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: (i * 0.1) % 2,
            }}
          />
        ))}
      </div>

      {/* Right border with improved animation */}
      <div className="absolute top-5 right-0 bottom-5 w-5 bg-primary-800/80 flex flex-col">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`right-${i}`}
            className="w-5 h-8 bg-secondary-600"
            initial={{ opacity: 0.5 }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
              backgroundColor: ["#B3922D", "#D4AF37", "#B3922D"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: (i * 0.1) % 2,
            }}
          />
        ))}
      </div>

      {/* Content with improved padding */}
      <div className="absolute top-5 left-5 right-5 bottom-5">{children}</div>
    </div>
  )
}
