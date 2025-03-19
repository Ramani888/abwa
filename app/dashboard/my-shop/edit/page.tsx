"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock data for the shop
const shopData = {
  id: "1",
  name: "Green Harvest Agro Shop",
  address: "123 Farm Road, Agricity",
  phone: "+91 9876543210",
  email: "contact@greenharvest.com",
  gstNumber: "22AAAAA0000A1Z5",
}

export default function EditShopPage() {
  const [formData, setFormData] = useState({
    name: shopData.name,
    address: shopData.address,
    phone: shopData.phone,
    email: shopData.email,
    gstNumber: shopData.gstNumber,
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Here you would implement actual shop update logic
    // For now, we'll just simulate it
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard/my-shop")
    }, 1000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Edit Shop Details</h2>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Shop Information</CardTitle>
            <CardDescription>Update your agro shop details below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Shop Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Green Harvest Agro Shop"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="123 Farm Road, Agricity"
                value={formData.address}
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

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="contact@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstNumber">GST Number (Optional)</Label>
              <Input
                id="gstNumber"
                name="gstNumber"
                placeholder="22AAAAA0000A1Z5"
                value={formData.gstNumber}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

