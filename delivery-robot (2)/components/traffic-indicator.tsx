"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Car, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export function TrafficIndicator({ trafficLevel = "moderate", className }) {
  // Traffic levels: low, moderate, heavy, severe
  const getTrafficColor = () => {
    switch (trafficLevel) {
      case "low":
        return "bg-green-500"
      case "moderate":
        return "bg-secondary"
      case "heavy":
        return "bg-orange-500"
      case "severe":
        return "bg-red-500"
      default:
        return "bg-secondary"
    }
  }

  const getTrafficDelay = () => {
    switch (trafficLevel) {
      case "low":
        return "+0-2 min"
      case "moderate":
        return "+3-5 min"
      case "heavy":
        return "+5-10 min"
      case "severe":
        return "+10-15 min"
      default:
        return "+3-5 min"
    }
  }

  const getTrafficIcon = () => {
    if (trafficLevel === "severe" || trafficLevel === "heavy") {
      return AlertTriangle
    }
    return Car
  }

  const TrafficIcon = getTrafficIcon()

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex items-center mr-2">
        <TrafficIcon
          className={cn(
            "h-4 w-4",
            trafficLevel === "low"
              ? "text-green-500"
              : trafficLevel === "moderate"
                ? "text-secondary"
                : trafficLevel === "heavy"
                  ? "text-orange-500"
                  : "text-red-500",
          )}
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-sand-200">Traffic</span>
          <div className="flex items-center">
            <span className="text-xs font-medium capitalize text-sand-200">{trafficLevel}</span>
          </div>
        </div>
        <div className="flex items-center mt-1">
          <div className="w-full h-1.5 bg-primary-700/50 rounded-full overflow-hidden flex">
            <motion.div className="h-full bg-green-500 rounded-full" style={{ width: "25%" }} />
            <motion.div
              className="h-full bg-secondary rounded-full"
              style={{ width: "25%" }}
              animate={trafficLevel === "moderate" ? { opacity: [0.7, 1] } : {}}
              transition={{
                duration: 1,
                repeat: trafficLevel === "moderate" ? Number.POSITIVE_INFINITY : 0,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="h-full bg-orange-500 rounded-full"
              style={{ width: "25%" }}
              animate={trafficLevel === "heavy" ? { opacity: [0.7, 1] } : {}}
              transition={{
                duration: 1,
                repeat: trafficLevel === "heavy" ? Number.POSITIVE_INFINITY : 0,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="h-full bg-red-500 rounded-full"
              style={{ width: "25%" }}
              animate={trafficLevel === "severe" ? { opacity: [0.7, 1] } : {}}
              transition={{
                duration: 1,
                repeat: trafficLevel === "severe" ? Number.POSITIVE_INFINITY : 0,
                repeatType: "reverse",
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-end mt-1">
          <Clock className="h-3 w-3 mr-1 text-sand-400/70" />
          <span className="text-xs text-sand-400/70">Delay: {getTrafficDelay()}</span>
        </div>
      </div>
    </div>
  )
}
