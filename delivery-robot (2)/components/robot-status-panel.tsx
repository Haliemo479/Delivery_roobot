"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { FuturisticContainer } from "@/components/futuristic-container"
import { BatteryIndicator } from "@/components/battery-indicator"
import { TrafficIndicator } from "@/components/traffic-indicator"
import { WeatherDisplay } from "@/components/weather-display"
import { Battery, Thermometer, Gauge, Wifi, Shield, ChevronDown, ChevronUp, RefreshCw, Zap } from "lucide-react"

export function RobotStatusPanel({ robotId = "LORM-001", batteryLevel = 85, isCharging = false }) {
  const [expanded, setExpanded] = useState(false)
  const [systemStatus, setSystemStatus] = useState({
    battery: {
      level: batteryLevel,
      isCharging: isCharging,
      temperature: 28,
      health: 92,
    },
    connectivity: {
      signal: 85,
      latency: 24,
      protocol: "5G",
    },
    sensors: {
      frontCamera: "Operational",
      rearCamera: "Operational",
      lidar: "Operational",
      proximity: "Operational",
      gps: "Operational",
    },
    motors: {
      frontLeft: 100,
      frontRight: 100,
      rearLeft: 98,
      rearRight: 97,
    },
    environment: {
      temperature: 32,
      humidity: 45,
      weather: "Clear",
      trafficLevel: "moderate",
    },
    security: {
      lockStatus: "Secured",
      lastAuthentication: "10:45 AM",
      failedAttempts: 0,
    },
  })

  // Simulate system updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus((prev) => ({
        ...prev,
        battery: {
          ...prev.battery,
          level: isCharging ? Math.min(prev.battery.level + 0.1, 100) : Math.max(prev.battery.level - 0.05, 0),
          temperature: 27 + Math.random() * 2,
        },
        connectivity: {
          ...prev.connectivity,
          signal: 80 + Math.random() * 15,
          latency: 20 + Math.random() * 10,
        },
        environment: {
          ...prev.environment,
          temperature: 31 + Math.random() * 2,
          humidity: 40 + Math.random() * 10,
        },
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [isCharging])

  const getStatusColor = (status) => {
    if (status === "Operational") return "text-green-500"
    if (status === "Warning") return "text-amber-500"
    if (status === "Error") return "text-red-500"
    return "text-amber-200"
  }

  return (
    <FuturisticContainer className="p-3">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <h3 className="text-amber-400 text-sm">Robot Status</h3>
          <Badge variant="outline" className="ml-2 bg-amber-900/30 border-amber-700/50 text-amber-200 text-xs">
            {robotId}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant={systemStatus.battery.level > 20 ? "outline" : "destructive"}
            className={`${
              systemStatus.battery.level > 20
                ? "bg-amber-900/30 border-amber-700/50 text-amber-200"
                : "bg-red-900 text-red-200"
            } text-xs`}
          >
            {systemStatus.battery.isCharging ? "Charging" : "Operational"}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-6 w-6 p-0 text-amber-400"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <BatteryIndicator level={systemStatus.battery.level} isCharging={systemStatus.battery.isCharging} />
        <TrafficIndicator trafficLevel={systemStatus.environment.trafficLevel} />
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 pt-3 border-t border-amber-800/30 space-y-4"
        >
          {/* Battery Section */}
          <div>
            <h4 className="text-amber-300 text-xs mb-2 flex items-center">
              <Battery className="h-3 w-3 mr-1" />
              Battery Details
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-amber-200">Temperature:</span>
                <span className="text-amber-100">{systemStatus.battery.temperature.toFixed(1)}°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-200">Health:</span>
                <span className="text-amber-100">{systemStatus.battery.health}%</span>
              </div>
            </div>
          </div>

          {/* Connectivity Section */}
          <div>
            <h4 className="text-amber-300 text-xs mb-2 flex items-center">
              <Wifi className="h-3 w-3 mr-1" />
              Connectivity
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-amber-200">Signal:</span>
                <span className="text-amber-100">{systemStatus.connectivity.signal.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-200">Latency:</span>
                <span className="text-amber-100">{systemStatus.connectivity.latency.toFixed(0)} ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-200">Protocol:</span>
                <span className="text-amber-100">{systemStatus.connectivity.protocol}</span>
              </div>
            </div>
          </div>

          {/* Sensors Section */}
          <div>
            <h4 className="text-amber-300 text-xs mb-2 flex items-center">
              <Gauge className="h-3 w-3 mr-1" />
              Sensors
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(systemStatus.sensors).map(([sensor, status]) => (
                <div key={sensor} className="flex justify-between items-center">
                  <span className="text-amber-200">{sensor.replace(/([A-Z])/g, " $1").trim()}:</span>
                  <span className={getStatusColor(status)}>{status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Motors Section */}
          <div>
            <h4 className="text-amber-300 text-xs mb-2 flex items-center">
              <Zap className="h-3 w-3 mr-1" />
              Motors
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(systemStatus.motors).map(([motor, health]) => (
                <div key={motor} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-200">{motor.replace(/([A-Z])/g, " $1").trim()}:</span>
                    <span className="text-amber-100">{health}%</span>
                  </div>
                  <Progress value={health} className="h-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Environment Section */}
          <div>
            <h4 className="text-amber-300 text-xs mb-2 flex items-center">
              <Thermometer className="h-3 w-3 mr-1" />
              Environment
            </h4>
            <WeatherDisplay location="Current Location" />
          </div>

          {/* Security Section */}
          <div>
            <h4 className="text-amber-300 text-xs mb-2 flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              Security
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-amber-200">Lock Status:</span>
                <span className="text-green-500">{systemStatus.security.lockStatus}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-200">Last Auth:</span>
                <span className="text-amber-100">{systemStatus.security.lastAuthentication}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-200">Failed Attempts:</span>
                <span className={systemStatus.security.failedAttempts > 0 ? "text-red-500" : "text-green-500"}>
                  {systemStatus.security.failedAttempts}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" className="text-xs border-amber-700 text-amber-200">
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh Status
            </Button>
          </div>
        </motion.div>
      )}
    </FuturisticContainer>
  )
}
