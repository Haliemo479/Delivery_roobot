"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

// Add the new map overlay and controls components to the EnhancedCairoMap
import { MapOverlay } from "@/components/map-overlay"
import { EnhancedMapControls } from "@/components/enhanced-map-controls"

// Updated Cairo landmarks with accurate GPS coordinates based on Google Maps
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
  { lat: 30.0472, lng: 31.3353, name: "EAEAT", type: "university" },
]

// Major streets in Cairo
const CAIRO_STREETS = [
  {
    name: "El-Nasr Road",
    points: [
      { lat: 30.0588, lng: 31.3247 }, // Nasr City
      { lat: 30.0505, lng: 31.3 },
      { lat: 30.0444, lng: 31.27 },
      { lat: 30.04, lng: 31.25 },
    ],
  },
  {
    name: "Salah Salem Road",
    points: [
      { lat: 30.06, lng: 31.33 },
      { lat: 30.055, lng: 31.31 },
      { lat: 30.05, lng: 31.29 },
      { lat: 30.045, lng: 31.27 },
    ],
  },
  {
    name: "Cairo-Suez Road",
    points: [
      { lat: 30.0588, lng: 31.3247 }, // Nasr City
      { lat: 30.05, lng: 31.35 },
      { lat: 30.04, lng: 31.38 },
      { lat: 30.0318, lng: 31.4082 }, // New Cairo
    ],
  },
  {
    name: "Ring Road",
    points: [
      { lat: 30.07, lng: 31.24 },
      { lat: 30.065, lng: 31.28 },
      { lat: 30.06, lng: 31.32 },
      { lat: 30.055, lng: 31.36 },
      { lat: 30.05, lng: 31.4 },
      { lat: 30.04, lng: 31.43 },
    ],
  },
  {
    name: "EAEAT Road",
    points: [
      { lat: 30.0318, lng: 31.4082 }, // New Cairo
      { lat: 30.03, lng: 31.42 },
      { lat: 30.0472, lng: 31.3353 }, // EAEAT
    ],
  },
]

// Traffic congestion areas
const TRAFFIC_HOTSPOTS = [
  { lat: 30.0444, lng: 31.27, radius: 0.01, severity: "heavy" },
  { lat: 30.05, lng: 31.31, radius: 0.015, severity: "moderate" },
  { lat: 30.035, lng: 31.38, radius: 0.008, severity: "severe" },
  { lat: 30.06, lng: 31.25, radius: 0.012, severity: "moderate" },
]

// Helper function to map lat/lng to pixel coordinates
const mapCoordToPixel = (lat, lng, width, height) => {
  // Adjusted coordinates to match the Google Maps image of Cairo
  const minLat = 29.95
  const maxLat = 30.15
  const minLng = 31.1
  const maxLng = 31.6

  const x = ((lng - minLng) / (maxLng - minLng)) * width
  const y = height - ((lat - minLat) / (maxLat - minLat)) * height

  return { x, y }
}

export default function EnhancedCairoMap({
  currentLocation,
  destination,
  progress,
  deliveryStage,
  routes = [],
  selectedRouteIndex = 0,
  showAllRoutes = false,
  showTraffic = true,
  showStreetNames = true,
  eta,
  trafficLevel,
}) {
  const canvasRef = useRef(null)
  const [trafficData, setTrafficData] = useState(TRAFFIC_HOTSPOTS)
  const canvasWidth = 800
  const canvasHeight = 480

  // Simulate changing traffic conditions
  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficData((prev) =>
        prev.map((spot) => ({
          ...spot,
          severity:
            Math.random() > 0.7
              ? spot.severity === "severe"
                ? "heavy"
                : spot.severity === "heavy"
                  ? "moderate"
                  : "heavy"
              : spot.severity,
        })),
      )
    }, 30000)

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

    // Draw background - Google Maps style
    drawMapBackground(ctx, width, height)

    // Draw Nile River
    drawNileRiver(ctx, width, height)

    // Draw streets
    drawStreets(ctx, width, height)

    // Draw traffic if enabled
    if (showTraffic) {
      drawTraffic(ctx, width, height)
    }

    // Draw landmarks
    drawLandmarks(ctx, width, height)

    // Draw street names if enabled
    if (showStreetNames) {
      drawStreetNames(ctx, width, height)
    }

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
      drawRouteLine(ctx, startPoint, endPoint, "#D4AF37", 2)
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
    showTraffic,
    showStreetNames,
    trafficData,
    eta,
    trafficLevel,
  ])

  // Replace the entire drawMapBackground function with this implementation that uses the Google Maps image
  const drawMapBackground = (ctx, width, height) => {
    // Create an image object for the Google Maps background
    const mapImage = new Image()
    mapImage.crossOrigin = "anonymous"
    mapImage.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xMDr83qQWqaqhaxOf4LfXARE996I34.png"

    // Draw the map image when it loads
    mapImage.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Draw the map image to fit the canvas
      ctx.drawImage(mapImage, 0, 0, width, height)

      // Redraw other elements on top of the map
      drawStreets(ctx, width, height)
      if (showTraffic) {
        drawTraffic(ctx, width, height)
      }
      drawLandmarks(ctx, width, height)
      if (showStreetNames) {
        drawStreetNames(ctx, width, height)
      }

      // Redraw current location and destination markers
      const startPoint = mapCoordToPixel(currentLocation.lat, currentLocation.lng, width, height)
      const endPoint = mapCoordToPixel(destination.lat, destination.lng, width, height)

      // Draw routes
      if (routes && routes.length > 0) {
        if (showAllRoutes) {
          routes.forEach((route, index) => {
            const isSelected = index === selectedRouteIndex
            drawRouteWithWaypoints(ctx, startPoint, endPoint, route, isSelected ? 1 : 0.3, index)
          })
        } else {
          const selectedRoute = routes[selectedRouteIndex]
          drawRouteWithWaypoints(ctx, startPoint, endPoint, selectedRoute, 1, selectedRouteIndex)
        }
      } else {
        drawRouteLine(ctx, startPoint, endPoint, "#D4AF37", 2)
      }

      // Draw markers
      drawLocationMarker(ctx, startPoint, "current")
      drawLocationMarker(ctx, endPoint, "destination")
    }

    // Draw a placeholder color until the image loads
    ctx.fillStyle = "#F8F9FA"
    ctx.fillRect(0, 0, width, height)
  }

  // Draw Nile River
  const drawNileRiver = (ctx, width, height) => {
    // Create gradient for water - Google Maps blue
    const nileGradient = ctx.createLinearGradient(width * 0.4, 0, width * 0.5, 0)
    nileGradient.addColorStop(0, "#A5D7F9") // Light blue
    nileGradient.addColorStop(0.5, "#89CFF0") // Medium blue
    nileGradient.addColorStop(1, "#A5D7F9") // Light blue

    ctx.fillStyle = nileGradient

    // Draw main Nile path
    ctx.beginPath()
    ctx.moveTo(width * 0.45, 0)
    ctx.bezierCurveTo(width * 0.4, height * 0.3, width * 0.5, height * 0.5, width * 0.42, height)
    ctx.lineTo(width * 0.48, height)
    ctx.bezierCurveTo(width * 0.55, height * 0.5, width * 0.5, height * 0.3, width * 0.5, 0)
    ctx.closePath()
    ctx.fill()

    // Add "Nile River" label
    ctx.fillStyle = "#1A73E8" // Google Maps blue
    ctx.font = "italic 10px Arial"
    ctx.fillText("Nile River", width * 0.46, height * 0.5)
  }

  // Draw streets
  const drawStreets = (ctx, width, height) => {
    // Draw main roads - Google Maps style
    ctx.strokeStyle = "#FFFFFF" // White roads
    ctx.lineWidth = 4 // Thicker for main roads

    // Draw major streets with white background
    CAIRO_STREETS.forEach((street) => {
      if (street.points.length < 2) return

      ctx.beginPath()

      const firstPoint = mapCoordToPixel(street.points[0].lat, street.points[0].lng, width, height)
      ctx.moveTo(firstPoint.x, firstPoint.y)

      for (let i = 1; i < street.points.length; i++) {
        const point = mapCoordToPixel(street.points[i].lat, street.points[i].lng, width, height)
        ctx.lineTo(point.x, point.y)
      }

      ctx.stroke()
    })

    // Draw road outlines
    ctx.strokeStyle = "#E1E1E1" // Light gray for road borders
    ctx.lineWidth = 5

    CAIRO_STREETS.forEach((street) => {
      if (street.points.length < 2) return

      ctx.beginPath()

      const firstPoint = mapCoordToPixel(street.points[0].lat, street.points[0].lng, width, height)
      ctx.moveTo(firstPoint.x, firstPoint.y)

      for (let i = 1; i < street.points.length; i++) {
        const point = mapCoordToPixel(street.points[i].lat, street.points[i].lng, width, height)
        ctx.lineTo(point.x, point.y)
      }

      ctx.stroke()
    })

    // Draw road centers
    ctx.strokeStyle = "#FFFFFF" // White for road centers
    ctx.lineWidth = 3

    CAIRO_STREETS.forEach((street) => {
      if (street.points.length < 2) return

      ctx.beginPath()

      const firstPoint = mapCoordToPixel(street.points[0].lat, street.points[0].lng, width, height)
      ctx.moveTo(firstPoint.x, firstPoint.y)

      for (let i = 1; i < street.points.length; i++) {
        const point = mapCoordToPixel(street.points[i].lat, street.points[i].lng, width, height)
        ctx.lineTo(point.x, point.y)
      }

      ctx.stroke()
    })

    // Draw secondary roads
    ctx.strokeStyle = "#F0F0F0" // Lighter white for secondary roads
    ctx.lineWidth = 1

    // Secondary roads grid - Google Maps style
    for (let i = 1; i < 20; i++) {
      const y = height * (i * 0.05)

      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    for (let i = 1; i < 20; i++) {
      const x = width * (i * 0.05)

      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
  }

  // Draw street names
  const drawStreetNames = (ctx, width, height) => {
    ctx.fillStyle = "#5B5B5B" // Google Maps dark gray text
    ctx.font = "bold 9px Arial"

    CAIRO_STREETS.forEach((street) => {
      if (street.points.length < 2) return

      // Find middle point of the street for label placement
      const middleIndex = Math.floor(street.points.length / 2)
      const point = mapCoordToPixel(street.points[middleIndex].lat, street.points[middleIndex].lng, width, height)

      // Draw street name with background for better readability
      const textWidth = ctx.measureText(street.name).width
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.fillRect(point.x - textWidth / 2 - 2, point.y - 8, textWidth + 4, 12)

      ctx.fillStyle = "#5B5B5B" // Google Maps dark gray text
      ctx.textAlign = "center"
      ctx.fillText(street.name, point.x, point.y)
      ctx.textAlign = "left" // Reset alignment
    })
  }

  // Draw traffic
  const drawTraffic = (ctx, width, height) => {
    trafficData.forEach((spot) => {
      const { x, y } = mapCoordToPixel(spot.lat, spot.lng, width, height)
      const pixelRadius = spot.radius * width * 0.1

      // Create gradient for traffic hotspot - Google Maps style
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, pixelRadius)

      if (spot.severity === "severe") {
        gradient.addColorStop(0, "rgba(217, 48, 37, 0.6)") // Google Maps red with opacity
        gradient.addColorStop(1, "rgba(217, 48, 37, 0)")
      } else if (spot.severity === "heavy") {
        gradient.addColorStop(0, "rgba(249, 171, 0, 0.5)") // Google Maps orange with opacity
        gradient.addColorStop(1, "rgba(249, 171, 0, 0)")
      } else {
        gradient.addColorStop(0, "rgba(255, 205, 0, 0.4)") // Google Maps yellow with opacity
        gradient.addColorStop(1, "rgba(255, 205, 0, 0)")
      }

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, pixelRadius, 0, Math.PI * 2)
      ctx.fill()

      // Add traffic icon for severe traffic - Google Maps style
      if (spot.severity === "severe") {
        ctx.fillStyle = "#D93025" // Google Maps red
        ctx.font = "8px Arial"
        ctx.fillText("⚠️ Traffic", x + 5, y - 5)
      }
    })
  }

  // Draw landmarks
  const drawLandmarks = (ctx, width, height) => {
    CAIRO_LANDMARKS.forEach((landmark) => {
      const { x, y } = mapCoordToPixel(landmark.lat, landmark.lng, width, height)

      // Different styles based on landmark type - Google Maps style
      let markerColor = "#5B5B5B" // Default: Dark gray
      let markerSize = 3

      switch (landmark.type) {
        case "landmark":
          markerColor = "#1A73E8" // Google Maps blue
          markerSize = 4
          break
        case "hotel":
          markerColor = "#188038" // Google Maps green
          markerSize = 3
          break
        case "park":
          markerColor = "#34A853" // Google Maps green
          markerSize = 3
          break
        case "market":
          markerColor = "#D4AF37" // Gold
          markerSize = 3
          break
        case "district":
          markerColor = "#5B5B5B" // Gray
          markerSize = 4
          break
        case "university":
          markerColor = "#EA4335" // Google Maps red
          markerSize = 5
          break
      }

      // Draw landmark marker - Google Maps style
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
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.fillRect(x + 6, y - 4, textWidth + 4, 12)

      // Draw label text
      ctx.fillStyle = "#5B5B5B" // Google Maps dark gray text
      ctx.font = "8px Arial"
      ctx.fillText(landmark.name, x + 8, y + 4)
    })
  }

  // Update the drawRouteLine function for better visibility
  const drawRouteLine = (ctx, startPoint, endPoint, color = "#4285F4", width = 3, opacity = 1) => {
    // Draw route shadow for depth
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
    ctx.globalAlpha = opacity * 0.5
    ctx.lineWidth = width + 2
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.moveTo(startPoint.x, startPoint.y + 1)
    ctx.lineTo(endPoint.x, endPoint.y + 1)
    ctx.stroke()

    // Main route line - Google Maps style
    ctx.strokeStyle = color
    ctx.globalAlpha = opacity
    ctx.lineWidth = width
    ctx.beginPath()
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(endPoint.x, endPoint.y)
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  // Update the drawRouteWithWaypoints function for better visibility
  const drawRouteWithWaypoints = (ctx, startPoint, endPoint, route, opacity = 1, routeIndex = 0) => {
    if (!route || !route.waypoints) return

    // Define colors for different routes - Google Maps style
    const routeColors = ["#4285F4", "#0F9D58", "#F4B400", "#DB4437", "#4A148C"]
    const color = routeColors[routeIndex % routeColors.length]

    // Draw route shadow for depth
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
    ctx.globalAlpha = opacity * 0.5
    ctx.lineWidth = 5
    ctx.setLineDash([])

    // Start the shadow path
    ctx.beginPath()
    ctx.moveTo(startPoint.x, startPoint.y + 1)

    // Draw through each waypoint
    route.waypoints.forEach((waypoint) => {
      const point = mapCoordToPixel(waypoint.lat, waypoint.lng, canvasWidth, canvasHeight)
      ctx.lineTo(point.x, point.y + 1)
    })

    // Complete the shadow path
    ctx.lineTo(endPoint.x, endPoint.y + 1)
    ctx.stroke()

    // Draw the actual route
    ctx.strokeStyle = color
    ctx.globalAlpha = opacity
    ctx.lineWidth = 3

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
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2)
        ctx.fill()

        // White center
        ctx.fillStyle = "#FFFFFF"
        ctx.beginPath()
        ctx.arc(point.x, point.y, 1, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Complete the path
    ctx.lineTo(endPoint.x, endPoint.y)
    ctx.stroke()

    // Reset opacity
    ctx.globalAlpha = 1
  }

  // Update the drawLocationMarker function to match Google Maps style
  const drawLocationMarker = (ctx, point, type) => {
    if (type === "current") {
      // Current location marker - Google Maps blue dot with pulse effect
      // Outer pulse circle
      ctx.beginPath()
      ctx.arc(point.x, point.y, 12, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(66, 133, 244, 0.2)"
      ctx.fill()

      // Middle pulse circle
      ctx.beginPath()
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(66, 133, 244, 0.4)"
      ctx.fill()

      // Inner blue dot
      ctx.beginPath()
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2)
      ctx.fillStyle = "#4285F4" // Google Maps blue
      ctx.fill()

      // White center
      ctx.beginPath()
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = "#FFFFFF"
      ctx.fill()
    } else {
      // Destination marker - Google Maps red pin
      // Draw pin shadow
      ctx.beginPath()
      ctx.arc(point.x, point.y + 2, 6, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
      ctx.fill()

      // Draw pin base
      ctx.beginPath()
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2)
      ctx.fillStyle = "#DB4437" // Google Maps red
      ctx.fill()

      // Draw pin center
      ctx.beginPath()
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2)
      ctx.fillStyle = "#FFFFFF"
      ctx.fill()
    }
  }

  // Find traffic severity at current location
  const getCurrentTrafficSeverity = () => {
    if (!currentLocation || !trafficData) return "low"

    for (const spot of trafficData) {
      const distance = Math.sqrt(
        Math.pow(spot.lat - currentLocation.lat, 2) + Math.pow(spot.lng - currentLocation.lng, 2),
      )

      if (distance < spot.radius) {
        return spot.severity
      }
    }

    return "low"
  }

  const trafficSeverity = getCurrentTrafficSeverity()

  // Add these functions to the component
  const handleZoomIn = () => {
    // In a real implementation, this would adjust the map zoom level
    console.log("Zoom in")
  }

  const handleZoomOut = () => {
    // In a real implementation, this would adjust the map zoom level
    console.log("Zoom out")
  }

  const handleCenterMap = () => {
    // In a real implementation, this would center the map on the current location
    console.log("Center map")
  }

  // Add these components to the return statement, right after the canvas element
  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} className="w-full h-full" />

      {/* Add the MapOverlay component */}
      <MapOverlay
        currentLocation={currentLocation}
        destination={destination}
        progress={progress}
        eta={eta || 0}
        trafficLevel={trafficLevel}
        deliveryStage={deliveryStage}
      />

      {/* Add the EnhancedMapControls component */}
      <EnhancedMapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onCenterMap={handleCenterMap} />

      {/* Keep the existing traffic alert and status indicator */}
      {trafficSeverity !== "low" && deliveryStage === "en_route" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute top-4 right-4 px-2 py-1 rounded-md flex items-center text-xs ${
            trafficSeverity === "severe"
              ? "bg-red-500/80 text-white"
              : trafficSeverity === "heavy"
                ? "bg-orange-500/80 text-white"
                : "bg-secondary/80 text-white"
          }`}
        >
          <AlertTriangle className="h-3 w-3 mr-1" />
          <span>
            {trafficSeverity === "severe"
              ? "Severe traffic ahead"
              : trafficSeverity === "heavy"
                ? "Heavy traffic"
                : "Moderate traffic"}
          </span>
        </motion.div>
      )}

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
    </div>
  )
}
