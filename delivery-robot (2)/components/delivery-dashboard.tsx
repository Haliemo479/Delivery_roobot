"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FuturisticContainer } from "@/components/futuristic-container"
import { TrafficIndicator } from "@/components/traffic-indicator"
import { WeatherDisplay } from "@/components/weather-display"
import { Progress } from "@/components/ui/progress"
import {
  Package,
  Truck,
  Clock,
  BarChart3,
  MapPin,
  Battery,
  Zap,
  AlertTriangle,
  ChevronRight,
  Settings,
} from "lucide-react"

// Sample data for the dashboard
const DELIVERY_STATS = {
  today: {
    completed: 42,
    inProgress: 8,
    cancelled: 2,
    total: 52,
  },
  week: {
    completed: 287,
    inProgress: 8,
    cancelled: 15,
    total: 310,
  },
  month: {
    completed: 1245,
    inProgress: 8,
    cancelled: 47,
    total: 1300,
  },
}

const ACTIVE_ROBOTS = [
  {
    id: "LORM-001",
    batteryLevel: 85,
    location: "EAEAT",
    status: "idle",
    lastDelivery: "10:30 AM",
  },
  {
    id: "LORM-002",
    batteryLevel: 62,
    location: "Nasr City",
    status: "delivering",
    lastDelivery: "10:45 AM",
    progress: 75,
  },
  {
    id: "LORM-003",
    batteryLevel: 28,
    location: "New Cairo",
    status: "returning",
    lastDelivery: "11:15 AM",
    progress: 40,
  },
  {
    id: "LORM-004",
    batteryLevel: 94,
    location: "Cairo Tower",
    status: "idle",
    lastDelivery: "09:50 AM",
  },
  {
    id: "LORM-005",
    batteryLevel: 15,
    location: "Charging Station",
    status: "charging",
    lastDelivery: "08:30 AM",
  },
]

const RECENT_DELIVERIES = [
  {
    id: "DEL-1234",
    from: "EAEAT",
    to: "Nasr City",
    time: "10:30 AM",
    status: "completed",
    robot: "LORM-001",
  },
  {
    id: "DEL-1235",
    from: "Cairo Tower",
    to: "Egyptian Museum",
    time: "10:45 AM",
    status: "completed",
    robot: "LORM-004",
  },
  {
    id: "DEL-1236",
    from: "New Cairo",
    to: "EAEAT",
    time: "11:15 AM",
    status: "in-progress",
    robot: "LORM-003",
    progress: 40,
  },
  {
    id: "DEL-1237",
    from: "Nasr City",
    to: "Tahrir Square",
    time: "11:30 AM",
    status: "in-progress",
    robot: "LORM-002",
    progress: 75,
  },
  {
    id: "DEL-1238",
    from: "EAEAT",
    to: "Al-Azhar Park",
    time: "09:15 AM",
    status: "completed",
    robot: "LORM-001",
  },
]

const ALERTS = [
  {
    id: "ALERT-001",
    type: "battery",
    message: "LORM-005 battery critically low (15%)",
    time: "11:45 AM",
    severity: "warning",
  },
  {
    id: "ALERT-002",
    type: "traffic",
    message: "Heavy traffic detected on route to Tahrir Square",
    time: "11:30 AM",
    severity: "warning",
  },
  {
    id: "ALERT-003",
    type: "weather",
    message: "High temperatures may affect battery performance",
    time: "10:15 AM",
    severity: "info",
  },
  {
    id: "ALERT-004",
    type: "security",
    message: "Failed PIN attempts on LORM-002",
    time: "09:45 AM",
    severity: "error",
  },
]

export function DeliveryDashboard() {
  const [timeRange, setTimeRange] = useState("today")
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status) => {
    switch (status) {
      case "idle":
        return "bg-amber-500"
      case "delivering":
        return "bg-green-500"
      case "returning":
        return "bg-blue-500"
      case "charging":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getAlertSeverityColor = (severity) => {
    switch (severity) {
      case "error":
        return "bg-red-500"
      case "warning":
        return "bg-amber-500"
      case "info":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-amber-900/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-amber-700">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="robots" className="data-[state=active]:bg-amber-700">
              <Truck className="h-4 w-4 mr-2" />
              Robots
            </TabsTrigger>
            <TabsTrigger value="deliveries" className="data-[state=active]:bg-amber-700">
              <Package className="h-4 w-4 mr-2" />
              Deliveries
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-amber-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerts
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center">
            <Button variant="outline" size="sm" className="border-amber-700 text-amber-200">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <FuturisticContainer className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-amber-400 text-sm mb-1">Total Deliveries</h3>
                  <div className="flex items-baseline">
                    <span className="text-amber-100 text-2xl font-bold">{DELIVERY_STATS[timeRange].total}</span>
                    <span className="text-amber-300/70 text-xs ml-2">
                      {timeRange === "today" ? "Today" : timeRange === "week" ? "This Week" : "This Month"}
                    </span>
                  </div>
                </div>
                <Package className="h-8 w-8 text-amber-500/50" />
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-green-400">Completed</span>
                  <span className="text-amber-100">{DELIVERY_STATS[timeRange].completed}</span>
                </div>
                <Progress
                  value={(DELIVERY_STATS[timeRange].completed / DELIVERY_STATS[timeRange].total) * 100}
                  className="h-2"
                />

                <div className="flex justify-between items-center text-xs">
                  <span className="text-blue-400">In Progress</span>
                  <span className="text-amber-100">{DELIVERY_STATS[timeRange].inProgress}</span>
                </div>
                <Progress
                  value={(DELIVERY_STATS[timeRange].inProgress / DELIVERY_STATS[timeRange].total) * 100}
                  className="h-2"
                />

                <div className="flex justify-between items-center text-xs">
                  <span className="text-red-400">Cancelled</span>
                  <span className="text-amber-100">{DELIVERY_STATS[timeRange].cancelled}</span>
                </div>
                <Progress
                  value={(DELIVERY_STATS[timeRange].cancelled / DELIVERY_STATS[timeRange].total) * 100}
                  className="h-2"
                />
              </div>

              <div className="mt-4 pt-4 border-t border-amber-800/30 flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs ${timeRange === "today" ? "text-amber-400" : "text-amber-300/70"}`}
                  onClick={() => setTimeRange("today")}
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs ${timeRange === "week" ? "text-amber-400" : "text-amber-300/70"}`}
                  onClick={() => setTimeRange("week")}
                >
                  Week
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs ${timeRange === "month" ? "text-amber-400" : "text-amber-300/70"}`}
                  onClick={() => setTimeRange("month")}
                >
                  Month
                </Button>
              </div>
            </FuturisticContainer>

            <FuturisticContainer className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-amber-400 text-sm mb-1">Active Robots</h3>
                  <div className="flex items-baseline">
                    <span className="text-amber-100 text-2xl font-bold">{ACTIVE_ROBOTS.length}</span>
                    <span className="text-amber-300/70 text-xs ml-2">of 5 Total</span>
                  </div>
                </div>
                <Truck className="h-8 w-8 text-amber-500/50" />
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-amber-200 text-xs">Delivering</span>
                  </div>
                  <span className="text-amber-100 text-xs">
                    {ACTIVE_ROBOTS.filter((r) => r.status === "delivering").length}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-amber-200 text-xs">Returning</span>
                  </div>
                  <span className="text-amber-100 text-xs">
                    {ACTIVE_ROBOTS.filter((r) => r.status === "returning").length}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                    <span className="text-amber-200 text-xs">Idle</span>
                  </div>
                  <span className="text-amber-100 text-xs">
                    {ACTIVE_ROBOTS.filter((r) => r.status === "idle").length}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                    <span className="text-amber-200 text-xs">Charging</span>
                  </div>
                  <span className="text-amber-100 text-xs">
                    {ACTIVE_ROBOTS.filter((r) => r.status === "charging").length}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-amber-800/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Battery className="h-4 w-4 text-amber-400 mr-1" />
                    <span className="text-amber-200 text-xs">Fleet Battery</span>
                  </div>
                  <span className="text-amber-100 text-xs">
                    {Math.round(
                      ACTIVE_ROBOTS.reduce((acc, robot) => acc + robot.batteryLevel, 0) / ACTIVE_ROBOTS.length,
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={ACTIVE_ROBOTS.reduce((acc, robot) => acc + robot.batteryLevel, 0) / ACTIVE_ROBOTS.length}
                  className="h-2 mt-1"
                />
              </div>
            </FuturisticContainer>

            <FuturisticContainer className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-amber-400 text-sm mb-1">System Status</h3>
                  <div className="flex items-baseline">
                    <span className="text-green-400 text-lg font-bold">Operational</span>
                  </div>
                </div>
                <Zap className="h-8 w-8 text-amber-500/50" />
              </div>

              <div className="mt-4 space-y-3">
                <WeatherDisplay location="Cairo" />
              </div>

              <div className="mt-4 pt-4 border-t border-amber-800/30">
                <TrafficIndicator trafficLevel="moderate" />
              </div>
            </FuturisticContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FuturisticContainer className="p-4">
              <h3 className="text-amber-400 text-sm mb-3">Recent Deliveries</h3>
              <div className="space-y-3">
                {RECENT_DELIVERIES.slice(0, 3).map((delivery) => (
                  <div
                    key={delivery.id}
                    className="flex items-center justify-between p-2 rounded-md bg-amber-900/30 border border-amber-800/50"
                  >
                    <div className="flex items-center">
                      <Badge className={getDeliveryStatusColor(delivery.status) + " mr-2"}>
                        {delivery.status === "completed"
                          ? "Completed"
                          : delivery.status === "in-progress"
                            ? "In Progress"
                            : "Cancelled"}
                      </Badge>
                      <div>
                        <div className="text-amber-200 text-xs">{delivery.id}</div>
                        <div className="text-amber-300/70 text-xs">
                          {delivery.from} → {delivery.to}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-amber-200 text-xs">{delivery.time}</div>
                      <div className="text-amber-300/70 text-xs">{delivery.robot}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-amber-400 hover:text-amber-300"
                onClick={() => setActiveTab("deliveries")}
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </FuturisticContainer>

            <FuturisticContainer className="p-4">
              <h3 className="text-amber-400 text-sm mb-3">Recent Alerts</h3>
              <div className="space-y-3">
                {ALERTS.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-2 rounded-md bg-amber-900/30 border border-amber-800/50"
                  >
                    <div className="flex items-center">
                      <Badge className={getAlertSeverityColor(alert.severity) + " mr-2"}>
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </Badge>
                      <div className="text-amber-200 text-xs">{alert.message}</div>
                    </div>
                    <div className="text-amber-300/70 text-xs">{alert.time}</div>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-amber-400 hover:text-amber-300"
                onClick={() => setActiveTab("alerts")}
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </FuturisticContainer>
          </div>
        </TabsContent>

        {/* Robots Tab */}
        <TabsContent value="robots" className="mt-0">
          <FuturisticContainer className="p-4">
            <h3 className="text-amber-400 text-sm mb-3">Active Robots</h3>
            <div className="space-y-3">
              {ACTIVE_ROBOTS.map((robot) => (
                <div key={robot.id} className="p-3 rounded-md bg-amber-900/30 border border-amber-800/50">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Badge className={getStatusColor(robot.status) + " mr-2"}>
                        {robot.status.charAt(0).toUpperCase() + robot.status.slice(1)}
                      </Badge>
                      <h4 className="text-amber-200 font-medium">{robot.id}</h4>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-amber-400 mr-1" />
                      <span className="text-amber-300/70 text-xs">{robot.location}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-amber-200 text-xs">Battery</span>
                        <span className="text-amber-100 text-xs">{robot.batteryLevel}%</span>
                      </div>
                      <Progress value={robot.batteryLevel} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-amber-200 text-xs">Last Delivery</span>
                        <span className="text-amber-100 text-xs">{robot.lastDelivery}</span>
                      </div>
                      {robot.status === "delivering" || robot.status === "returning" ? (
                        <Progress value={robot.progress} className="h-2" />
                      ) : (
                        <div className="h-2"></div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-amber-800/30 flex justify-end">
                    <Button variant="outline" size="sm" className="text-xs border-amber-700 text-amber-200">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </FuturisticContainer>
        </TabsContent>

        {/* Deliveries Tab */}
        <TabsContent value="deliveries" className="mt-0">
          <FuturisticContainer className="p-4">
            <h3 className="text-amber-400 text-sm mb-3">Recent Deliveries</h3>
            <div className="space-y-3">
              {RECENT_DELIVERIES.map((delivery) => (
                <div key={delivery.id} className="p-3 rounded-md bg-amber-900/30 border border-amber-800/50">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Badge className={getDeliveryStatusColor(delivery.status) + " mr-2"}>
                        {delivery.status === "completed"
                          ? "Completed"
                          : delivery.status === "in-progress"
                            ? "In Progress"
                            : "Cancelled"}
                      </Badge>
                      <h4 className="text-amber-200 font-medium">{delivery.id}</h4>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-amber-400 mr-1" />
                      <span className="text-amber-300/70 text-xs">{delivery.time}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-amber-400 mr-1" />
                        <span className="text-amber-200 text-xs">From:</span>
                      </div>
                      <span className="text-amber-100 text-sm">{delivery.from}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-amber-400 mr-1" />
                        <span className="text-amber-200 text-xs">To:</span>
                      </div>
                      <span className="text-amber-100 text-sm">{delivery.to}</span>
                    </div>
                  </div>

                  {delivery.status === "in-progress" && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-amber-200 text-xs">Progress</span>
                        <span className="text-amber-100 text-xs">{delivery.progress}%</span>
                      </div>
                      <Progress value={delivery.progress} className="h-2" />
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-amber-800/30 flex justify-between items-center">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 text-amber-400 mr-1" />
                      <span className="text-amber-300/70 text-xs">{delivery.robot}</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs border-amber-700 text-amber-200">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </FuturisticContainer>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="mt-0">
          <FuturisticContainer className="p-4">
            <h3 className="text-amber-400 text-sm mb-3">System Alerts</h3>
            <div className="space-y-3">
              {ALERTS.map((alert) => (
                <div key={alert.id} className="p-3 rounded-md bg-amber-900/30 border border-amber-800/50">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Badge className={getAlertSeverityColor(alert.severity) + " mr-2"}>
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </Badge>
                      <h4 className="text-amber-200 font-medium">{alert.id}</h4>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-amber-400 mr-1" />
                      <span className="text-amber-300/70 text-xs">{alert.time}</span>
                    </div>
                  </div>

                  <div className="text-amber-100 text-sm mb-3">{alert.message}</div>

                  <div className="mt-3 pt-3 border-t border-amber-800/30 flex justify-end space-x-2">
                    <Button variant="outline" size="sm" className="text-xs border-amber-700 text-amber-200">
                      Dismiss
                    </Button>
                    <Button variant="futuristic" size="sm" className="text-xs text-white">
                      Take Action
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </FuturisticContainer>
        </TabsContent>
      </Tabs>
    </div>
  )
}
