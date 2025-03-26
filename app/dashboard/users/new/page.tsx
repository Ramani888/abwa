"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"

export default function NewUserPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "salesperson",
    permissions: {
      manageProducts: false,
      manageOrders: true,
      manageCustomers: true,
      viewReports: false,
      manageUsers: false,
      manageSettings: false,
    },
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Here you would implement actual user creation logic
    // For now, we'll just simulate it
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard/users")
    }, 1000)
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Add New User</h2>
      </div>

      <Card className="w-full">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Add a new staff user to your agro shop</CardDescription>
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
                required
              />
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
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="salesperson">Salesperson</SelectItem>
                  <SelectItem value="inventory">Inventory Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageProducts"
                    checked={formData.permissions.manageProducts}
                    onCheckedChange={(checked) => handlePermissionChange("manageProducts", checked as boolean)}
                  />
                  <Label htmlFor="manageProducts">Manage Products</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageOrders"
                    checked={formData.permissions.manageOrders}
                    onCheckedChange={(checked) => handlePermissionChange("manageOrders", checked as boolean)}
                  />
                  <Label htmlFor="manageOrders">Manage Orders</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageCustomers"
                    checked={formData.permissions.manageCustomers}
                    onCheckedChange={(checked) => handlePermissionChange("manageCustomers", checked as boolean)}
                  />
                  <Label htmlFor="manageCustomers">Manage Customers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="viewReports"
                    checked={formData.permissions.viewReports}
                    onCheckedChange={(checked) => handlePermissionChange("viewReports", checked as boolean)}
                  />
                  <Label htmlFor="viewReports">View Reports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageUsers"
                    checked={formData.permissions.manageUsers}
                    onCheckedChange={(checked) => handlePermissionChange("manageUsers", checked as boolean)}
                  />
                  <Label htmlFor="manageUsers">Manage Users</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageSettings"
                    checked={formData.permissions.manageSettings}
                    onCheckedChange={(checked) => handlePermissionChange("manageSettings", checked as boolean)}
                  />
                  <Label htmlFor="manageSettings">Manage Settings</Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add User"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

