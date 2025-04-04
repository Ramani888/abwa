"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag } from "lucide-react"
import { serverLogin } from "@/services/serverApi"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <Link href="/" className="absolute left-8 top-8 flex items-center gap-2">
        <ShoppingBag className="h-6 w-6" />
        <span className="font-bold">AgroBill</span>
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login to Your Shop</CardTitle>
          <CardDescription>Enter your credentials to access your agro shop</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="border-red-500 bg-red-50 text-red-800">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="number">Number</Label>
              <Input
                id="number"
                type="tel"
                placeholder="Enter your number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login to My Shop"}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have a shop yet?{" "}
              <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                Register Your Shop
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

