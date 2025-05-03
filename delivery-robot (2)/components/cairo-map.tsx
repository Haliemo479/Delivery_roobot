"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Updated Cairo landmarks with accurate GPS coordinates
const CAIRO_LANDMARKS = [
  { lat: 30.0444, lng: 31.2357, name: "Cairo Tower", type: "landmark" },
  { lat: 30.0286, lng: 31.2619, name: "Tahrir Square", type: "landmark" },
  { lat: 29.9792, lng: 31.1342, name: "Great Pyramids of Giza", type: "landmark" },
  { lat: 30.0505, lng: 31.2486, name: "Egyptian Museum", type: "landmark" },
  { lat: 30.0259, lng: 31.2497, name: "Nile Ritz-Carlton", type: "hotel" },
  { lat: 30.0566, lng: 31.2262, name: "Al-Azhar Park", type: "park" },
  { lat: 30.0454, lng: 31.223, name: "Khan el-Khalili", type: "market" },
  { lat: 30.0128, lng: 31.2269, name: "Salah El Din Citadel", type: "landmark" },
  { lat: 30.0588, lng: 31.3247, name: "Nasr City", type: "district" },
  { lat: 30.0318, lng: 31.4082, name: "New Cairo", type: "district" },
  { lat: 30.0074, lng: 31.4913, name: "Cairo New Capital", type: "district" },
  { lat: 30.0283, lng: 31.2305, name: "Downtown Cairo", type: "district" },
  { lat: 30.0626, lng: 31.2497, name: "Heliopolis", type: "district" },
  { lat: 30.07, lng: 31.0192, name: "6th of October City", type: "district" },
  { lat: 30.0167, lng: 31.2167, name: "Maadi", type: "district" },
  { lat: 30.0472, lng: 31.3353, name: "EAEAT", type: "university" },
]

// Major streets in Cairo
const CAIRO_STREETS = [
  { start: { lat: 30.0444, lng: 31.2357 }, end: { lat: 30.0626, lng: 31.2497 }, name: "Salah Salem Road" },
  { start: { lat: 30.0286, lng: 31.2619 }, end: { lat: 30.0505, lng: 31.2486 }, name: "Ramses Street" },
  { start: { lat: 30.0283, lng: 31.2305 }, end: { lat: 30.0167, lng: 31.2167 }, name: "Corniche El Nil" },
  { start: { lat: 30.0588, lng: 31.3247 }, end: { lat: 30.0318, lng: 31.4082 }, name: "Suez Road" },
  { start: { lat: 30.0472, lng: 31.3353 }, end: { lat: 30.0588, lng: 31.3247 }, name: "Mustafa El-Nahas" },
  { start: { lat: 30.0626, lng: 31.2497 }, end: { lat: 30.0588, lng: 31.3247 }, name: "El-Orouba Road" },
  { start: { lat: 30.0283, lng: 31.2305 }, end: { lat: 30.0444, lng: 31.2357 }, name: "26th of July Corridor" },
  { start: { lat: 30.0259, lng: 31.2497 }, end: { lat: 30.0286, lng: 31.2619 }, name: "Qasr El Nil Street" },
  { start: { lat: 30.0472, lng: 31.3353 }, end: { lat: 30.0318, lng: 31.4082 }, name: "North 90 Street" },
]

// Traffic hotspots with congestion levels
const TRAFFIC_HOTSPOTS = [
  { lat: 30.0444, lng: 31.2357, level: "heavy", radius: 0.01 },
  { lat: 30.0286, lng: 31.2619, level: "severe", radius: 0.015 },
  { lat: 30.0588, lng: 31.3247, level: "moderate", radius: 0.008 },
  { lat: 30.0626, lng: 31.2497, level: "heavy", radius: 0.012 },
  { lat: 30.0472, lng: 31.3353, level: "low", radius: 0.005 },
]

// Helper function to map lat/lng to pixel coordinates
const mapCoordToPixel = (lat, lng, width, height) => {
  // Map coordinates for Cairo area
  const minLat = 29.97
  const maxLat = 30.07
  const minLng = 31.13
  const maxLng = 31.5

  const x = ((lng - minLng) / (maxLng - minLng)) * width
  const y = height - ((lat - minLat) / (maxLat - minLat)) * height

  return { x, y }
}

// Calculate distance between two points
const calculateDistance = (point1, point2) => {
  return Math.sqrt(Math.pow(point2.lat - point1.lat, 2) + Math.pow(point2.lng - point1.lng, 2))
}

// Check if a point is within a traffic hotspot
const isInTrafficHotspot = (point) => {
  for (const hotspot of TRAFFIC_HOTSPOTS) {
    const distance = calculateDistance(point, hotspot)
    if (distance <= hotspot.radius) {
      return hotspot.level
    }
  }
  return null
}

export default function CairoMap({
  currentLocation,
  destination,
  progress,
  deliveryStage,
  routes = [],
  selectedRouteIndex = 0,
  showAllRoutes = false,
}) {
  const canvasRef = useRef(null)
  const [trafficUpdate, setTrafficUpdate] = useState(Date.now())
  const canvasWidth = 800
  const canvasHeight = 600

  // Update traffic every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficUpdate(Date.now())
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  // Draw the static map
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw background - realistic Cairo terrain
    drawMapBackground(ctx, width, height)

    // Draw Nile River
    drawNileRiver(ctx, width, height)

    // Draw streets
    drawStreets(ctx, width, height)

    // Draw traffic
    drawTraffic(ctx, width, height)

    // Draw landmarks
    drawLandmarks(ctx, width, height)

    // Get start and end points
    const startPoint = mapCoordToPixel(currentLocation.lat, currentLocation.lng, width, height)
    const endPoint = mapCoordToPixel(destination.lat, destination.lng, width, height)

    // Draw routes if available
    if (routes && routes.length > 0) {
      if (showAllRoutes) {
        // Draw all routes with lower opacity
        routes.forEach((route, index) => {
          const isSelected = index === selectedRouteIndex
          drawRouteWithWaypoints(ctx, startPoint, endPoint, route, isSelected ? 1 : 0.3, index)
        })
      } else {
        // Draw only the selected route
        const selectedRoute = routes[selectedRouteIndex]
        drawRouteWithWaypoints(ctx, startPoint, endPoint, selectedRoute, 1, selectedRouteIndex)
      }
    } else {
      // Draw default direct route line
      drawRouteLine(ctx, startPoint, endPoint, "#F59E0B", 2)
    }

    // Draw current location marker
    drawLocationMarker(ctx, startPoint, "current")

    // Draw destination marker
    drawLocationMarker(ctx, endPoint, "destination")
  }, [
    currentLocation.lat,
    currentLocation.lng,
    destination.lat,
    destination.lng,
    deliveryStage,
    routes,
    selectedRouteIndex,
    showAllRoutes,
    trafficUpdate,
  ])

  // Draw realistic map background
  const drawMapBackground = (ctx, width, height) => {
    // Create gradient for the terrain
    const bgGradient = ctx.createLinearGradient(0, 0, width, height)
    bgGradient.addColorStop(0, "#E8E0D5") // Light sand color
    bgGradient.addColorStop(0.6, "#D8CFC5") // Medium sand color
    bgGradient.addColorStop(1, "#C8BFB5") // Darker sand color

    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, width, height)

    // Add subtle texture
    ctx.fillStyle = "rgba(0, 0, 0, 0.03)"
    for (let i = 0; i < width; i += 4) {
      for (let j = 0; j < height; j += 4) {
        if (Math.random() > 0.5) {
          ctx.fillRect(i, j, 2, 2)
        }
      }
    }
  }

  // Draw Nile River
  const drawNileRiver = (ctx, width, height) => {
    // Create gradient for water
    const nileGradient = ctx.createLinearGradient(width * 0.4, 0, width * 0.5, 0)
    nileGradient.addColorStop(0, "#3B82F6") // Medium blue
    nileGradient.addColorStop(0.5, "#60A5FA") // Light blue
    nileGradient.addColorStop(1, "#3B82F6") // Medium blue

    ctx.fillStyle = nileGradient

    // Draw main Nile path
    ctx.beginPath()
    ctx.moveTo(width * 0.45, 0)
    ctx.bezierCurveTo(width * 0.4, height * 0.3, width * 0.5, height * 0.5, width * 0.42, height)
    ctx.lineTo(width * 0.48, height)
    ctx.bezierCurveTo(width * 0.55, height * 0.5, width * 0.5, height * 0.3, width * 0.5, 0)
    ctx.closePath()
    ctx.fill()

    // Add Nile label
    ctx.fillStyle = "#1E40AF" // Blue-800
    ctx.font = "bold 12px sans-serif"
    ctx.fillText("Nile River", width * 0.46, height * 0.5)
  }

  // Draw streets
  const drawStreets = (ctx, width, height) => {
    // Draw major streets
    CAIRO_STREETS.forEach((street) => {
      const start = mapCoordToPixel(street.start.lat, street.start.lng, width, height)
      const end = mapCoordToPixel(street.end.lat, street.end.lng, width, height)

      // Draw street line
      ctx.strokeStyle = "#94A3B8" // Slate-400
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(start.x, start.y) // Slate-400
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()

      // Add street name
      const midX = (start.x + end.x) / 2
      const midY = (start.y + end.y) / 2

      // Draw street name background for better readability
      const textWidth = ctx.measureText(street.name).width
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.fillRect(midX - textWidth / 2 - 2, midY - 8, textWidth + 4, 16)

      // Draw street name
      ctx.fillStyle = "#1E293B" // Slate-800
      ctx.font = "9px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(street.name, midX, midY + 3)
    })

    // Draw secondary roads
    ctx.strokeStyle = "#CBD5E1" // Slate-300
    ctx.lineWidth = 0.8

    // Secondary roads grid
    for (let i = 1; i < 10; i++) {
      const y = height * (i * 0.1)

      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    for (let i = 1; i < 10; i++) {
      const x = width * (i * 0.1)

      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
  }

  // Draw traffic
  const drawTraffic = (ctx, width, height) => {
    TRAFFIC_HOTSPOTS.forEach((hotspot) => {
      const point = mapCoordToPixel(hotspot.lat, hotspot.lng, width, height)

      // Set color based on traffic level
      let color
      switch (hotspot.level) {
        case "low":
          color = "rgba(34, 197, 94, 0.3)" // Green-500 with opacity
          break
        case "moderate":
          color = "rgba(245, 158, 11, 0.3)" // Amber-500 with opacity
          break
        case "heavy":
          color = "rgba(249, 115, 22, 0.3)" // Orange-500 with opacity
          break
        case "severe":
          color = "rgba(239, 68, 68, 0.3)" // Red-500 with opacity
          break
        default:
          color = "rgba(245, 158, 11, 0.3)" // Default amber
      }

      // Draw traffic circle
      const radius = hotspot.radius * Math.min(width, height) * 5
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
      ctx.fill()

      // Add traffic icon
      if (hotspot.level === "heavy" || hotspot.level === "severe") {
        ctx.fillStyle = hotspot.level === "severe" ? "#EF4444" : "#F97316"
        ctx.font = "bold 10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("!", point.x, point.y)
      }
    })
  }

  // Draw landmarks
  const drawLandmarks = (ctx, width, height) => {
    CAIRO_LANDMARKS.forEach((landmark) => {
      const { x, y } = mapCoordToPixel(landmark.lat, landmark.lng, width, height)

      // Draw landmark marker with different styles based on type
      let markerColor, markerSize

      switch (landmark.type) {
        case "landmark":
          markerColor = "#475569" // Slate-600
          markerSize = 5
          break
        case "hotel":
          markerColor = "#8B5CF6" // Violet-500
          markerSize = 4
          break
        case "park":
          markerColor = "#22C55E" // Green-500
          markerSize = 4
          break
        case "market":
          markerColor = "#F97316" // Orange-500
          markerSize = 4
          break
        case "district":
          markerColor = "#64748B" // Slate-500
          markerSize = 6
          break
        case "university":
          markerColor = "#EF4444" // Red-500
          markerSize = 6
          break
        default:
          markerColor = "#475569" // Slate-600
          markerSize = 4
      }

      // Draw landmark marker
      ctx.fillStyle = markerColor
      ctx.beginPath()
      ctx.arc(x, y, markerSize, 0, Math.PI * 2)
      ctx.fill()

      // Draw white center for better visibility
      ctx.fillStyle = "#FFFFFF"
      ctx.beginPath()
      ctx.arc(x, y, markerSize / 2, 0, Math.PI * 2)
      ctx.fill()

      // Draw label with background for better readability
      const textWidth = ctx.measureText(landmark.name).width

      // Background
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.fillRect(x + 6, y - 5, textWidth + 4, 12)

      // Text
      ctx.fillStyle = "#1E293B" // Slate-800
      ctx.font = "9px sans-serif"
      ctx.fillText(landmark.name, x + 8, y + 3)
    })
  }

  // Draw route line
  const drawRouteLine = (ctx, startPoint, endPoint, color = "#F59E0B", width = 2, opacity = 1) => {
    // Main route line
    ctx.strokeStyle = color
    ctx.globalAlpha = opacity
    ctx.lineWidth = width
    ctx.setLineDash([5, 3])
    ctx.beginPath()
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(endPoint.x, endPoint.y)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.globalAlpha = 1
  }

  // Draw route with waypoints
  const drawRouteWithWaypoints = (ctx, startPoint, endPoint, route, opacity = 1, routeIndex = 0) => {
    if (!route || !route.waypoints) return

    // Define colors for different routes
    const routeColors = ["#F59E0B", "#3B82F6", "#10B981", "#8B5CF6", "#EC4899"]
    const color = routeColors[routeIndex % routeColors.length]

    ctx.strokeStyle = color
    ctx.globalAlpha = opacity
    ctx.lineWidth = 2
    ctx.setLineDash([5, 3])

    // Start the path
    ctx.beginPath()
    ctx.moveTo(startPoint.x, startPoint.y)

    // Draw through each waypoint
    route.waypoints.forEach((waypoint) => {
      const point = mapCoordToPixel(waypoint.lat, waypoint.lng, canvasWidth, canvasHeight)
      ctx.lineTo(point.x, point.y)

      // Draw small waypoint marker
      if (opacity > 0.9) {
        // Only for selected route
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
        ctx.fill()

        // Check for traffic at this waypoint
        const trafficLevel = isInTrafficHotspot(waypoint)
        if (trafficLevel) {
          // Draw traffic indicator
          ctx.fillStyle =
            trafficLevel === "severe"
              ? "#EF4444"
              : trafficLevel === "heavy"
                ? "#F97316"
                : trafficLevel === "moderate"
                  ? "#F59E0B"
                  : "#22C55E"
          ctx.beginPath()
          ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
    })

    // Complete the path to destination
    ctx.lineTo(endPoint.x, endPoint.y)
    ctx.stroke()

    // Reset dash and opacity
    ctx.setLineDash([])
    ctx.globalAlpha = 1
  }

  // Draw location marker
  const drawLocationMarker = (ctx, point, type) => {
    if (type === "current") {
      // Current location marker
      ctx.fillStyle = "#3B82F6" // Blue-500
      ctx.beginPath()
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2)
      ctx.fill()

      // White center
      ctx.fillStyle = "#FFFFFF"
      ctx.beginPath()
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Destination marker
      ctx.fillStyle = "#F59E0B" // Amber-500
      ctx.beginPath()
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2)
      ctx.fill()

      // White center
      ctx.fillStyle = "#FFFFFF"
      ctx.beginPath()
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} className="w-full h-full" />

      {/* Status indicator */}
      {deliveryStage === "arrived" && (
        <div
          className="absolute bg-green-500 text-white text-xs px-2 py-1 rounded"
          style={{
            left: mapCoordToPixel(destination.lat, destination.lng, canvasWidth, canvasHeight).x + 10,
            top: mapCoordToPixel(destination.lat, destination.lng, canvasWidth, canvasHeight).y - 20,
          }}
        >
          Arrived!
        </div>
      )}

      {/* Traffic alert indicators */}
      {TRAFFIC_HOTSPOTS.filter((h) => h.level === "severe").map((hotspot, index) => {
        const point = mapCoordToPixel(hotspot.lat, hotspot.lng, canvasWidth, canvasHeight)
        return (
          <motion.div
            key={`traffic-${index}`}
            className="absolute"
            style={{
              left: point.x - 12,
              top: point.y - 12,
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              <span>Heavy Traffic</span>
            </Badge>
          </motion.div>
        )
      })}
    </div>
  )
}
