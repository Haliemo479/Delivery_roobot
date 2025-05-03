"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"

export function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true)

  const handleSuccess = () => {
    onClose()
  }

  const toggleForm = () => {
    setIsLogin(!isLogin)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-none shadow-none">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <LoginForm key="login" onSuccess={handleSuccess} onToggleForm={toggleForm} />
          ) : (
            <SignupForm key="signup" onSuccess={handleSuccess} onToggleForm={toggleForm} />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
