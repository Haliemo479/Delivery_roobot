"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Navigation, AlertTriangle, Info, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function MapOverlay({ currentLocation, destination, progress, eta, trafficLevel, deliveryStage }) {
  const [showInfo, setShowInfo] = useState(false)
  const [landmarks, setLandmarks] = useState([
    { name: "Cairo Tower", description: "Iconic tower with panoramic views" },
    { name: "Tahrir Square", description: "Historic square in downtown Cairo" },
    { name: "Nasr City", description: "Major residential and commercial district" },
    { name: "New Cairo", description: "Modern extension of Cairo to the east" },
    { name: "EAEAT", description: "Egyptian Academy for Engineering and Advanced Technology" },
  ])

  // Show traffic alerts based on traffic level
  const showTrafficAlert = trafficLevel === "heavy" || trafficLevel === "severe"

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Current location indicator */}
      <motion.div
        className="absolute z-20"
        style={{
          left: `calc(${currentLocation.name === "EAEAT" ? "75%" : currentLocation.name === "Nasr City" ? "60%" : "50%"})`,
          top: `calc(${currentLocation.name === "EAEAT" ? "60%" : currentLocation.name === "Nasr City" ? "45%" : "50%"})`,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(59, 130, 246, 0.5)",
              "0 0 0 10px rgba(59, 130, 246, 0)",
              "0 0 0 0 rgba(59, 130, 246, 0)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      </motion.div>

      {/* Destination indicator */}
      <motion.div
        className="absolute z-20"
        style={{
          left: `calc(${destination.name === "EAEAT" ? "75%" : destination.name === "Nasr City" ? "60%" : "50%"})`,
          top: `calc(${destination.name === "EAEAT" ? "60%" : destination.name === "Nasr City" ? "45%" : "50%"})`,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
          <MapPin className="h-3 w-3 text-white" />
        </div>
      </motion.div>

      {/* Route line */}
      {deliveryStage === "en_route" && (
        <svg className="absolute inset-0 z-10 w-full h-full pointer-events-none">
          <motion.path
            d={`M${currentLocation.name === "EAEAT" ? "75%,60%" : currentLocation.name === "Nasr City" ? "60%,45%" : "50%,50%"} 
                L${destination.name === "EAEAT" ? "75%,60%" : destination.name === "Nasr City" ? "60%,45%" : "50%,50%"}`}
            stroke="#4285F4"
            strokeWidth="3"
            strokeDasharray="5,5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress / 100 }}
            transition={{ duration: 1 }}
          />
        </svg>
      )}

      {/* Traffic alert */}
      {showTrafficAlert && deliveryStage === "en_route" && (
        <motion.div
          className="absolute top-4 right-4 bg-red-500/80 text-white px-3 py-1 rounded-md flex items-center pointer-events-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span className="text-sm">
            {trafficLevel === "severe" ? "Severe traffic ahead" : "Heavy traffic detected"}
          </span>
        </motion.div>
      )}

      {/* ETA indicator */}
      {deliveryStage === "en_route" && (
        <motion.div
          className="absolute bottom-4 left-4 bg-white/90 px-3 py-2 rounded-md shadow-md pointer-events-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-800">ETA: {eta} min</span>
          </div>
          <div className="flex items-center mt-1">
            <Navigation className="h-4 w-4 text-gray-600 mr-2" />
            <span className="text-xs text-gray-600">
              {currentLocation.name} → {destination.name}
            </span>
          </div>
        </motion.div>
      )}

      {/* Info button */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <motion.button
          className="bg-white/90 p-2 rounded-full shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info className="h-5 w-5 text-gray-700" />
        </motion.button>
      </div>

      {/* Info panel */}
      {showInfo && (
        <motion.div
          className="absolute top-16 left-4 bg-white/90 p-3 rounded-md shadow-md max-w-xs pointer-events-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="font-medium text-gray-800 mb-2">Cairo Landmarks</h4>
          <div className="space-y-2">
            {landmarks.map((landmark, index) => (
              <div key={index} className="flex items-start">
                <MapPin className="h-4 w-4 text-secondary mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-gray-700">{landmark.name}</div>
                  <div className="text-xs text-gray-600">{landmark.description}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Arrived indicator */}
      {deliveryStage === "arrived" && (
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500/90 text-white px-4 py-2 rounded-md flex items-center shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Badge className="bg-white text-green-600 mr-2">Arrived</Badge>
          <span className="text-lg font-medium">Destination Reached</span>
        </motion.div>
      )}
    </div>
  )
}
