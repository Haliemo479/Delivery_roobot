"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define user type
export type User = {
  id: string
  name: string
  email: string
  avatar?: string
  role: "student" | "faculty" | "staff" | "admin"
  academicId?: string
  department?: string
  preferences?: {
    defaultRoute?: "fastest" | "eco" | "scenic" | "safe"
    notifications?: boolean
    language?: "en" | "ar"
    theme?: "light" | "dark" | "system"
  }
  deliveryHistory?: Array<{
    id: string
    date: string
    from: string
    to: string
    status: string
  }>
}

// Define context type
type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, role: User["role"]) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  updateUser: () => {},
})

// Sample users for demo purposes
const DEMO_USERS: User[] = [
  {
    id: "1",
    name: "Ahmed Hassan",
    email: "ahmed@eaeat.edu",
    avatar: "/placeholder.svg?height=200&width=200",
    role: "student",
    academicId: "2020001",
    department: "Computer Engineering",
    preferences: {
      defaultRoute: "fastest",
      notifications: true,
      language: "en",
      theme: "system",
    },
    deliveryHistory: [
      {
        id: "del-001",
        date: "2025-04-28T14:30:00",
        from: "EAEAT Library",
        to: "Student Dorms",
        status: "completed",
      },
      {
        id: "del-002",
        date: "2025-04-25T11:15:00",
        from: "Campus Cafeteria",
        to: "Engineering Building",
        status: "completed",
      },
    ],
  },
  {
    id: "2",
    name: "Fatima Mahmoud",
    email: "fatima@eaeat.edu",
    avatar: "/placeholder.svg?height=200&width=200",
    role: "faculty",
    academicId: "2020150",
    department: "Robotics Engineering",
    preferences: {
      defaultRoute: "eco",
      notifications: true,
      language: "en",
      theme: "dark",
    },
    deliveryHistory: [
      {
        id: "del-003",
        date: "2025-04-29T09:45:00",
        from: "Admin Building",
        to: "Robotics Lab",
        status: "completed",
      },
    ],
  },
]

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("pharoah_lorm_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user data:", error)
        localStorage.removeItem("pharoah_lorm_user")
      }
    }
    setIsLoading(false)
  }, [])

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Find user by email (in a real app, this would be a server request)
    const foundUser = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (foundUser) {
      // In a real app, we would verify the password here
      setUser(foundUser)
      localStorage.setItem("pharoah_lorm_user", JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  // Signup function
  const signup = async (name: string, email: string, password: string, role: User["role"]): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if email already exists
    const existingUser = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      setIsLoading(false)
      return false
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      avatar: "/placeholder.svg?height=200&width=200",
      academicId:
        role === "student"
          ? `2020${Math.floor(Math.random() * 220)
              .toString()
              .padStart(3, "0")}`
          : undefined,
      preferences: {
        defaultRoute: "fastest",
        notifications: true,
        language: "en",
        theme: "system",
      },
      deliveryHistory: [],
    }

    // In a real app, we would save this to a database
    setUser(newUser)
    localStorage.setItem("pharoah_lorm_user", JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("pharoah_lorm_user")
  }

  // Update user data
  const updateUser = (userData: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem("pharoah_lorm_user", JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext)
