"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, Wind, Thermometer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Weather conditions with their respective icons
const weatherIcons = {
  clear: Sun,
  cloudy: Cloud,
  partlyCloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
  stormy: CloudLightning,
  foggy: CloudFog,
  windy: Wind,
}

// Mock weather data for Cairo locations
const mockWeatherData = {
  "Nasr City": {
    temperature: 32,
    feelsLike: 34,
    condition: "clear",
    humidity: 45,
    windSpeed: 12,
    forecast: [
      { day: "Today", high: 32, low: 24, condition: "clear" },
      { day: "Tomorrow", high: 33, low: 25, condition: "clear" },
      { day: "Wed", high: 31, low: 23, condition: "partlyCloudy" },
    ],
  },
  "Cairo Tower": {
    temperature: 30,
    feelsLike: 32,
    condition: "partlyCloudy",
    humidity: 50,
    windSpeed: 15,
    forecast: [
      { day: "Today", high: 30, low: 23, condition: "partlyCloudy" },
      { day: "Tomorrow", high: 31, low: 24, condition: "cloudy" },
      { day: "Wed", high: 29, low: 22, condition: "rainy" },
    ],
  },
  EAEAT: {
    temperature: 33,
    feelsLike: 35,
    condition: "clear",
    humidity: 40,
    windSpeed: 10,
    forecast: [
      { day: "Today", high: 33, low: 25, condition: "clear" },
      { day: "Tomorrow", high: 34, low: 26, condition: "clear" },
      { day: "Wed", high: 32, low: 24, condition: "partlyCloudy" },
    ],
  },
  "Tahrir Square": {
    temperature: 31,
    feelsLike: 33,
    condition: "cloudy",
    humidity: 55,
    windSpeed: 8,
    forecast: [
      { day: "Today", high: 31, low: 24, condition: "cloudy" },
      { day: "Tomorrow", high: 30, low: 23, condition: "partlyCloudy" },
      { day: "Wed", high: 29, low: 22, condition: "rainy" },
    ],
  },
  "Great Pyramids of Giza": {
    temperature: 34,
    feelsLike: 36,
    condition: "clear",
    humidity: 35,
    windSpeed: 18,
    forecast: [
      { day: "Today", high: 34, low: 25, condition: "clear" },
      { day: "Tomorrow", high: 35, low: 26, condition: "windy" },
      { day: "Wed", high: 33, low: 24, condition: "partlyCloudy" },
    ],
  },
  "Egyptian Museum": {
    temperature: 31,
    feelsLike: 33,
    condition: "partlyCloudy",
    humidity: 48,
    windSpeed: 12,
    forecast: [
      { day: "Today", high: 31, low: 24, condition: "partlyCloudy" },
      { day: "Tomorrow", high: 32, low: 25, condition: "cloudy" },
      { day: "Wed", high: 30, low: 23, condition: "partlyCloudy" },
    ],
  },
  "New Cairo": {
    temperature: 33,
    feelsLike: 34,
    condition: "clear",
    humidity: 42,
    windSpeed: 14,
    forecast: [
      { day: "Today", high: 33, low: 25, condition: "clear" },
      { day: "Tomorrow", high: 34, low: 26, condition: "clear" },
      { day: "Wed", high: 32, low: 24, condition: "partlyCloudy" },
    ],
  },
}

// Get weather for a location or return default
const getWeatherForLocation = (location) => {
  const locationName = Object.keys(mockWeatherData).find((name) => location.toLowerCase().includes(name.toLowerCase()))
  return locationName ? mockWeatherData[locationName] : mockWeatherData["Nasr City"]
}

export function WeatherDisplay({ location, className }) {
  const [weather, setWeather] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call with a delay
    const timer = setTimeout(() => {
      setWeather(getWeatherForLocation(location))
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [location])

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-2", className)}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!weather) {
    return null
  }

  const WeatherIcon = weatherIcons[weather.condition] || Sun

  return (
    <div className={cn("text-amber-100", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.1, 0.9, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="mr-2 text-amber-400"
          >
            <WeatherIcon className="h-5 w-5" />
          </motion.div>
          <div>
            <div className="flex items-center">
              <Thermometer className="h-3 w-3 mr-1 text-amber-500" />
              <span className="text-sm font-medium">{weather.temperature}°C</span>
            </div>
            <span className="text-xs text-amber-300/70">Feels like {weather.feelsLike}°C</span>
          </div>
        </div>

        <div className="text-right">
          <Badge variant="outline" className="bg-amber-900/30 border-amber-700/50 text-xs">
            {weather.condition.charAt(0).toUpperCase() + weather.condition.slice(1)}
          </Badge>
          <div className="text-xs text-amber-300/70 mt-1">Wind: {weather.windSpeed} km/h</div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-amber-800/30">
        <div className="text-xs text-amber-300 mb-1">3-Day Forecast</div>
        <div className="flex justify-between">
          {weather.forecast.map((day, index) => {
            const DayIcon = weatherIcons[day.condition] || Sun
            return (
              <div key={index} className="text-center flex-1">
                <div className="text-xs font-medium">{day.day}</div>
                <DayIcon className="h-3 w-3 mx-auto my-1 text-amber-400" />
                <div className="text-xs">
                  <span className="text-amber-200">{day.high}°</span>
                  <span className="text-amber-400/50 mx-1">/</span>
                  <span className="text-amber-400/50">{day.low}°</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
