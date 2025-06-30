"use client"

import type React from "react"

import { use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { PlanBadge } from "@/components/dashboard/plan-badge"
import Link from "next/link"
import { Crown } from "lucide-react"
import { usePlan } from "@/components/dashboard/plan-context"
import { useAuth } from "@/components/auth-provider"
import { serverUpdateOwner, serverUpdateUser, serverUpdateUserPasswordByCurrent } from "@/services/serverApi"
import { set } from "date-fns"

export default function ProfilePage() {
  const { currentPlan } = usePlan()
  const { user, updateUser, owner, updateOwner } = useAuth();
  console.log("User:", user)
  console.log("Owner:", owner)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    number: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [shopData, setShopData] = useState({
    name: "",
    address: "",
    number: "",
    email: "",
    gst: "",
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    if (passwordError) {
      setPasswordError("")
    }
  }

  const handleShopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShopData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await serverUpdateUser({...profileData, _id: user?._id, number: Number(profileData.number)});
      updateUser({
        ...profileData,
        number: Number(profileData.number)
      })
      if (Number(user?.number) === Number(owner?.number)) {
        const newOwnerData = {
          ...owner,
          name: profileData.name,
          email: profileData.email,
          number: Number(profileData.number),
        }
        updateOwner(newOwnerData)
      }
      fetchProfileData();
      setIsLoading(false)
    } catch (error) {
      console.error("Error creating customer:", error)
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate that passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New password and confirmation do not match")
      return
    }
    
    try {
      setIsLoading(true)
      const res = await serverUpdateUserPasswordByCurrent({
        _id: user?._id ?? '',
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      setIsLoading(false)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setPasswordError("")
    } catch (error: any) {
      setPasswordError(error?.response?.data?.message || "An error occurred")
      console.error("Error creating customer:", error)
      setIsLoading(false)
    }
  }

  const handleShopSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      // You need to implement serverUpdateShop or similar API call
      await serverUpdateOwner({
        ...owner,
        name: owner?.name ?? "",
        email: owner?.email ?? "",
        number: owner?.number ?? 0,
        password: owner?.password ?? "",
        createdAt: owner?.createdAt ?? new Date(),
        updatedAt: owner?.updatedAt ?? new Date(),
        shop: {
          ...shopData,
          number: Number(shopData.number),
          _id: owner?.shop?._id ?? "",
        },
      })
      updateOwner({
        ...owner,
        name: owner?.name ?? "",
        email: owner?.email ?? "",
        number: owner?.number ?? 0,
        password: owner?.password ?? "",
        createdAt: owner?.createdAt ?? new Date(),
        updatedAt: owner?.updatedAt ?? new Date(),
        shop: {
          ...shopData,
          number: Number(shopData.number),
          _id: owner?.shop?._id ?? "",
        },
      })
      setIsLoading(false)
    } catch (error) {
      console.error("Error updating shop:", error)
      setIsLoading(false)
    }
  }

  const fetchProfileData = () => {
    setProfileData({
      name: user?.name ?? '',
      email: user?.email ?? '',
      number: String(user?.number) ?? '',
    })
    setShopData({
      name: owner?.shop?.name ?? '',
      address: owner?.shop?.address ?? '',
      number: String(owner?.shop?.number ?? ''),
      email: owner?.shop?.email ?? '',
      gst: owner?.shop?.gst ?? '',
    })
  }

  useEffect(() => {
    fetchProfileData()
  }, [user])

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold tracking-tight mb-6">My Profile</h2>

      <div className="flex flex-col items-center justify-center mb-8">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
          <AvatarFallback className="uppercase">
            {(user?.name?.[0] ?? '') + (user?.name?.[1] ?? '')}
          </AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm" className="mb-2">
          Change Avatar
        </Button>
        <div className="flex items-center gap-2 mt-2">
          <PlanBadge />
          <Link href="/dashboard/plans">
            <Button variant="link" size="sm" className="h-auto p-0">
              <Crown className="h-3 w-3 mr-1" />
              {currentPlan === "premium" ? "Manage Plan" : "Upgrade"}
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
          <TabsTrigger value="shop">Shop Information</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleProfileSubmit}>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={profileData?.name} onChange={handleProfileChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData?.email}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number">Phone Number</Label>
                  <Input id="number" name="number" value={profileData?.number} onChange={handleProfileChange} required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <form onSubmit={handlePasswordSubmit}>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  {passwordError && (
                    <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  disabled={isLoading || passwordData.newPassword !== passwordData.confirmPassword || !passwordData.newPassword}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="shop">
          <Card>
            <form onSubmit={handleShopSubmit}>
              <CardHeader>
                <CardTitle>Shop Information</CardTitle>
                <CardDescription>Update your shop/agro details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input id="shopName" name="name" value={shopData.name} onChange={handleShopChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopAddress">Address</Label>
                  <Input id="shopAddress" name="address" value={shopData.address} onChange={handleShopChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopNumber">Phone Number</Label>
                  <Input
                    id="shopNumber"
                    name="number"
                    value={shopData.number}
                    onChange={handleShopChange}
                    required
                    disabled // <-- Make the field disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopEmail">Email</Label>
                  <Input id="shopEmail" name="email" type="email" value={shopData.email} onChange={handleShopChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopGst">GST</Label>
                  <Input id="shopGst" name="gst" value={shopData.gst} onChange={handleShopChange} required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Shop Info"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

