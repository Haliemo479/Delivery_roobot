"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useAuth } from "@/components/auth/auth-context"
import { UserProfile } from "@/components/user/user-profile"
import { AuthModal } from "@/components/auth/auth-modal"
import { LogOut, User, Settings, Package, LogIn } from "lucide-react"

export function UserAvatarMenu() {
  const { user, isAuthenticated, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const handleLogout = () => {
    logout()
  }

  const openProfile = () => {
    setIsProfileOpen(true)
  }

  const openAuthModal = () => {
    setIsAuthModalOpen(true)
  }

  if (!isAuthenticated) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={openAuthModal}
          className="border-amber-700 text-amber-200 hover:bg-amber-800"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Button>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} alt={user?.name} />
              <AvatarFallback className="bg-amber-700 text-amber-100">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-amber-900 border-amber-700" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-amber-200">{user?.name}</p>
              <p className="text-xs leading-none text-amber-400/70">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-amber-800" />
          <DropdownMenuItem onClick={openProfile} className="text-amber-200 focus:bg-amber-800 focus:text-amber-100">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-amber-200 focus:bg-amber-800 focus:text-amber-100">
            <Package className="mr-2 h-4 w-4" />
            <span>My Deliveries</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-amber-200 focus:bg-amber-800 focus:text-amber-100">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-amber-800" />
          <DropdownMenuItem onClick={handleLogout} className="text-amber-200 focus:bg-amber-800 focus:text-amber-100">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-4xl p-0 bg-transparent border-none shadow-none">
          <UserProfile onClose={() => setIsProfileOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
