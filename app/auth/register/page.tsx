"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const router = useRouter()

  const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setOwnerData((prev) => ({ ...prev, [name]: value }))
  }

  const handleShopChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setShopData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Validate passwords match
    if (ownerData.password !== ownerData.confirmPassword) {
      alert("Passwords do not match")
      setIsLoading(false)
      return
    }
    
    // Here you would implement actual registration logic
    // For now, we'll just simulate registration
    setTimeout(() => {
      setIsLoading(false)
      setShowSuccessDialog(true)
    }, 1000)
  }

  const nextStep = () => {
    setActiveTab("shop")
  }

  const handleSuccessClose = () => {
    setShowSuccessDialog(false)
    router.push("/dashboard/my-shop")
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
          <CardDescription>
            Register as a shop owner and set up your agro shop
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="owner">Owner Details</TabsTrigger>
              <TabsTrigger value="shop">Shop Details</TabsTrigger>
            </TabsList>
            <TabsContent value="owner" className="space-y-4">
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
                \

