"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState("owner")
  const [ownerData, setOwnerData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [shopData, setShopData] = useState({
    shopName: "",
    address: "",
    shopPhone: "",
    shopEmail: "",
    gstNumber: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setOwnerData((prev) => ({ ...prev, [name]: value }))
  }

  const handleShopChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setShopData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Here you would implement actual registration logic
    // For now, we'll just simulate registration
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  const nextStep = () => {
    setActiveTab("shop")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <Link href="/" className="absolute left-8 top-8 flex items-center gap-2">
        <ShoppingBag className="h-6 w-6" />
        <span className="font-bold">AgroBill</span>
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Agro Shop</CardTitle>
          <CardDescription>Register as a shop owner and set up your agro shop</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="owner">Owner Details</TabsTrigger>
              <TabsTrigger value="shop">Shop Details</TabsTrigger>
            </TabsList>
            <TabsContent value="owner" className="space-y-4 mt-4">
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={ownerData.name}
                    onChange={handleOwnerChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={ownerData.email}
                    onChange={handleOwnerChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+91 9876543210"
                    value={ownerData.phone}
                    onChange={handleOwnerChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={ownerData.password}
                    onChange={handleOwnerChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={ownerData.confirmPassword}
                    onChange={handleOwnerChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="button" className="w-full" onClick={nextStep}>
                  Next: Shop Details
                </Button>
              </CardFooter>
            </TabsContent>
            <TabsContent value="shop">
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input
                    id="shopName"
                    name="shopName"
                    placeholder="Green Harvest Agro Shop"
                    value={shopData.shopName}
                    onChange={handleShopChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Shop Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="123 Farm Road, Agricity"
                    value={shopData.address}
                    onChange={handleShopChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopPhone">Shop Phone Number</Label>
                  <Input
                    id="shopPhone"
                    name="shopPhone"
                    placeholder="+91 9876543210"
                    value={shopData.shopPhone}
                    onChange={handleShopChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopEmail">Shop Email (Optional)</Label>
                  <Input
                    id="shopEmail"
                    name="shopEmail"
                    type="email"
                    placeholder="shop@example.com"
                    value={shopData.shopEmail}
                    onChange={handleShopChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                  <Input
                    id="gstNumber"
                    name="gstNumber"
                    placeholder="22AAAAA0000A1Z5"
                    value={shopData.gstNumber}
                    onChange={handleShopChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Register Shop"}
                </Button>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                    Login
                  </Link>
                </div>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </form>
      </Card>
    </div>
  )
}

