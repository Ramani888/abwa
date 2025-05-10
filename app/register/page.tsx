"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RegisterImage from "@/assets/images/Galcon_Login_Image.png"

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
    <div className="flex min-h-screen bg-white">
      {/* Logo at the top */}
      <Link href="/" className="absolute left-8 top-8 flex items-center gap-2 z-10">
        <ShoppingBag className="h-6 w-6" />
        <span className="font-bold">AgroBill</span>
      </Link>

      {/* Left Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create Your Agro Shop</CardTitle>
            <CardDescription className="text-base">Register as a shop owner and set up your agro shop</CardDescription>
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
                      className="h-11"
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
                      className="h-11"
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
                      className="h-11"
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
                      className="h-11"
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
                      className="h-11"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="button" className="w-full h-11" onClick={nextStep}>
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
                      className="h-11"
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
                      className="h-11"
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
                      className="h-11"
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
                      className="h-11"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full h-11" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Register Shop"}
                  </Button>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-medium hover:underline">
                      Login
                    </Link>
                  </div>
                </CardFooter>
              </TabsContent>
            </Tabs>
          </form>
        </Card>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-green-50 to-green-100">
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="relative w-full h-full max-w-2xl">
            <Image 
              src={RegisterImage}
              alt="Agro Shop Registration" 
              fill
              priority
              className="object-contain rounded-lg shadow-lg"
            />
          </div>
          <div className="absolute bottom-10 left-10 bg-white/80 backdrop-blur-sm p-4 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold text-green-800">Grow Your Agro Business</h3>
            <p className="text-sm text-gray-700">Join thousands of shop owners using AgroBill to streamline operations and increase profits.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

