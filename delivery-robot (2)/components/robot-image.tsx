"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function RobotImage() {
  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture1-removebg-preview-FSuNZ1HsOBtIsKg07GMIf2m3AWxCJ5.png"
        alt="Pharoah LORM Robot"
        fill
        className="object-contain"
      />
      {/* Removed shadow effect animation for flat, modern look */}
    </motion.div>
  )
}
