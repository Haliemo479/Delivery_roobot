"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Battery,
  Navigation,
  Package,
  MapPin,
  AlertTriangle,
  Gauge,
  RotateCw,
  Play,
  Pause,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"

export default function DeliveryRobot() {
  const [speed, setSpeed] = useState(0)
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [isAutonomous, setIsAutonomous] = useState(true)
  const [status, setStatus] = useState("Idle")
  const [direction, setDirection] = useState({ x: 0, y: 0 })
  const [isConnected, setIsConnected] = useState(true)
  const [deliveryProgress, setDeliveryProgress] = useState(0)
  const [isSimulating, setIsSimulating] = useState(false)

  // Simulate battery drain
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSimulating && batteryLevel > 0) {
        setBatteryLevel((prev) => Math.max(prev - 0.1, 0))
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [isSimulating, batteryLevel])

  // Simulate delivery progress
  useEffect(() => {
    let interval
    if (isSimulating && status === "Delivering" && deliveryProgress < 100) {
      interval = setInterval(() => {
        setDeliveryProgress((prev) => {
          const newProgress = prev + 1
          if (newProgress >= 100) {
            setStatus("Delivered")
            setIsSimulating(false)
          }
          return newProgress
        })
      }, 500)
    }
    return () => clearInterval(interval)
  }, [isSimulating, status, deliveryProgress])

  const startDelivery = () => {
    setStatus("Delivering")
    setDeliveryProgress(0)
    setIsSimulating(true)
  }

  const stopDelivery = () => {
    setIsSimulating(false)
    setStatus("Paused")
  }

  const resetDelivery = () => {
    setIsSimulating(false)
    setStatus("Idle")
    setDeliveryProgress(0)
    setDirection({ x: 0, y: 0 })
    setSpeed(0)
  }

  const handleDirectionControl = (x, y) => {
    if (!isAutonomous) {
      setDirection({ x, y })
      if (x !== 0 || y !== 0) {
        setStatus("Manual Control")
      } else {
        setStatus("Idle")
      }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Robot Visualization */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Robot Visualization
            <Badge variant={isConnected ? "default" : "destructive"} className="ml-2">
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </CardTitle>
          <CardDescription>4-Wheel Skid Steering Delivery Robot</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="relative w-64 h-64 mb-6">
            {/* Robot Chassis */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-slate-700 rounded-lg border-2 border-slate-600 shadow-lg">
              {/* Robot Top */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-8 bg-slate-600 rounded-t-lg border-2 border-slate-500">
                {/* Sensors */}
                <div className="absolute top-1 left-4 w-4 h-2 bg-blue-400 rounded-full"></div>
                <div className="absolute top-1 right-4 w-4 h-2 bg-blue-400 rounded-full"></div>
              </div>

              {/* Delivery Compartment */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-20 bg-slate-500 rounded border border-slate-400 flex items-center justify-center">
                <Package className="text-slate-300" size={24} />
              </div>

              {/* Status Light */}
              <div
                className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                  status === "Idle"
                    ? "bg-yellow-400"
                    : status === "Delivering"
                      ? "bg-green-400 animate-pulse"
                      : status === "Delivered"
                        ? "bg-green-400"
                        : status === "Paused"
                          ? "bg-orange-400"
                          : "bg-blue-400"
                }`}
              ></div>
            </div>

            {/* Wheels */}
            <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-10 h-16 bg-black rounded-l-lg"></div>
            <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-10 h-16 bg-black rounded-r-lg"></div>
            <div className="absolute bottom-1/4 left-1/4 transform -translate-x-1/2 translate-y-1/2 w-10 h-16 bg-black rounded-l-lg"></div>
            <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2 w-10 h-16 bg-black rounded-r-lg"></div>

            {/* Direction Indicator */}
            {(direction.x !== 0 || direction.y !== 0) && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                <div
                  className="absolute top-1/2 left-1/2 w-0 h-0 border-t-[20px] border-t-blue-500 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${
                      direction.y < 0 ? 0 : direction.y > 0 ? 180 : direction.x < 0 ? 270 : direction.x > 0 ? 90 : 0
                    }deg)`,
                    opacity: isSimulating ? 1 : 0.5,
                  }}
                ></div>
              </div>
            )}
          </div>

          {/* Delivery Progress */}
          <div className="w-full max-w-md mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Delivery Progress</span>
              <span>{deliveryProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${deliveryProgress}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Control Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Robot Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Battery className="mr-2 text-green-500" />
                <span>Battery</span>
              </div>
              <Badge variant={batteryLevel > 20 ? "default" : "destructive"}>{batteryLevel.toFixed(1)}%</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Gauge className="mr-2 text-blue-500" />
                <span>Speed</span>
              </div>
              <Badge>{speed} m/s</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Navigation className="mr-2 text-purple-500" />
                <span>Status</span>
              </div>
              <Badge
                variant={
                  status === "Idle"
                    ? "outline"
                    : status === "Delivering"
                      ? "default"
                      : status === "Delivered"
                        ? "success"
                        : status === "Paused"
                          ? "secondary"
                          : "default"
                }
              >
                {status}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="mr-2 text-red-500" />
                <span>Location</span>
              </div>
              <Badge variant="outline">Warehouse Zone B</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Control Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="auto" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="auto">Autonomous</TabsTrigger>
                <TabsTrigger value="manual" disabled={isAutonomous}>
                  Manual
                </TabsTrigger>
              </TabsList>
              <TabsContent value="auto" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <span>Autonomous Mode</span>
                  <Switch checked={isAutonomous} onCheckedChange={setIsAutonomous} disabled={isSimulating} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Speed Setting</span>
                    <span>{speed} m/s</span>
                  </div>
                  <Slider
                    value={[speed]}
                    min={0}
                    max={5}
                    step={0.5}
                    onValueChange={(value) => setSpeed(value[0])}
                    disabled={!isAutonomous || isSimulating}
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    onClick={startDelivery}
                    disabled={!isAutonomous || isSimulating || batteryLevel <= 5}
                    className="flex-1"
                  >
                    <Play className="mr-2 h-4 w-4" /> Start
                  </Button>
                  <Button onClick={stopDelivery} disabled={!isSimulating} variant="secondary" className="flex-1">
                    <Pause className="mr-2 h-4 w-4" /> Pause
                  </Button>
                  <Button onClick={resetDelivery} variant="outline" className="flex-1">
                    <RefreshCw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4 pt-4">
                <div className="grid grid-cols-3 gap-2 w-full max-w-[200px] mx-auto">
                  <div></div>
                  <Button
                    variant="outline"
                    className="aspect-square p-0"
                    onMouseDown={() => handleDirectionControl(0, -1)}
                    onMouseUp={() => handleDirectionControl(0, 0)}
                    onMouseLeave={() => handleDirectionControl(0, 0)}
                    disabled={isAutonomous}
                  >
                    <ArrowUp className="h-6 w-6" />
                  </Button>
                  <div></div>

                  <Button
                    variant="outline"
                    className="aspect-square p-0"
                    onMouseDown={() => handleDirectionControl(-1, 0)}
                    onMouseUp={() => handleDirectionControl(0, 0)}
                    onMouseLeave={() => handleDirectionControl(0, 0)}
                    disabled={isAutonomous}
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    className="aspect-square p-0"
                    onClick={resetDelivery}
                    disabled={isAutonomous}
                  >
                    <RotateCw className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    className="aspect-square p-0"
                    onMouseDown={() => handleDirectionControl(1, 0)}
                    onMouseUp={() => handleDirectionControl(0, 0)}
                    onMouseLeave={() => handleDirectionControl(0, 0)}
                    disabled={isAutonomous}
                  >
                    <ArrowRight className="h-6 w-6" />
                  </Button>

                  <div></div>
                  <Button
                    variant="outline"
                    className="aspect-square p-0"
                    onMouseDown={() => handleDirectionControl(0, 1)}
                    onMouseUp={() => handleDirectionControl(0, 0)}
                    onMouseLeave={() => handleDirectionControl(0, 0)}
                    disabled={isAutonomous}
                  >
                    <ArrowDown className="h-6 w-6" />
                  </Button>
                  <div></div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Manual Speed</span>
                    <span>{speed} m/s</span>
                  </div>
                  <Slider
                    value={[speed]}
                    min={0}
                    max={5}
                    step={0.5}
                    onValueChange={(value) => setSpeed(value[0])}
                    disabled={isAutonomous}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t pt-4">
            {batteryLevel <= 20 && (
              <div className="flex items-center text-amber-500 text-sm w-full">
                <AlertTriangle className="mr-2 h-4 w-4" />
                <span>Low battery warning! Please recharge soon.</span>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
