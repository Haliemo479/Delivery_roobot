"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Battery, BatteryCharging, BatteryWarning, BatteryFull, BatteryLow } from "lucide-react"
import { cn } from "@/lib/utils"

export function BatteryIndicator({ level = 85, isCharging = false, className }) {
  const [batteryLevel, setBatteryLevel] = useState(level)
  const [charging, setCharging] = useState(isCharging)

  // Simulate battery drain or charge
  useEffect(() => {
    const interval = setInterval(() => {
      if (charging) {
        // Charging - increase battery level
        setBatteryLevel((prev) => (prev < 100 ? prev + 0.1 : 100))
      } else {
        // Discharging - decrease battery level
        setBatteryLevel((prev) => (prev > 0 ? prev - 0.05 : 0))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [charging])

  // Randomly toggle charging state for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      setCharging((prev) => (Math.random() > 0.7 ? !prev : prev))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Determine battery icon and color based on level and charging state
  const getBatteryDetails = () => {
    if (charging) {
      return {
        icon: BatteryCharging,
        color: "text-green-500",
        bgColor: "bg-green-500",
      }
    }

    if (batteryLevel <= 20) {
      return {
        icon: BatteryWarning,
        color: "text-red-500",
        bgColor: "bg-red-500",
      }
    }

    if (batteryLevel <= 40) {
      return {
        icon: BatteryLow,
        color: "text-secondary",
        bgColor: "bg-secondary",
      }
    }

    if (batteryLevel >= 90) {
      return {
        icon: BatteryFull,
        color: "text-green-500",
        bgColor: "bg-green-500",
      }
    }

    return {
      icon: Battery,
      color: "text-green-500",
      bgColor: "bg-green-500",
    }
  }

  const { icon: BatteryIcon, color, bgColor } = getBatteryDetails()

  return (
    <div className={cn("flex items-center", className)}>
      <div className="mr-2">
        <BatteryIcon className={cn("h-5 w-5", color)} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-sand-200">Battery</span>
          <div className="flex items-center">
            <span className={cn("text-xs font-medium", batteryLevel <= 20 ? "text-red-400" : "text-sand-200")}>
              {batteryLevel.toFixed(1)}%
            </span>
            {charging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                className="ml-1"
              >
                <span className="text-xs text-green-500">⚡</span>
              </motion.div>
            )}
          </div>
        </div>
        <div className="w-full h-2 bg-primary-700/50 rounded-full overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full", bgColor)}
            style={{ width: `${batteryLevel}%` }}
            animate={charging ? { opacity: [0.7, 1] } : {}}
            transition={{ duration: 1, repeat: charging ? Number.POSITIVE_INFINITY : 0, repeatType: "reverse" }}
          />
        </div>
        {batteryLevel <= 20 && !charging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-1 text-xs text-red-400 flex items-center"
          >
            <BatteryWarning className="h-3 w-3 mr-1" />
            <span>Low battery warning!</span>
          </motion.div>
        )}
        {charging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-1 text-xs text-green-400 flex items-center"
          >
            <BatteryCharging className="h-3 w-3 mr-1" />
            <span>Charging{batteryLevel >= 100 ? " complete" : ""}</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}
