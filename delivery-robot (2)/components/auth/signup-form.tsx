"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "./auth-context"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function SignupForm({ onSuccess, onToggleForm }) {
  const { signup, isLoading } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("student")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      const success = await signup(name, email, password, role as any)
      if (success) {
        if (onSuccess) onSuccess()
      } else {
        setError("Email already in use")
      }
    } catch (err) {
      setError("An error occurred during signup")
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
          <CardTitle className="text-amber-400">Create Account</CardTitle>
          <CardDescription className="text-amber-300/70">Sign up to use Pharoah LORM delivery services</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-amber-200">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-amber-900/50 border-amber-700 text-amber-100 placeholder:text-amber-400/50"
              />
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-amber-200">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-amber-900/50 border-amber-700 text-amber-100 placeholder:text-amber-400/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-amber-200">Role</Label>
              <RadioGroup value={role} onValueChange={setRole} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" className="text-amber-500" />
                  <Label htmlFor="student" className="text-amber-200">
                    Student
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="faculty" id="faculty" className="text-amber-500" />
                  <Label htmlFor="faculty" className="text-amber-200">
                    Faculty
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="staff" id="staff" className="text-amber-500" />
                  <Label htmlFor="staff" className="text-amber-200">
                    Staff
                  </Label>
                </div>
              </RadioGroup>
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
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={onToggleForm} className="text-amber-400 hover:text-amber-300">
            Already have an account? Log in
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
