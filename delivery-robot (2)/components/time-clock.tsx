"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function TimeClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Format time for GMT+2 (Cairo time)
  const formatTime = () => {
    // Create a date object and adjust for GMT+2
    const cairoTime = new Date(time)
    cairoTime.setHours(cairoTime.getHours() - cairoTime.getTimezoneOffset() / 60)

    // Format as HH:MM:SS
    return cairoTime.toISOString().substr(11, 8)
  }

  return (
    <Badge
      variant="outline"
      className="bg-amber-800/50 text-amber-200 border-amber-600 flex items-center gap-1 text-xs py-0 px-2"
    >
      <Clock className="h-3 w-3 mr-1" />
      <span>{formatTime()}</span>
    </Badge>
  )
}
