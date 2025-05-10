"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag } from "lucide-react"
import { serverLogin } from "@/services/serverApi"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import LoginImage from "@/assets/images/Galcon_Login_Image.png"

export default function LoginPage() {
  const { login } = useAuth();
  const [number, setNumber] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      setIsLoading(true)
      const res = await serverLogin({ number: Number(number), password });
      console.log("Login response:", res)
      
      if (res?.success) {
        login(res?.user, res?.owner)
      } else {
        // Handle server response with error message
        setError(res?.response?.data?.message || "Invalid credentials. Please try again.")
      }
      setIsLoading(false)
    } catch (error: any) {
      setIsLoading(false)
      console.error("Login error:", error)
      setError(error?.response?.data?.message || "An error occurred while logging in. Please try again.")
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Logo at the top */}
      <Link href="/" className="absolute left-8 top-8 flex items-center gap-2 z-10">
        <ShoppingBag className="h-6 w-6" />
        <span className="font-bold">AgroBill</span>
      </Link>

      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-base">Login to manage your agro shop</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="border-red-500 bg-red-50 text-red-800">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="number" className="text-sm font-medium">Phone Number</Label>
                <Input
                  id="number"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 px-6 pt-2">
              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Sign In"}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have a shop yet?{" "}
                <Link href="/register" className="text-primary font-medium hover:underline">
                  Register Your Shop
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-green-50 to-green-100">
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="relative w-full h-full max-w-2xl">
            <Image 
              src={LoginImage} 
              alt="Agro Shop Management" 
              fill
              priority
              className="object-contain rounded-lg shadow-lg"
            />
          </div>
          <div className="absolute bottom-10 left-10 bg-white/80 backdrop-blur-sm p-4 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold text-green-800">Manage Your Agro Business</h3>
            <p className="text-sm text-gray-700">Access inventory, track sales, and grow your agricultural business with AgroBill.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

