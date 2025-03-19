"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

// Mock user data
const userData = {
  id: "1",
  name: "Rahul Sharma",
  email: "rahul@example.com",
  role: "manager",
  permissions: {
    manageProducts: true,
    manageOrders: true,
    manageCustomers: true,
    viewReports: true,
    manageUsers: false,
    manageSettings: false,
    manageStock: true,
    manageCategories: true,
    viewAnalytics: true,
    exportData: false,
    manageInvoices: true,
    viewDashboard: true,
  },
}

export default function UserPermissionsPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null)
  const [permissions, setPermissions] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // In a real app, you would fetch the user data from an API
    // For now, we'll just use the mock data
    setUser(userData)
    setPermissions(userData.permissions)
    setIsLoading(false)
  }, [params.id])

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Here you would implement actual permission update logic
    // For now, we'll just simulate it
    setTimeout(() => {
      setIsSaving(false)
      router.push("/dashboard/users")
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading user permissions...</p>
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
        <h2 className="text-3xl font-bold tracking-tight">Manage Permissions</h2>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>
              {user.email} • {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Content Management</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageProducts"
                    checked={permissions.manageProducts}
                    onCheckedChange={(checked) => handlePermissionChange("manageProducts", checked as boolean)}
                  />
                  <Label htmlFor="manageProducts">Manage Products</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageCategories"
                    checked={permissions.manageCategories}
                    onCheckedChange={(checked) => handlePermissionChange("manageCategories", checked as boolean)}
                  />
                  <Label htmlFor="manageCategories">Manage Categories</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageStock"
                    checked={permissions.manageStock}
                    onCheckedChange={(checked) => handlePermissionChange("manageStock", checked as boolean)}
                  />
                  <Label htmlFor="manageStock">Manage Stock</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Customer & Orders</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageCustomers"
                    checked={permissions.manageCustomers}
                    onCheckedChange={(checked) => handlePermissionChange("manageCustomers", checked as boolean)}
                  />
                  <Label htmlFor="manageCustomers">Manage Customers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageOrders"
                    checked={permissions.manageOrders}
                    onCheckedChange={(checked) => handlePermissionChange("manageOrders", checked as boolean)}
                  />
                  <Label htmlFor="manageOrders">Manage Orders</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageInvoices"
                    checked={permissions.manageInvoices}
                    onCheckedChange={(checked) => handlePermissionChange("manageInvoices", checked as boolean)}
                  />
                  <Label htmlFor="manageInvoices">Manage Invoices</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Reports & Analytics</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="viewDashboard"
                    checked={permissions.viewDashboard}
                    onCheckedChange={(checked) => handlePermissionChange("viewDashboard", checked as boolean)}
                  />
                  <Label htmlFor="viewDashboard">View Dashboard</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="viewReports"
                    checked={permissions.viewReports}
                    onCheckedChange={(checked) => handlePermissionChange("viewReports", checked as boolean)}
                  />
                  <Label htmlFor="viewReports">View Reports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="viewAnalytics"
                    checked={permissions.viewAnalytics}
                    onCheckedChange={(checked) => handlePermissionChange("viewAnalytics", checked as boolean)}
                  />
                  <Label htmlFor="viewAnalytics">View Analytics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="exportData"
                    checked={permissions.exportData}
                    onCheckedChange={(checked) => handlePermissionChange("exportData", checked as boolean)}
                  />
                  <Label htmlFor="exportData">Export Data</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Administration</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageUsers"
                    checked={permissions.manageUsers}
                    onCheckedChange={(checked) => handlePermissionChange("manageUsers", checked as boolean)}
                  />
                  <Label htmlFor="manageUsers">Manage Users</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageSettings"
                    checked={permissions.manageSettings}
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
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Permissions"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

