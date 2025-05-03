"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "./auth-context"

export function LoginForm({ onSuccess, onToggleForm }) {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    try {
      const success = await login(email, password)
      if (success) {
        if (onSuccess) onSuccess()
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred during login")
      console.error(err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-amber-950/90 border-amber-800/50">
        <CardHeader>
          <CardTitle className="text-amber-400">Login</CardTitle>
          <CardDescription className="text-amber-300/70">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-amber-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-amber-900/50 border-amber-700 text-amber-100 placeholder:text-amber-400/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-amber-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-amber-900/50 border-amber-700 text-amber-100 placeholder:text-amber-400/50"
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-300 px-3 py-2 rounded-md flex items-center text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-amber-300/70">
            Demo accounts:
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>ahmed@eaeat.edu (Student)</li>
              <li>fatima@eaeat.edu (Faculty)</li>
              <li>Any password will work</li>
            </ul>
          </div>
          <div className="text-center w-full">
            <Button variant="link" onClick={onToggleForm} className="text-amber-400 hover:text-amber-300">
              Don't have an account? Sign up
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
