"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Layers, MapPin, LocateFixed, X, Car, Train } from "lucide-react"

export function EnhancedMapControls({ onZoomIn, onZoomOut, onCenterMap }) {
  const [showLayers, setShowLayers] = useState(false)
  const [activeLayer, setActiveLayer] = useState("standard")

  const layers = [
    { id: "standard", name: "Standard", icon: MapPin },
    { id: "traffic", name: "Traffic", icon: Car },
    { id: "transit", name: "Transit", icon: Train },
    { id: "satellite", name: "Satellite", icon: Layers },
  ]

  return (
    <div className="absolute right-4 bottom-4 flex flex-col space-y-2 pointer-events-auto">
      {/* Zoom controls */}
      <div className="flex flex-col space-y-1 bg-white/90 rounded-md shadow-md">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-b-none hover:bg-gray-100" onClick={onZoomIn}>
          <ZoomIn className="h-4 w-4 text-gray-700" />
        </Button>
        <div className="h-px bg-gray-200" />
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-t-none hover:bg-gray-100" onClick={onZoomOut}>
          <ZoomOut className="h-4 w-4 text-gray-700" />
        </Button>
      </div>

      {/* Center map button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 bg-white/90 shadow-md hover:bg-gray-100"
        onClick={onCenterMap}
      >
        <LocateFixed className="h-4 w-4 text-gray-700" />
      </Button>

      {/* Layers button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 bg-white/90 shadow-md hover:bg-gray-100"
        onClick={() => setShowLayers(!showLayers)}
      >
        <Layers className="h-4 w-4 text-gray-700" />
      </Button>

      {/* Layers panel */}
      {showLayers && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute bottom-20 right-0 bg-white/95 p-2 rounded-md shadow-lg w-48"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-800">Map Layers</h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-gray-100"
              onClick={() => setShowLayers(false)}
            >
              <X className="h-3 w-3 text-gray-600" />
            </Button>
          </div>

          <div className="space-y-1">
            {layers.map((layer) => {
              const LayerIcon = layer.icon
              return (
                <Button
                  key={layer.id}
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-xs h-8 ${
                    activeLayer === layer.id ? "bg-primary-100 text-primary-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveLayer(layer.id)}
                >
                  <LayerIcon className="h-3 w-3 mr-2" />
                  {layer.name}
                </Button>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}
