"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

const MAP_POINTS = [
  { lat: 30.0444, lng: 31.2357, name: "Cairo Tower" },
  { lat: 30.0286, lng: 31.2619, name: "Tahrir Square" },
  { lat: 30.0074, lng: 31.2286, name: "Giza Zoo" },
  { lat: 30.0455, lng: 31.224, name: "Egyptian Museum" },
  { lat: 30.0259, lng: 31.2497, name: "Nile River" },
  { lat: 30.0566, lng: 31.2262, name: "Al-Azhar Park" },
]

export default function DeliveryMap({ currentLocation, destination, progress, deliveryStage }) {
  const canvasRef = useRef(null)

  // Draw the map
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw background
    ctx.fillStyle = "#1e293b" // slate-800
    ctx.fillRect(0, 0, width, height)

    // Draw grid lines
    ctx.strokeStyle = "#334155" // slate-700
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i < height; i += 30) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
      ctx.stroke()
    }

    // Vertical grid lines
    for (let i = 0; i < width; i += 30) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, height)
      ctx.stroke()
    }

    // Draw map points
    MAP_POINTS.forEach((point) => {
      const x = mapCoordToPixel(point.lat, point.lng, width, height).x
      const y = mapCoordToPixel(point.lat, point.lng, width, height).y

      // Draw point
      ctx.fillStyle = "#64748b" // slate-500
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()

      // Draw label
      ctx.fillStyle = "#94a3b8" // slate-400
      ctx.font = "10px sans-serif"
      ctx.fillText(point.name, x + 8, y + 4)
    })

    // Draw route line
    const startPoint = mapCoordToPixel(destination.lat, destination.lng, width, height)
    const endPoint = mapCoordToPixel(currentLocation.lat, currentLocation.lng, width, height)

    // Draw dashed line for route
    ctx.strokeStyle = "#f59e0b" // amber-500
    ctx.lineWidth = 2
    ctx.setLineDash([5, 3])
    ctx.beginPath()
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(endPoint.x, endPoint.y)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw destination marker
    ctx.fillStyle = "#f59e0b" // amber-500
    ctx.beginPath()
    ctx.arc(startPoint.x, startPoint.y, 8, 0, Math.PI * 2)
    ctx.fill()

    // Draw destination pin
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(startPoint.x, startPoint.y, 4, 0, Math.PI * 2)
    ctx.fill()
  }, [currentLocation, destination])

  // Helper function to map lat/lng to pixel coordinates
  const mapCoordToPixel = (lat, lng, width, height) => {
    // Simple linear mapping for demo purposes
    // In a real app, you'd use proper map projection
    const minLat = 30.0074
    const maxLat = 30.0566
    const minLng = 31.224
    const maxLng = 31.2619

    const x = ((lng - minLng) / (maxLng - minLng)) * width
    const y = height - ((lat - minLat) / (maxLat - minLat)) * height

    return { x, y }
  }

  // Get pixel coordinates for current location
  const currentPoint = mapCoordToPixel(
    currentLocation.lat,
    currentLocation.lng,
    canvasRef.current?.width || 800,
    canvasRef.current?.height || 600,
  )

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full" />

      {/* Animated robot marker */}
      {currentPoint && (
        <motion.div
          className="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center"
          style={{
            left: currentPoint.x - 12,
            top: currentPoint.y - 12,
          }}
          initial={{ scale: 0 }}
          animate={{
            scale: [1, 1.2, 1],
            boxShadow: [
              "0 0 0 0 rgba(59, 130, 246, 0.5)",
              "0 0 0 10px rgba(59, 130, 246, 0)",
              "0 0 0 0 rgba(59, 130, 246, 0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-3 h-3 bg-white rounded-full"
          />
        </motion.div>
      )}

      {/* Status indicator */}
      {deliveryStage === "arrived" && currentPoint && (
        <motion.div
          className="absolute bg-green-500 text-white text-xs px-2 py-1 rounded"
          style={{
            left: currentPoint.x + 10,
            top: currentPoint.y - 20,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Arrived!
        </motion.div>
      )}
    </div>
  )
}
