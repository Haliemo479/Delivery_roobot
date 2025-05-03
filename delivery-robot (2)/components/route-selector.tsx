"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Zap, Leaf, Map, Shield, Clock, Fuel, MapPin, ArrowRight, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TrafficIndicator } from "@/components/traffic-indicator"
import { WeatherDisplay } from "@/components/weather-display"

export function RouteSelector({ routes, selectedRouteIndex, onSelectRoute, onStartDelivery }) {
  const [showDetails, setShowDetails] = useState(false)
  const [showWeather, setShowWeather] = useState(false)

  if (!routes || routes.length === 0) {
    return null
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-amber-400 text-base">Select Route</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowWeather(!showWeather)}
            className="text-amber-300 text-xs h-8 px-3"
          >
            {showWeather ? "Hide Weather" : "Show Weather"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-amber-300 text-xs h-8 px-3"
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
        </div>
      </div>

      {showWeather && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-amber-900/30 rounded-md p-3 border border-amber-800/50 mb-3"
        >
          <WeatherDisplay location={routes[selectedRouteIndex].via} />
        </motion.div>
      )}

      <div className="space-y-4 max-h-[300px] overflow-auto scrollbar-hide">
        {routes.map((route, index) => (
          <div
            key={index}
            className={cn(
              "p-3 rounded-md border cursor-pointer transition-colors",
              selectedRouteIndex === index
                ? "bg-secondary/20 border-secondary"
                : "bg-primary-800/30 border-primary-700/50 hover:bg-primary-800/50",
            )}
            onClick={() => onSelectRoute(index)}
          >
            <Label htmlFor={`route-${index}`} className="flex items-center justify-between w-full cursor-pointer">
              <div className="flex items-center">
                <RadioGroupItem id={`route-${index}`} value={index.toString()} className="mr-3 h-5 w-5" />
                <div className="flex items-center">
                  {route.type === "fastest" && <Zap className="h-4 w-4 text-amber-400 mr-2" />}
                  {route.type === "eco" && <Leaf className="h-4 w-4 text-green-400 mr-2" />}
                  {route.type === "scenic" && <Map className="h-4 w-4 text-blue-400 mr-2" />}
                  {route.type === "safe" && <Shield className="h-4 w-4 text-purple-400 mr-2" />}
                  <span className="text-sm font-medium text-amber-200">{route.name}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-xs py-1 px-2 bg-amber-900/30 border-amber-700/50">
                  <Clock className="h-3 w-3 mr-1" />
                  {route.eta} min
                </Badge>
                <Badge variant="outline" className="text-xs py-1 px-2 bg-amber-900/30 border-amber-700/50">
                  <MapPin className="h-3 w-3 mr-1" />
                  {route.distance} km
                </Badge>
              </div>
            </Label>

            {showDetails && selectedRouteIndex === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-2 border-t border-amber-800/30 text-sm text-amber-200/80 space-y-3"
              >
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <Fuel className="h-4 w-4 mr-2 text-amber-400/70" />
                    <span>Energy Usage:</span>
                  </div>
                  <span>{route.energyUsage}</span>
                </div>
                <div className="flex justify-between">
                  <span>Via:</span>
                  <span className="text-right">{route.via}</span>
                </div>

                <TrafficIndicator
                  trafficLevel={
                    route.type === "fastest"
                      ? "moderate"
                      : route.type === "eco"
                        ? "low"
                        : route.type === "scenic"
                          ? "heavy"
                          : "low"
                  }
                />

                {route.type === "fastest" && (
                  <div className="flex items-start text-xs text-amber-400/70">
                    <AlertTriangle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>This route may encounter moderate traffic conditions during peak hours.</span>
                  </div>
                )}

                {route.type === "scenic" && (
                  <div className="flex items-start text-xs text-amber-400/70">
                    <AlertTriangle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>This route passes through tourist areas which may have heavy traffic.</span>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <Button variant="futuristic" size="touch" onClick={onStartDelivery} className="w-full text-white mt-4">
        <ArrowRight className="mr-2 h-4 w-4" />
        Start Delivery
      </Button>
    </div>
  )
}
