"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth/auth-context"
import { Loader2, Check } from "lucide-react"

export function ProfileForm() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    department: user?.department || "",
    academicId: user?.academicId || "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
      name: formData.name,
      department: formData.department,
      academicId: formData.academicId,
    })

    setIsLoading(false)
    setSuccess(true)
    setIsEditing(false)

    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000)
  }

  const departments = [
    "Computer Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Robotics Engineering",
    "Artificial Intelligence",
    "Biomedical Engineering",
    "Environmental Engineering",
    "Chemical Engineering",
    "Industrial Engineering",
  ]

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-amber-300">Personal Information</h3>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="border-amber-700 text-amber-200 hover:bg-amber-800"
            >
              Edit Profile
            </Button>
          ) : null}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-amber-200">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-amber-900/50 border-amber-700 text-amber-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-amber-200">
                Department
              </Label>
              <Select value={formData.department} onValueChange={(value) => handleSelectChange("department", value)}>
                <SelectTrigger className="bg-amber-900/50 border-amber-700 text-amber-100">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-amber-900 border-amber-700">
                  {departments.map((dept) => (
                    <SelectItem
                      key={dept}
                      value={dept}
                      className="text-amber-100 focus:bg-amber-800 focus:text-amber-100"
                    >
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {user.role === "student" && (
              <div className="space-y-2">
                <Label htmlFor="academicId" className="text-amber-200">
                  Academic ID
                </Label>
                <Input
                  id="academicId"
                  name="academicId"
                  value={formData.academicId}
                  onChange={handleChange}
                  className="bg-amber-900/50 border-amber-700 text-amber-100"
                />
              </div>
            )}

            <div className="flex space-x-2 pt-2">
              <Button type="submit" disabled={isLoading} className="bg-amber-600 hover:bg-amber-700 text-white">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-amber-700 text-amber-200 hover:bg-amber-800"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {success && (
              <div className="bg-green-900/20 border border-green-800 text-green-300 px-3 py-2 rounded-md flex items-center text-sm">
                <Check className="h-4 w-4 mr-2" />
                Profile updated successfully
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-amber-300/70">Full Name</p>
                <p className="text-amber-100">{user.name}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-amber-300/70">Email</p>
                <p className="text-amber-100">{user.email}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-amber-300/70">Department</p>
                <p className="text-amber-100">{user.department || "Not specified"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-amber-300/70">Role</p>
                <p className="text-amber-100 capitalize">{user.role}</p>
              </div>

              {user.academicId && (
                <div className="space-y-1">
                  <p className="text-xs text-amber-300/70">Academic ID</p>
                  <p className="text-amber-100">{user.academicId}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-amber-800/30">
        <h3 className="text-lg font-medium text-amber-300 mb-4">Account Security</h3>
        <Button variant="outline" className="border-amber-700 text-amber-200 hover:bg-amber-800">
          Change Password
        </Button>
      </div>
    </div>
  )
}
