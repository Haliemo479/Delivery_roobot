"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Calendar, MapPin, Clock, ChevronDown, ChevronUp, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { format, parseISO } from "date-fns"

export function DeliveryHistory() {
  const { user } = useAuth()
  const [expandedId, setExpandedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  if (!user) return null

  const deliveryHistory = user.deliveryHistory || []

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy 'at' h:mm a")
    } catch (e) {
      return dateString
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  const filteredDeliveries = deliveryHistory.filter(
    (delivery) =>
      delivery.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-amber-400/50" />
          <Input
            placeholder="Search deliveries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-amber-900/50 border-amber-700 text-amber-100 placeholder:text-amber-400/50"
          />
        </div>
      </div>

      {filteredDeliveries.length === 0 ? (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-amber-500/30 mx-auto mb-3" />
          <h3 className="text-amber-300 text-lg mb-1">No deliveries found</h3>
          <p className="text-amber-300/70 text-sm">
            {searchTerm ? "Try a different search term" : "You haven't made any deliveries yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDeliveries.map((delivery) => (
            <Card key={delivery.id} className="bg-amber-900/30 border-amber-800/50 overflow-hidden">
              <CardContent className="p-0">
                <div
                  className="p-4 cursor-pointer hover:bg-amber-900/50 transition-colors"
                  onClick={() => toggleExpand(delivery.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-amber-400 mr-2" />
                      <div>
                        <h4 className="text-amber-200 font-medium">
                          {delivery.from} → {delivery.to}
                        </h4>
                        <p className="text-xs text-amber-300/70">{formatDate(delivery.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(delivery.status)}
                      {expandedId === delivery.id ? (
                        <ChevronUp className="h-5 w-5 text-amber-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-amber-400" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedId === delivery.id && (
                  <div className="px-4 pb-4 pt-1 border-t border-amber-800/30 bg-amber-900/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-amber-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-xs text-amber-300/70">From</p>
                          <p className="text-sm text-amber-200">{delivery.from}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-amber-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-xs text-amber-300/70">To</p>
                          <p className="text-sm text-amber-200">{delivery.to}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 text-amber-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-xs text-amber-300/70">Date</p>
                          <p className="text-sm text-amber-200">{formatDate(delivery.date)}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Clock className="h-4 w-4 text-amber-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-xs text-amber-300/70">Delivery Time</p>
                          <p className="text-sm text-amber-200">15 minutes</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-700 text-amber-200 hover:bg-amber-800"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
