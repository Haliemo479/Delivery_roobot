"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export function ResponsiveContainer({ children, className, aspectRatio = "15/9" }) {
  const containerRef = useRef(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [containerHeight, setContainerHeight] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)

  // Monitor container dimensions and check for overflow
  useEffect(() => {
    if (!containerRef.current) return

    const checkOverflow = () => {
      const container = containerRef.current
      if (!container) return

      // Get container dimensions
      const { clientWidth, clientHeight, scrollHeight } = container
      setContainerWidth(clientWidth)
      setContainerHeight(clientHeight)

      // Check if content overflows the container
      setIsOverflowing(scrollHeight > clientHeight)
    }

    // Initial check
    checkOverflow()

    // Set up resize observer
    const resizeObserver = new ResizeObserver(checkOverflow)
    resizeObserver.observe(containerRef.current)

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current)
      }
    }
  }, [])

  // Calculate aspect ratio
  const [aspectWidth, aspectHeight] = aspectRatio.split("/").map(Number)
  const aspectRatioPercentage = (aspectHeight / aspectWidth) * 100

  return (
    <div className={cn("relative w-full", className)} style={{ paddingBottom: `${aspectRatioPercentage}%` }}>
      <div
        ref={containerRef}
        className={cn("absolute inset-0 overflow-auto scrollbar-hide", isOverflowing && "scrollbar-hide")}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {children}

        {isOverflowing && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-primary-900 to-transparent pointer-events-none" />
        )}
      </div>
    </div>
  )
}
