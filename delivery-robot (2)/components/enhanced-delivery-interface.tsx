"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EgyptianPatternBorder from "@/components/egyptian-pattern-border"
import { RobotImage } from "@/components/robot-image"
import { useMobile } from "@/hooks/use-mobile"
import { ResponsiveContainer } from "@/components/responsive-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TimeClock } from "@/components/time-clock"
import { BatteryIndicator } from "@/components/battery-indicator"
import { TrafficIndicator } from "@/components/traffic-indicator"
import { WeatherDisplay } from "@/components/weather-display"
import { FuturisticContainer } from "@/components/futuristic-container"
import { RouteSelector } from "@/components/route-selector"
import EnhancedCairoMap from "@/components/enhanced-cairo-map"
import { UserAvatarMenu } from "@/components/user-avatar-menu"
import { RobotStatusPanel } from "@/components/robot-status-panel"
import { useAuth } from "@/components/auth/auth-context"
import {
  Package,
  Lock,
  Unlock,
  AlertTriangle,
  MapPin,
  Clock,
  ArrowRight,
  Pause,
  LayoutDashboard,
  Map,
  Info,
} from "lucide-react"

const DELIVERY_STAGES = {
  WELCOME: "welcome",
  IDLE: "idle",
  ROUTE_SELECTION: "route_selection",
  EN_ROUTE: "en_route",
  ARRIVED: "arrived",
  PIN_VERIFICATION: "pin_verification",
  DOOR_OPEN: "door_open",
  DOOR_CLOSED: "door_closed",
  COMPLETED: "completed",
  LOCKED: "locked",
}

// Cairo landmarks with real GPS coordinates - 2025 updated locations
const CAIRO_LANDMARKS = [
  { lat: 30.0444, lng: 31.2357, name: "Cairo Tower", eta: 15 },
  { lat: 30.0286, lng: 31.2619, name: "Tahrir Square", eta: 12 },
  { lat: 29.9792, lng: 31.1342, name: "Great Pyramids of Giza", eta: 25 },
  { lat: 30.0505, lng: 31.2486, name: "Egyptian Museum", eta: 10 },
  { lat: 30.0259, lng: 31.2497, name: "Nile Ritz-Carlton", eta: 8 },
  { lat: 30.0566, lng: 31.2262, name: "Al-Azhar Park", eta: 18 },
  { lat: 30.0454, lng: 31.223, name: "Khan el-Khalili", eta: 14 },
  { lat: 30.0128, lng: 31.2269, name: "Salah El Din Citadel", eta: 20 },
  // Nasr City location
  { lat: 30.0588, lng: 31.3247, name: "Nasr City", eta: 22 },
  // New Cairo locations
  { lat: 30.0318, lng: 31.4082, name: "New Cairo", eta: 30 },
  { lat: 30.0074, lng: 31.4913, name: "Cairo New Capital", eta: 35 },
  // EAEAT location
  { lat: 30.0472, lng: 31.3353, name: "EAEAT", eta: 18 },
]

// Generate route waypoints between two locations
const generateRouteWaypoints = (start, end, routeType) => {
  const waypoints = []
  const pointCount = routeType === "scenic" ? 5 : routeType === "safe" ? 4 : 3

  // Generate waypoints based on route type
  for (let i = 1; i <= pointCount; i++) {
    const ratio = i / (pointCount + 1)

    // Base interpolation between start and end
    let lat = start.lat + (end.lat - start.lat) * ratio
    let lng = start.lng + (end.lng - start.lng) * ratio

    // Add variation based on route type
    if (routeType === "fastest") {
      // Fastest route is more direct with slight variations
      lat += (Math.random() - 0.5) * 0.005
      lng += (Math.random() - 0.5) * 0.005
    } else if (routeType === "eco") {
      // Eco route avoids certain areas (simplified)
      lat += (Math.random() - 0.5) * 0.01
      lng += (Math.random() - 0.3) * 0.01 // Bias to avoid certain areas
    } else if (routeType === "scenic") {
      // Scenic route passes by interesting locations
      if (i === 2) {
        // Force a detour to a scenic location
        const scenicSpot = CAIRO_LANDMARKS[Math.floor(Math.random() * 5)]
        lat = scenicSpot.lat
        lng = scenicSpot.lng
      } else {
        lat += (Math.random() - 0.5) * 0.015
        lng += (Math.random() - 0.5) * 0.015
      }
    } else if (routeType === "safe") {
      // Safe route stays on main roads (simplified)
      lat += Math.round((Math.random() - 0.5) * 10) * 0.002 // Snap to grid
      lng += Math.round((Math.random() - 0.5) * 10) * 0.002 // Snap to grid
    }

    waypoints.push({ lat, lng })
  }

  return waypoints
}

// Generate routes between two locations
const generateRoutes = (start, end) => {
  // Calculate direct distance for reference
  const directDistance = Math.sqrt(Math.pow(end.lat - start.lat, 2) + Math.pow(end.lng - start.lng, 2)) * 111 // Rough km conversion

  return [
    {
      name: "Fastest Route",
      type: "fastest",
      eta: Math.round(directDistance * 2),
      distance: Math.round(directDistance * 10) / 10,
      energyUsage: "Standard",
      via: "Main Highways",
      waypoints: generateRouteWaypoints(start, end, "fastest"),
      trafficLevel: "moderate",
    },
    {
      name: "Eco-Friendly Route",
      type: "eco",
      eta: Math.round(directDistance * 2.3),
      distance: Math.round(directDistance * 1.1 * 10) / 10,
      energyUsage: "Low",
      via: "Energy-Efficient Roads",
      waypoints: generateRouteWaypoints(start, end, "eco"),
      trafficLevel: "low",
    },
    {
      name: "Scenic Route",
      type: "scenic",
      eta: Math.round(directDistance * 2.8),
      distance: Math.round(directDistance * 1.4 * 10) / 10,
      energyUsage: "Medium",
      via: "Tourist Attractions",
      waypoints: generateRouteWaypoints(start, end, "scenic"),
      trafficLevel: "low",
    },
    {
      name: "Safe Route",
      type: "safe",
      eta: Math.round(directDistance * 2.5),
      distance: Math.round(directDistance * 1.2 * 10) / 10,
      energyUsage: "Medium-High",
      via: "Well-Monitored Areas",
      waypoints: generateRouteWaypoints(start, end, "safe"),
      trafficLevel: "moderate",
    },
  ]
}

export default function EnhancedDeliveryInterface() {
  const isMobile = useMobile()
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState("delivery")
  const [deliveryStage, setDeliveryStage] = useState(DELIVERY_STAGES.WELCOME)
  const [pin, setPin] = useState("")
  const [pinError, setPinError] = useState(false)
  const [pinAttempts, setPinAttempts] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Start at EAEAT and go to Nasr City as requested
  const [startLocation] = useState(() => {
    const eaeat = CAIRO_LANDMARKS.find((landmark) => landmark.name === "EAEAT")
    return eaeat || { ...CAIRO_LANDMARKS[11] } // Fallback to EAEAT by index if not found
  })

  const [destination, setDestination] = useState(() => {
    const nasrCity = CAIRO_LANDMARKS.find((landmark) => landmark.name === "Nasr City")
    return nasrCity || { ...CAIRO_LANDMARKS[8] } // Fallback to Nasr City by index if not found
  })

  // Route options
  const [routes, setRoutes] = useState([])
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0)

  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isTeamOpen, setIsTeamOpen] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [eta, setEta] = useState(0)
  const [deliveryCount, setDeliveryCount] = useState(0)
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [isCharging, setIsCharging] = useState(false)
  const [trafficLevel, setTrafficLevel] = useState("moderate")
  const progressInterval = useRef(null)
  const [showWelcome, setShowWelcome] = useState(true)

  // Use user preferences if available
  useEffect(() => {
    if (user?.preferences?.defaultRoute && routes.length > 0) {
      const preferredRouteIndex = routes.findIndex((route) => route.type === user.preferences.defaultRoute)
      if (preferredRouteIndex !== -1) {
        setSelectedRouteIndex(preferredRouteIndex)
      }
    }
  }, [user, routes])

  // Generate routes when start or destination changes
  useEffect(() => {
    const newRoutes = generateRoutes(startLocation, destination)
    setRoutes(newRoutes)
    setSelectedRouteIndex(0)
    setEta(newRoutes[0].eta)
    setTrafficLevel(newRoutes[0].trafficLevel)
  }, [startLocation, destination])

  // Update ETA when selected route changes
  useEffect(() => {
    if (routes.length > 0) {
      setEta(routes[selectedRouteIndex].eta)
      setTrafficLevel(routes[selectedRouteIndex].trafficLevel)
    }
  }, [selectedRouteIndex, routes])

  // Calculate current location based on progress and selected route
  const currentLocation = useMemo(() => {
    if (deliveryStage === DELIVERY_STAGES.EN_ROUTE && routes.length > 0) {
      const selectedRoute = routes[selectedRouteIndex]
      const waypoints = [
        { lat: startLocation.lat, lng: startLocation.lng },
        ...selectedRoute.waypoints,
        { lat: destination.lat, lng: destination.lng },
      ]

      // Determine which segment of the route we're on
      const segmentCount = waypoints.length - 1
      const segmentProgress = (progress / 100) * segmentCount
      const currentSegment = Math.min(Math.floor(segmentProgress), segmentCount - 1)
      const segmentRatio = segmentProgress - currentSegment

      // Interpolate between current segment points
      const start = waypoints[currentSegment]
      const end = waypoints[currentSegment + 1]

      return {
        lat: start.lat + (end.lat - start.lat) * segmentRatio,
        lng: start.lng + (end.lng - start.lng) * segmentRatio,
        name: "Moving...",
      }
    }

    return deliveryStage === DELIVERY_STAGES.ARRIVED ? destination : startLocation
  }, [deliveryStage, progress, startLocation, destination, routes, selectedRouteIndex])

  const validatePin = (inputPin) => {
    // If user is authenticated and has an academicId, use that instead
    if (isAuthenticated && user?.academicId) {
      return inputPin === user.academicId
    }

    // Otherwise use the default range
    const pinNum = Number.parseInt(inputPin, 10)
    return pinNum >= 2020001 && pinNum <= 2020220
  }

  const handlePinSubmit = () => {
    if (validatePin(pin)) {
      setPinError(false)
      setPinAttempts(0)
      setDeliveryStage(DELIVERY_STAGES.DOOR_OPEN)

      // Add to user's delivery history if authenticated
      if (isAuthenticated && user) {
        const newDelivery = {
          id: `del-${Date.now()}`,
          date: new Date().toISOString(),
          from: startLocation.name,
          to: destination.name,
          status: "completed",
        }

        const updatedHistory = [...(user.deliveryHistory || []), newDelivery]

        // In a real app, this would be an API call
        // For now, we're just updating the local state
        // updateUser({ deliveryHistory: updatedHistory })
      }
    } else {
      setPinError(true)
      setPinAttempts((prev) => prev + 1)
      setPin("")

      if (pinAttempts >= 2) {
        setIsLocked(true)
        setDeliveryStage(DELIVERY_STAGES.LOCKED)
      }
    }
  }

  const handleCloseDoor = () => {
    setDeliveryStage(DELIVERY_STAGES.DOOR_CLOSED)
  }

  const handleLockDoor = () => {
    setDeliveryStage(DELIVERY_STAGES.COMPLETED)
  }

  const handleSelectRoute = (index) => {
    setSelectedRouteIndex(index)
  }

  const prepareDelivery = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true)
      return
    }
    setDeliveryStage(DELIVERY_STAGES.ROUTE_SELECTION)
  }

  const startDelivery = () => {
    setDeliveryStage(DELIVERY_STAGES.EN_ROUTE)
    setProgress(0)
    setIsCharging(false)

    // Use ETA from the selected route
    const selectedRoute = routes[selectedRouteIndex]
    setEta(selectedRoute.eta)
    setTrafficLevel(selectedRoute.trafficLevel)

    // Simulate progress
    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval.current)
          setDeliveryStage(DELIVERY_STAGES.ARRIVED)
          return 100
        }

        // Update ETA as progress increases
        const newProgress = prev + 0.5
        const remainingPercentage = 100 - newProgress
        const newEta = Math.ceil((remainingPercentage / 100) * selectedRoute.eta)
        setEta(newEta)

        // Drain battery during delivery
        setBatteryLevel((prevBattery) => Math.max(prevBattery - 0.05, 0))

        return newProgress
      })
    }, 100)
  }

  const resetDemo = () => {
    setDeliveryCount((prev) => prev + 1)
    setDeliveryStage(DELIVERY_STAGES.IDLE)
    setPin("")
    setPinError(false)
    setPinAttempts(0)
    setProgress(0)
    setIsLocked(false)
    setIsCharging(true)
    setBatteryLevel(Math.min(batteryLevel + 15, 100))

    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }
  }

  const startApp = () => {
    setShowWelcome(false)
    setDeliveryStage(DELIVERY_STAGES.IDLE)
  }

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [])

  if (showWelcome) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <ResponsiveContainer aspectRatio="15/9">
          <Card className="w-full h-full border-none shadow-xl overflow-hidden bg-gradient-egyptian">
            <EgyptianPatternBorder>
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Pharoah LORM</h1>
                  <p className="text-xl text-sand-200 mb-8">Lively Oxygen-Respecting Messenger</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative w-48 h-48 mb-8"
                >
                  <RobotImage />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="max-w-lg"
                >
                  <p className="text-sand-100 mb-8">
                    Experience the future of autonomous delivery in Cairo with our Egyptian-themed luxury delivery
                    solution. Pharoah LORM combines cutting-edge technology with the rich heritage of Egypt.
                  </p>

                  <Button variant="golden" size="touch" onClick={startApp} className="text-primary-900 tracking-wide">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Start Using Pharoah LORM
                  </Button>
                </motion.div>
              </div>
            </EgyptianPatternBorder>
          </Card>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <ResponsiveContainer aspectRatio={isMobile ? "1/1" : "15/9"}>
        <Card className="w-full h-full border-none shadow-xl overflow-hidden bg-gradient-egyptian">
          <EgyptianPatternBorder>
            <div className="h-full flex flex-col">
              {/* Header with status info */}
              <div className="bg-primary-800/50 border-b border-primary-700/50 p-2 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <TimeClock />
                  <Badge
                    variant={deliveryStage === DELIVERY_STAGES.IDLE ? "outline" : "default"}
                    className="bg-primary-800/50 text-sand-200 border-primary-700"
                  >
                    {deliveryStage === DELIVERY_STAGES.IDLE && "Ready for delivery"}
                    {deliveryStage === DELIVERY_STAGES.ROUTE_SELECTION && "Select Route"}
                    {deliveryStage === DELIVERY_STAGES.EN_ROUTE && `ETA: ${eta} min`}
                    {deliveryStage === DELIVERY_STAGES.ARRIVED && "Arrived"}
                    {deliveryStage === DELIVERY_STAGES.PIN_VERIFICATION && "Enter PIN"}
                    {deliveryStage === DELIVERY_STAGES.DOOR_OPEN && "Door Open"}
                    {deliveryStage === DELIVERY_STAGES.DOOR_CLOSED && "Door Closed"}
                    {deliveryStage === DELIVERY_STAGES.COMPLETED && "Completed"}
                    {deliveryStage === DELIVERY_STAGES.LOCKED && "Locked"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="mr-2">
                    <TabsList className="bg-primary-800/50 h-8">
                      <TabsTrigger value="delivery" className="text-xs h-6 px-2 data-[state=active]:bg-primary-700">
                        <Package className="h-3 w-3 mr-1" /> <span className="hidden sm:inline">Delivery</span>
                      </TabsTrigger>
                      <TabsTrigger value="map" className="text-xs h-6 px-2 data-[state=active]:bg-primary-700">
                        <Map className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Map</span>
                      </TabsTrigger>
                      <TabsTrigger value="status" className="text-xs h-6 px-2 data-[state=active]:bg-primary-700">
                        <Info className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Status</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <UserAvatarMenu />
                </div>
              </div>

              {/* Main content area */}
              <div className="flex-1 overflow-hidden">
                <Tabs value={activeTab} className="h-full">
                  <TabsContent value="delivery" className="h-full">
                    <div className="flex flex-col md:flex-row h-full">
                      {/* Left panel - Map */}
                      <div className={`${isMobile ? "w-full h-1/2" : "w-2/3 h-full"} p-3`}>
                        <FuturisticContainer className="h-full">
                          <EnhancedCairoMap
                            currentLocation={currentLocation}
                            destination={destination}
                            progress={progress}
                            deliveryStage={deliveryStage}
                            routes={routes}
                            selectedRouteIndex={selectedRouteIndex}
                            showAllRoutes={deliveryStage === DELIVERY_STAGES.ROUTE_SELECTION}
                          />
                        </FuturisticContainer>
                      </div>

                      {/* Right panel - Controls and info */}
                      <div
                        className={`${
                          isMobile ? "w-full h-1/2" : "w-1/3 h-full"
                        } p-3 flex flex-col space-y-3 overflow-auto`}
                      >
                        {/* Status panel */}
                        <FuturisticContainer className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-secondary text-sm">Status</h3>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={isLocked ? "destructive" : "outline"}
                                className={`${
                                  isLocked
                                    ? "bg-red-900 text-red-200"
                                    : "bg-primary-800/50 text-sand-200 border-primary-700"
                                }`}
                              >
                                {isLocked ? "Locked" : "Operational"}
                              </Badge>
                              {deliveryStage === DELIVERY_STAGES.EN_ROUTE && (
                                <Badge className="bg-green-600/80 text-white">{progress.toFixed(0)}%</Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <BatteryIndicator level={batteryLevel} isCharging={isCharging} />
                            <TrafficIndicator trafficLevel={trafficLevel} />
                          </div>

                          {deliveryStage !== DELIVERY_STAGES.IDLE && (
                            <div className="mt-3 pt-3 border-t border-primary-700/30">
                              <WeatherDisplay location={currentLocation.name} />
                            </div>
                          )}
                        </FuturisticContainer>

                        {/* Control panel - changes based on delivery stage */}
                        <FuturisticContainer className="flex-1 p-4 overflow-auto">
                          {deliveryStage === DELIVERY_STAGES.IDLE && (
                            <div className="h-full flex flex-col">
                              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                                <div className="w-24 h-24 mb-4">
                                  <RobotImage />
                                </div>
                                <h3 className="text-secondary text-lg mb-2">Ready for Delivery</h3>
                                <p className="text-sand-200 text-sm mb-6">
                                  Pharoah LORM is ready to deliver your package from EAEAT to Nasr City
                                </p>
                                <Button
                                  variant="golden"
                                  size="touch"
                                  onClick={prepareDelivery}
                                  className="w-full text-primary-900"
                                >
                                  <Package className="mr-2 h-4 w-4" />
                                  Start New Delivery
                                </Button>
                              </div>
                            </div>
                          )}

                          {deliveryStage === DELIVERY_STAGES.ROUTE_SELECTION && (
                            <RouteSelector
                              routes={routes}
                              selectedRouteIndex={selectedRouteIndex}
                              onSelectRoute={handleSelectRoute}
                              onStartDelivery={startDelivery}
                            />
                          )}

                          {deliveryStage === DELIVERY_STAGES.EN_ROUTE && (
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <h3 className="text-secondary text-sm">Delivery Progress</h3>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 text-secondary mr-1" />
                                    <span className="text-sand-200 text-xs">{eta} min remaining</span>
                                  </div>
                                </div>
                                <Progress value={progress} />
                              </div>

                              <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="space-y-1">
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 text-secondary mr-1" />
                                    <span className="text-sand-200 text-xs">From:</span>
                                  </div>
                                  <span className="text-sand-100 text-sm">{startLocation.name}</span>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 text-secondary mr-1" />
                                    <span className="text-sand-200 text-xs">To:</span>
                                  </div>
                                  <span className="text-sand-100 text-sm">{destination.name}</span>
                                </div>
                              </div>

                              <div className="space-y-1 pt-2">
                                <div className="flex items-center">
                                  <Package className="h-4 w-4 text-secondary mr-1" />
                                  <span className="text-sand-200 text-xs">Route:</span>
                                </div>
                                <span className="text-sand-100 text-sm">
                                  {routes[selectedRouteIndex]?.name} via {routes[selectedRouteIndex]?.via}
                                </span>
                              </div>

                              <div className="flex space-x-2 pt-2">
                                <Button
                                  variant="outline"
                                  size="touch"
                                  onClick={() => {
                                    clearInterval(progressInterval.current)
                                    setDeliveryStage(DELIVERY_STAGES.IDLE)
                                  }}
                                  className="flex-1 border-primary-700 text-sand-200"
                                >
                                  <Pause className="mr-2 h-4 w-4" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}

                          {deliveryStage === DELIVERY_STAGES.ARRIVED && (
                            <div className="space-y-4">
                              <div className="text-center">
                                <Badge className="bg-green-600 text-white mb-2">Arrived</Badge>
                                <h3 className="text-secondary text-lg mb-1">Destination Reached</h3>
                                <p className="text-sand-200 text-sm mb-4">
                                  Your delivery has arrived at {destination.name}
                                </p>
                              </div>

                              <div className="space-y-3">
                                <div className="text-center">
                                  <p className="text-sand-300 text-sm mb-2">
                                    Enter your PIN to open the delivery compartment
                                  </p>
                                  {isAuthenticated && user?.academicId && (
                                    <p className="text-secondary/70 text-xs mb-4">
                                      Use your Academic ID: {user.academicId}
                                    </p>
                                  )}
                                </div>

                                <Input
                                  type="password"
                                  placeholder="Enter PIN"
                                  value={pin}
                                  onChange={(e) => setPin(e.target.value)}
                                  className="bg-primary-800/50 border-primary-700 text-sand-100 text-center"
                                  maxLength={7}
                                />

                                {pinError && (
                                  <div className="bg-red-900/20 border border-red-800 text-red-300 px-3 py-2 rounded-md flex items-center text-sm">
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Invalid PIN. {3 - pinAttempts} attempts remaining.
                                  </div>
                                )}

                                <Button
                                  variant="golden"
                                  size="touch"
                                  onClick={handlePinSubmit}
                                  className="w-full text-primary-900"
                                  disabled={!pin}
                                >
                                  <Unlock className="mr-2 h-4 w-4" />
                                  Open Compartment
                                </Button>
                              </div>
                            </div>
                          )}

                          {deliveryStage === DELIVERY_STAGES.PIN_VERIFICATION && (
                            <div className="space-y-4">
                              <div className="text-center">
                                <h3 className="text-secondary text-lg mb-1">Verifying PIN</h3>
                                <p className="text-sand-200 text-sm mb-4">Please wait...</p>
                              </div>
                            </div>
                          )}

                          {deliveryStage === DELIVERY_STAGES.DOOR_OPEN && (
                            <div className="space-y-4">
                              <div className="text-center">
                                <Badge className="bg-green-600 text-white mb-2">Door Open</Badge>
                                <h3 className="text-secondary text-lg mb-1">Compartment Unlocked</h3>
                                <p className="text-sand-200 text-sm mb-4">Please take your package</p>
                              </div>

                              <Button
                                variant="outline"
                                size="touch"
                                onClick={handleCloseDoor}
                                className="w-full border-primary-700 text-sand-200"
                              >
                                Close Compartment
                              </Button>
                            </div>
                          )}

                          {deliveryStage === DELIVERY_STAGES.DOOR_CLOSED && (
                            <div className="space-y-4">
                              <div className="text-center">
                                <Badge className="bg-secondary text-white mb-2">Door Closed</Badge>
                                <h3 className="text-secondary text-lg mb-1">Compartment Closed</h3>
                                <p className="text-sand-200 text-sm mb-4">
                                  Please lock the compartment to complete delivery
                                </p>
                              </div>

                              <Button
                                variant="golden"
                                size="touch"
                                onClick={handleLockDoor}
                                className="w-full text-primary-900"
                              >
                                <Lock className="mr-2 h-4 w-4" />
                                Lock Compartment
                              </Button>
                            </div>
                          )}

                          {deliveryStage === DELIVERY_STAGES.COMPLETED && (
                            <div className="space-y-4">
                              <div className="text-center">
                                <Badge className="bg-green-600 text-white mb-2">Completed</Badge>
                                <h3 className="text-secondary text-lg mb-1">Delivery Completed</h3>
                                <p className="text-sand-200 text-sm mb-4">Thank you for using Pharoah LORM</p>
                              </div>

                              <div className="bg-primary-800/30 rounded-md p-3 border border-primary-700/50 mb-3">
                                <h4 className="text-sand-300 text-sm mb-2">Delivery Summary</h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="text-sand-200">From:</div>
                                  <div className="text-sand-100">{startLocation.name}</div>
                                  <div className="text-sand-200">To:</div>
                                  <div className="text-sand-100">{destination.name}</div>
                                  <div className="text-sand-200">Route:</div>
                                  <div className="text-sand-100">{routes[selectedRouteIndex]?.name}</div>
                                  <div className="text-sand-200">Distance:</div>
                                  <div className="text-sand-100">{routes[selectedRouteIndex]?.distance} km</div>
                                  <div className="text-sand-200">Time:</div>
                                  <div className="text-sand-100">{routes[selectedRouteIndex]?.eta} min</div>
                                </div>
                              </div>

                              <Button
                                variant="golden"
                                size="touch"
                                onClick={resetDemo}
                                className="w-full text-primary-900"
                              >
                                <ArrowRight className="mr-2 h-4 w-4" />
                                Start New Delivery
                              </Button>
                            </div>
                          )}

                          {deliveryStage === DELIVERY_STAGES.LOCKED && (
                            <div className="space-y-4">
                              <div className="text-center">
                                <Badge variant="destructive" className="mb-2">
                                  System Locked
                                </Badge>
                                <h3 className="text-red-400 text-lg mb-1">Too Many Failed Attempts</h3>
                                <p className="text-sand-200 text-sm mb-4">
                                  The system has been locked due to multiple failed PIN attempts. Please contact
                                  support.
                                </p>
                              </div>

                              <div className="bg-red-900/20 border border-red-800 text-red-300 px-3 py-2 rounded-md flex items-center text-sm">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Security alert: Unauthorized access attempt detected.
                              </div>

                              <Button
                                variant="outline"
                                size="touch"
                                onClick={resetDemo}
                                className="w-full border-primary-700 text-sand-200 mt-4"
                              >
                                Reset Demo
                              </Button>
                            </div>
                          )}
                        </FuturisticContainer>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="map" className="h-full p-2">
                    <FuturisticContainer className="h-full">
                      <EnhancedCairoMap
                        currentLocation={currentLocation}
                        destination={destination}
                        progress={progress}
                        deliveryStage={deliveryStage}
                        routes={routes}
                        selectedRouteIndex={selectedRouteIndex}
                        showAllRoutes={true}
                        showTraffic={true}
                        showStreetNames={true}
                      />
                    </FuturisticContainer>
                  </TabsContent>

                  <TabsContent value="status" className="h-full p-2 overflow-auto">
                    <div className="space-y-2">
                      <RobotStatusPanel robotId="LORM-001" batteryLevel={batteryLevel} isCharging={isCharging} />

                      <FuturisticContainer className="p-3">
                        <h3 className="text-secondary text-sm mb-3">Delivery Information</h3>

                        {deliveryStage !== DELIVERY_STAGES.IDLE ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 text-secondary mr-1" />
                                  <span className="text-sand-200 text-xs">Origin:</span>
                                </div>
                                <span className="text-sand-100 text-sm">{startLocation.name}</span>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 text-secondary mr-1" />
                                  <span className="text-sand-200 text-xs">Destination:</span>
                                </div>
                                <span className="text-sand-100 text-sm">{destination.name}</span>
                              </div>
                            </div>

                            {routes.length > 0 && (
                              <div className="pt-2 border-t border-primary-700/30">
                                <div className="space-y-1">
                                  <div className="flex items-center">
                                    <Package className="h-4 w-4 text-secondary mr-1" />
                                    <span className="text-sand-200 text-xs">Selected Route:</span>
                                  </div>
                                  <span className="text-sand-100 text-sm">{routes[selectedRouteIndex]?.name}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-2">
                                  <div className="space-y-1">
                                    <span className="text-sand-200 text-xs">Distance:</span>
                                    <span className="text-sand-100 text-sm block">
                                      {routes[selectedRouteIndex]?.distance} km
                                    </span>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="text-sand-200 text-xs">ETA:</span>
                                    <span className="text-sand-100 text-sm block">
                                      {routes[selectedRouteIndex]?.eta} min
                                    </span>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="text-sand-200 text-xs">Energy Usage:</span>
                                    <span className="text-sand-100 text-sm block">
                                      {routes[selectedRouteIndex]?.energyUsage}
                                    </span>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="text-sand-200 text-xs">Via:</span>
                                    <span className="text-sand-100 text-sm block">
                                      {routes[selectedRouteIndex]?.via}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {deliveryStage === DELIVERY_STAGES.EN_ROUTE && (
                              <div className="pt-2 border-t border-primary-700/30">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sand-200 text-xs">Progress:</span>
                                  <span className="text-sand-100 text-xs">{progress.toFixed(0)}%</span>
                                </div>
                                <Progress value={progress} />

                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-sand-200 text-xs">Remaining Time:</span>
                                  <span className="text-sand-100 text-xs">{eta} minutes</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sand-200 text-sm">No active delivery</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={prepareDelivery}
                              className="mt-2 border-primary-700 text-sand-200"
                            >
                              <Package className="mr-2 h-4 w-4" />
                              Start New Delivery
                            </Button>
                          </div>
                        )}
                      </FuturisticContainer>

                      <FuturisticContainer className="p-3">
                        <h3 className="text-secondary text-sm mb-3">Environmental Conditions</h3>
                        <WeatherDisplay location={currentLocation.name} />

                        <div className="mt-3 pt-3 border-t border-primary-700/30">
                          <TrafficIndicator trafficLevel={trafficLevel} />
                        </div>
                      </FuturisticContainer>

                      <div className="flex justify-end pt-2">
                        <Button variant="outline" className="border-primary-700 text-sand-200">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Open Dashboard
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </EgyptianPatternBorder>
        </Card>
      </ResponsiveContainer>
    </div>
  )
}
