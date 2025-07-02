"use client"

import type React from "react"

import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { PlanBadge } from "@/components/dashboard/plan-badge"
import Link from "next/link"
import { Crown, User, Mail, Phone, Lock, Store, MapPin, Hash } from "lucide-react"
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

  // --- Formik Validation Schemas ---
  const profileSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    number: Yup.string().required("Phone number is required"),
  })

  const passwordSchema = Yup.object({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string().min(6, "At least 6 characters").required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm your new password"),
  })

  const shopSchema = Yup.object({
    name: Yup.string().required("Owner name is required"),
    email: Yup.string().email("Invalid email").required("Owner email is required"),
    number: Yup.string().required("Owner phone is required"),
    shop: Yup.object({
      name: Yup.string().required("Shop name is required"),
      address: Yup.string().required("Shop address is required"),
      number: Yup.string().required("Shop phone is required"),
      email: Yup.string().email("Invalid email").required("Shop email is required"),
      gst: Yup.string().required("GST is required"),
    }),
  })

  // --- Data Fetch ---
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

  // --- Submit Handlers (Formik values, not events) ---
  const handleProfileSubmit = async (values: { name: string; email: string; number: string }) => {
    try {
      setIsLoading(true)
      const res = await serverUpdateUser({ ...values, _id: user?._id, number: Number(values.number) });
      if (res?.success) {
        updateUser({
          ...values,
          number: Number(values.number)
        })
        if (Number(user?.number) === Number(owner?.number)) {
          const newOwnerData = {
            ...owner,
            name: values.name,
            email: values.email,
            number: Number(values.number),
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

  const handlePasswordSubmit = async (values: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      setPasswordError("New password and confirmation do not match")
      return
    }
    try {
      setIsLoading(true)
      await serverUpdateUserPasswordByCurrent({
        _id: user?._id ?? '',
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
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

  const handleShopSubmit = async (values: any) => {
    try {
      setIsLoading(true)
      const res = await serverUpdateOwner({
        ...owner,
        name: values?.name ?? "",
        email: values?.email ?? "",
        number: Number(values?.number) ?? 0,
        shop: {
          ...values.shop,
          number: Number(values.shop.number),
          _id: owner?.shop?._id ?? "",
          address: values.shop.address ?? "",
          gst: values.shop.gst ?? "",
        },
      })
      if (res?.success) {
        updateOwner({
          ...owner,
          name: values?.name ?? "",
          email: values?.email ?? "",
          number: Number(values?.number) ?? 0,
          shop: {
            ...values.shop,
            number: Number(values.shop.number),
            _id: owner?.shop?._id ?? "",
            address: values.shop.address ?? "",
            gst: values.shop.gst ?? "",
          },
        })
        if (Number(user?.number) === Number(owner?.number)) {
          updateUser({
            ...user,
            name: values?.name ?? "",
            email: values?.email ?? "",
            number: Number(values?.number ?? 0),
          })
        }
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Error updating shop:", error)
      setIsLoading(false)
    }
  }

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
            <Formik
              initialValues={profileData}
              validationSchema={profileSchema}
              enableReinitialize
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                await handleProfileSubmit(values)
                setSubmitting(false)
                resetForm({ values })
              }}
            >
              {({ isSubmitting, dirty, isValid }) => (
                <Form>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Profile Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field as={Input} id="name" name="name" placeholder="Full Name" className="pl-8" />
                        </div>
                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field as={Input} id="email" name="email" type="email" placeholder="Email" className="pl-8" />
                        </div>
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="number">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field as={Input} id="number" name="number" placeholder="Phone Number" className="pl-8" />
                        </div>
                        <ErrorMessage name="number" component="div" className="text-red-500 text-sm" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !dirty || !isValid}
                      className="w-full"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </Form>
              )}
            </Formik>
          </Card>
        )}

        {activeSection === "password" && (
          <Card className="rounded-xl w-full mb-6 border">
            <Formik
              initialValues={passwordData}
              validationSchema={passwordSchema}
              enableReinitialize
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                await handlePasswordSubmit(values)
                setSubmitting(false)
                resetForm()
              }}
            >
              {({ isSubmitting, dirty, isValid }) => (
                <Form>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Change Password</CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field as={Input} id="currentPassword" name="currentPassword" type="password" placeholder="Current Password" className="pl-8" />
                        </div>
                        <ErrorMessage name="currentPassword" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field as={Input} id="newPassword" name="newPassword" type="password" placeholder="New Password" className="pl-8" />
                        </div>
                        <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field as={Input} id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm New Password" className="pl-8" />
                        </div>
                        <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !dirty || !isValid}
                      className="w-full"
                    >
                      {isSubmitting ? "Updating..." : "Update Password"}
                    </Button>
                  </CardFooter>
                </Form>
              )}
            </Formik>
          </Card>
        )}

        {activeSection === "shop" && (
          <Card className="rounded-xl w-full mb-6 border">
            <Formik
              initialValues={shopData}
              validationSchema={shopSchema}
              enableReinitialize
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                await handleShopSubmit(values)
                setSubmitting(false)
                resetForm({ values })
              }}
            >
              {({ isSubmitting, dirty, isValid }) => (
                <Form>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Shop & Owner Information</CardTitle>
                    <CardDescription>Update your shop and owner details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Owner Information */}
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base mb-2">Owner Information</h3>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ownerName">Owner Name</Label>
                          <div className="relative">
                            <User className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Field as={Input} id="ownerName" name="name" placeholder="Owner Name" className="pl-8" />
                          </div>
                          <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ownerEmail">Owner Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Field as={Input} id="ownerEmail" name="email" type="email" placeholder="Owner Email" className="pl-8" />
                          </div>
                          <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ownerNumber">Owner Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Field as={Input} id="ownerNumber" name="number" placeholder="Owner Phone Number" className="pl-8" />
                          </div>
                          <ErrorMessage name="number" component="div" className="text-red-500 text-sm" />
                        </div>
                      </div>
                    </div>
                    <Separator />
                    {/* Shop Information */}
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base mb-2">Shop Information</h3>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="shopName">Shop Name</Label>
                          <div className="relative">
                            <Store className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Field as={Input} id="shopName" name="shop.name" placeholder="Shop Name" className="pl-8" />
                          </div>
                          <ErrorMessage name="shop.name" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shopAddress">Address</Label>
                          <div className="relative">
                            <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Field as={Input} id="shopAddress" name="shop.address" placeholder="Shop Address" className="pl-8" />
                          </div>
                          <ErrorMessage name="shop.address" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shopNumber">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Field as={Input} id="shopNumber" name="shop.number" placeholder="Shop Phone Number" className="pl-8" />
                          </div>
                          <ErrorMessage name="shop.number" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shopEmail">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Field as={Input} id="shopEmail" name="shop.email" type="email" placeholder="Shop Email" className="pl-8" />
                          </div>
                          <ErrorMessage name="shop.email" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shopGst">GST</Label>
                          <div className="relative">
                            <Hash className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Field as={Input} id="shopGst" name="shop.gst" placeholder="GST" className="pl-8" />
                          </div>
                          <ErrorMessage name="shop.gst" component="div" className="text-red-500 text-sm" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !dirty || !isValid}
                      className="w-full"
                    >
                      {isSubmitting ? "Saving..." : "Save Shop & Owner Info"}
                    </Button>
                  </CardFooter>
                </Form>
              )}
            </Formik>
          </Card>
        )}
      </div>
    </div>
  )
}

