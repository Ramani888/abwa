"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"

// Move mock data outside component to prevent recreation
const userData = {
  id: "1",
  name: "Rahul Sharma",
  email: "rahul@example.com",
  phone: "+91 9876543210",
  role: "manager",
  permissions: {
    manageProducts: true,
    manageOrders: true,
    manageCustomers: true,
    viewReports: true,
    manageUsers: false,
    manageSettings: false,
  },
}

// Separate interfaces for better type safety
interface UserPermissions {
  manageProducts: boolean
  manageOrders: boolean
  manageCustomers: boolean
  viewReports: boolean
  manageUsers: boolean
  manageSettings: boolean
}

interface UserFormData {
  name: string
  email: string
  phone: string
  role: string
  permissions: UserPermissions
}

// Extract permission checkbox into a reusable component
const PermissionCheckbox = ({ 
  id, 
  checked, 
  onCheckedChange 
}: { 
  id: keyof UserPermissions
  checked: boolean
  onCheckedChange: (checked: boolean) => void 
}) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
    />
    <Label htmlFor={id}>{formatPermissionLabel(id)}</Label>
  </div>
)

// Helper function to format permission labels
function formatPermissionLabel(permission: string): string {
  return permission
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    role: "",
    permissions: {
      manageProducts: false,
      manageOrders: false,
      manageCustomers: false,
      viewReports: false,
      manageUsers: false,
      manageSettings: false,
    },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({})
  const router = useRouter()

  useEffect(() => {
    // Simulate API call with setTimeout to show loading state
    const timer = setTimeout(() => {
      // In a real app, fetch user data based on params.id
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        permissions: { ...userData.permissions },
      })
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error when field is edited
    if (errors[name as keyof UserFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePermissionChange = (permission: keyof UserPermissions, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked,
      },
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {}
    
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.role) newErrors.role = "Role is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSaving(true)

    try {
      // Here you would implement actual user update logic
      // For this example, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success message or redirect
      router.push("/dashboard/users")
    } catch (error) {
      console.error("Error saving user:", error)
      // Handle error appropriately
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading user data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Edit User</h2>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Update user details and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="salesperson">Salesperson</SelectItem>
                  <SelectItem value="inventory">Inventory Manager</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
            </div>

            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(Object.keys(formData.permissions) as Array<keyof UserPermissions>).map((permission) => (
                  <PermissionCheckbox
                    key={permission}
                    id={permission}
                    checked={formData.permissions[permission]}
                    onCheckedChange={(checked) => handlePermissionChange(permission, checked)}
                  />
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

