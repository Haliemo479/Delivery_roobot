"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-context"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Check } from "lucide-react"

export function UserPreferences() {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const preferences = user?.preferences || {
    defaultRoute: "fastest",
    notifications: true,
    language: "en",
    theme: "system",
  }

  const [formData, setFormData] = useState({
    defaultRoute: preferences.defaultRoute,
    notifications: preferences.notifications,
    language: preferences.language,
    theme: preferences.theme,
  })

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    updateUser({
      preferences: formData,
    })

    setIsLoading(false)
    setSuccess(true)

    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="bg-green-900/20 border border-green-800 text-green-300 px-3 py-2 rounded-md flex items-center text-sm">
          <Check className="h-4 w-4 mr-2" />
          Preferences updated successfully
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-amber-300">Delivery Preferences</h3>

        <div className="space-y-2">
          <Label htmlFor="defaultRoute" className="text-amber-200">
            Default Route Type
          </Label>
          <Select value={formData.defaultRoute} onValueChange={(value) => handleSelectChange("defaultRoute", value)}>
            <SelectTrigger className="bg-amber-900/50 border-amber-700 text-amber-100">
              <SelectValue placeholder="Select default route" />
            </SelectTrigger>
            <SelectContent className="bg-amber-900 border-amber-700">
              <SelectItem value="fastest" className="text-amber-100 focus:bg-amber-800 focus:text-amber-100">
                Fastest Route
              </SelectItem>
              <SelectItem value="eco" className="text-amber-100 focus:bg-amber-800 focus:text-amber-100">
                Eco-Friendly Route
              </SelectItem>
              <SelectItem value="scenic" className="text-amber-100 focus:bg-amber-800 focus:text-amber-100">
                Scenic Route
              </SelectItem>
              <SelectItem value="safe" className="text-amber-100 focus:bg-amber-800 focus:text-amber-100">
                Safe Route
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-amber-800/30">
        <h3 className="text-lg font-medium text-amber-300">Notification Settings</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications" className="text-amber-200">
              Delivery Notifications
            </Label>
            <p className="text-xs text-amber-300/70">Receive notifications about your deliveries</p>
          </div>
          <Switch
            id="notifications"
            checked={formData.notifications}
            onCheckedChange={(checked) => handleSwitchChange("notifications", checked)}
            className="data-[state=checked]:bg-amber-600"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-amber-800/30">
        <h3 className="text-lg font-medium text-amber-300">Display Settings</h3>

        <div className="space-y-2">
          <Label htmlFor="language" className="text-amber-200">
            Language
          </Label>
          <Select value={formData.language} onValueChange={(value) => handleSelectChange("language", value)}>
            <SelectTrigger className="bg-amber-900/50 border-amber-700 text-amber-100">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-amber-900 border-amber-700">
              <SelectItem value="en" className="text-amber-100 focus:bg-amber-800 focus:text-amber-100">
                English
              </SelectItem>
              <SelectItem value="ar" className="text-amber-100 focus:bg-amber-800 focus:text-amber-100">
                العربية (Arabic)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme" className="text-amber-200">
            Theme
          </Label>
          <Select value={formData.theme} onValueChange={(value) => handleSelectChange("theme", value)}>
            <SelectTrigger className="bg-amber-900/50 border-amber-700 text-amber-100">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent className="bg-amber-900 border-amber-700">
              <SelectItem value="light" className="text-amber-100 focus:bg-amber-800 focus:text-amber-100">
                Light
              </SelectItem>
              <SelectItem value="dark" className="text-amber-100 focus:bg-amber-800 focus:text-amber-100">
                Dark
              </SelectItem>
              <SelectItem value="system" className="text-amber-100 focus:bg-amber-800 focus:text-amber-100">
                System
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" disabled={isLoading} className="bg-amber-600 hover:bg-amber-700 text-white">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </div>
    </form>
  )
}
