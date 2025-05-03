"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth/auth-context"
import { ProfileForm } from "./profile-form"
import { DeliveryHistory } from "./delivery-history"
import { UserPreferences } from "./user-preferences"
import { LogOut, User, Settings, Clock, Package } from "lucide-react"

export function UserProfile({ onClose }) {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")

  if (!user) return null

  const handleLogout = () => {
    logout()
    if (onClose) onClose()
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "student":
        return "bg-blue-500 hover:bg-blue-600"
      case "faculty":
        return "bg-purple-500 hover:bg-purple-600"
      case "staff":
        return "bg-green-500 hover:bg-green-600"
      case "admin":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="bg-amber-950/90 border-amber-800/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-800 to-amber-900 pb-8">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-amber-100 text-2xl">{user.name}</CardTitle>
              <CardDescription className="text-amber-200/70 flex items-center mt-1">
                <Badge className={`${getRoleBadgeColor(user.role)} text-white mr-2`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
                {user.email}
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleLogout} className="border-amber-700 text-amber-200">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <div className="relative">
          <div className="absolute -top-12 left-6">
            <Avatar className="h-24 w-24 border-4 border-amber-950/90">
              <AvatarImage src={user.avatar || "/placeholder.svg?height=96&width=96"} alt={user.name} />
              <AvatarFallback className="bg-amber-700 text-amber-100">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <CardContent className="pt-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 bg-amber-900/50">
              <TabsTrigger value="profile" className="data-[state=active]:bg-amber-700">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-amber-700">
                <Clock className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
              <TabsTrigger value="preferences" className="data-[state=active]:bg-amber-700">
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-4">
              <ProfileForm />
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <DeliveryHistory />
            </TabsContent>

            <TabsContent value="preferences" className="mt-4">
              <UserPreferences />
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="border-t border-amber-800/30 flex justify-between">
          <div className="text-xs text-amber-300/70">
            {user.academicId && (
              <div className="flex items-center">
                <Package className="h-3 w-3 mr-1" />
                Academic ID: {user.academicId}
              </div>
            )}
          </div>
          <div className="text-xs text-amber-300/70">Member since: April 2025</div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
