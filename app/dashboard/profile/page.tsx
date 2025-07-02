"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { PlanBadge } from "@/components/dashboard/plan-badge"
import Link from "next/link"
import { Crown } from "lucide-react"
import { usePlan } from "@/components/dashboard/plan-context"
import { useAuth } from "@/components/auth-provider"
import { serverUpdateOwner, serverUpdateUser, serverUpdateUserPasswordByCurrent } from "@/services/serverApi"

export default function ProfilePage() {
  const { currentPlan } = usePlan()
  const { user, updateUser, owner, updateOwner } = useAuth();
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
    email: "",
    number: "",
    shop: {
      name: "",
      address: "",
      number: "",
      email: "",
      gst: ""
    }
  })
  const [activeSection, setActiveSection] = useState<"profile" | "password" | "shop">("profile")

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
    if (passwordError) {
      setPasswordError("")
    }
  }

  const handleShopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShopData((prev) => ({ ...prev, shop: { ...prev.shop, [name]: value } }))
  }

  const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShopData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await serverUpdateUser({ ...profileData, _id: user?._id, number: Number(profileData.number) });
      if (res?.success) {
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
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New password and confirmation do not match")
      return
    }
    try {
      setIsLoading(true)
      await serverUpdateUserPasswordByCurrent({
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
      const res = await serverUpdateOwner({
        ...owner,
        name: shopData?.name ?? "",
        email: shopData?.email ?? "",
        number: Number(shopData?.number) ?? 0,
        shop: {
          ...shopData.shop,
          number: Number(shopData.shop.number),
          _id: owner?.shop?._id ?? "",
          address: shopData.shop.address ?? "",
          gst: shopData.shop.gst ?? "",
        },
      })
      if (res?.success) {
        updateOwner({
          ...owner,
          name: shopData?.name ?? "",
          email: shopData?.email ?? "",
          number: Number(shopData?.number) ?? 0,
          shop: {
            ...shopData.shop,
            number: Number(shopData.shop.number),
            _id: owner?.shop?._id ?? "",
            address: shopData.shop.address ?? "",
            gst: shopData.shop.gst ?? "",
          },
        })
        if (Number(user?.number) === Number(owner?.number)) {
          updateUser({
            ...user,
            name: shopData?.name ?? "",
            email: shopData?.email ?? "",
            number: Number(shopData?.number ?? 0),
          })
        }
      }
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
      name: owner?.name ?? '',
      email: owner?.email ?? '',
      number: String(owner?.number) ?? '',
      shop: {
        name: owner?.shop?.name ?? '',
        address: owner?.shop?.address ?? '',
        number: String(owner?.shop?.number) ?? '',
        email: owner?.shop?.email ?? '',
        gst: owner?.shop?.gst ?? ''
      }
    })
  }

  useEffect(() => {
    fetchProfileData()
  }, [user])

  return (
    <div className="w-full h-full flex flex-col lg:flex-row items-stretch py-4 px-1 sm:px-4">
      {/* Sidebar/Profile Summary */}
      <aside className="w-full lg:w-1/3 xl:w-1/4 border h-auto lg:h-full rounded-xl flex flex-col items-center p-4 sm:p-6 mb-4 lg:mb-0 lg:mr-8">
        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mb-3 ring-2 ring-primary">
          <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
          <AvatarFallback className="uppercase text-xl sm:text-2xl">
            {(user?.name?.[0] ?? '') + (user?.name?.[1] ?? '')}
          </AvatarFallback>
        </Avatar>
        <div className="font-semibold text-base sm:text-lg">{user?.name}</div>
        <div className="text-xs text-gray-500">{user?.email}</div>
        <Button variant="outline" size="sm" className="mt-3 mb-2 w-full">
          Change Avatar
        </Button>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <PlanBadge />
          <Link href="/dashboard/plans">
            <Button variant="link" size="sm" className="h-auto p-0">
              <Crown className="h-3 w-3 mr-1" />
              {currentPlan === "premium" ? "Manage Plan" : "Upgrade"}
            </Button>
          </Link>
        </div>
        <nav className="flex flex-row lg:flex-col gap-2 w-full mt-6 sm:mt-8">
          <button
            className={`flex-1 px-3 py-2 rounded-lg text-center text-xs sm:text-sm font-medium transition border ${
              activeSection === "profile"
                ? "bg-primary text-white"
                : "transparent"
            }`}
            onClick={() => setActiveSection("profile")}
          >
            Profile
          </button>
          <button
            className={`flex-1 px-3 py-2 rounded-lg text-center text-xs sm:text-sm font-medium transition border ${
              activeSection === "password"
                ? "bg-primary text-white"
                : "transparent"
            }`}
            onClick={() => setActiveSection("password")}
          >
            Password
          </button>
          <button
            className={`flex-1 px-3 py-2 rounded-lg text-center text-xs sm:text-sm font-medium transition border ${
              activeSection === "shop"
                ? "bg-primary text-white"
                : "transparent"
            }`}
            onClick={() => setActiveSection("shop")}
          >
            Shop
          </button>
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 w-full mx-auto h-full max-h-screen pr-0 sm:pr-2">
        {activeSection === "profile" && (
          <Card className="rounded-xl w-full mb-6 border">
            <form onSubmit={handleProfileSubmit}>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={profileData?.name} onChange={handleProfileChange} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={profileData?.email} onChange={handleProfileChange} required />
                  </div>
                  <div>
                    <Label htmlFor="number">Phone Number</Label>
                    <Input id="number" name="number" value={profileData?.number} onChange={handleProfileChange} required />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {activeSection === "password" && (
          <Card className="rounded-xl w-full mb-6 border">
            <form onSubmit={handlePasswordSubmit}>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                    {passwordError && (
                      <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading || passwordData.newPassword !== passwordData.confirmPassword || !passwordData.newPassword} className="w-full">
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {activeSection === "shop" && (
          <Card className="rounded-xl w-full mb-6 border">
            <form onSubmit={handleShopSubmit}>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Shop & Owner Information</CardTitle>
                <CardDescription>Update your shop and owner details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Owner Information */}
                <div>
                  <h3 className="font-semibold text-sm sm:text-base mb-2">Owner Information</h3>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="ownerName">Owner Name</Label>
                      <Input
                        id="ownerName"
                        name="name"
                        value={shopData?.name ?? ""}
                        onChange={handleOwnerChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="ownerEmail">Owner Email</Label>
                      <Input
                        id="ownerEmail"
                        name="email"
                        type="email"
                        value={shopData?.email ?? ""}
                        onChange={handleOwnerChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="ownerNumber">Owner Phone Number</Label>
                      <Input
                        id="ownerNumber"
                        name="number"
                        value={shopData?.number ?? ""}
                        onChange={handleOwnerChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <Separator />
                {/* Shop Information */}
                <div>
                  <h3 className="font-semibold text-sm sm:text-base mb-2">Shop Information</h3>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="shopName">Shop Name</Label>
                      <Input id="shopName" name="name" value={shopData?.shop?.name} onChange={handleShopChange} required />
                    </div>
                    <div>
                      <Label htmlFor="shopAddress">Address</Label>
                      <Input id="shopAddress" name="address" value={shopData?.shop?.address} onChange={handleShopChange} required />
                    </div>
                    <div>
                      <Label htmlFor="shopNumber">Phone Number</Label>
                      <Input id="shopNumber" name="number" value={shopData?.shop?.number} onChange={handleShopChange} required />
                    </div>
                    <div>
                      <Label htmlFor="shopEmail">Email</Label>
                      <Input id="shopEmail" name="email" type="email" value={shopData?.shop?.email} onChange={handleShopChange} required />
                    </div>
                    <div>
                      <Label htmlFor="shopGst">GST</Label>
                      <Input id="shopGst" name="gst" value={shopData?.shop?.gst} onChange={handleShopChange} required />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Saving..." : "Save Shop & Owner Info"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}

