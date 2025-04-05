"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ShoppingBag } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { z } from "zod"

// Form validation schemas
const ownerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be valid"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const shopSchema = z.object({
  shopName: z.string().min(2, "Shop name must be at least 2 characters"),
  address: z.string().min(5, "Please enter a valid address"),
  shopPhone: z.string().min(10, "Phone number must be valid"),
  shopEmail: z.string().email("Please enter a valid email"),
  gstNumber: z.string().optional()
});

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
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setOwnerData(prev => ({ ...prev, [name]: value }))
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleShopChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setShopData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateOwnerData = () => {
    try {
      ownerSchema.parse(ownerData)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const validateShopData = () => {
    try {
      shopSchema.parse(shopData)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleNext = () => {
    if (validateOwnerData()) {
      setActiveTab("shop")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateShopData()) return

    setIsLoading(true)
    try {
      // API call would go here
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ownerData, ...shopData })
      });
      
      if (!response.ok) throw new Error('Registration failed');
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!",
        variant: "default"
      })
      
      // Redirect to dashboard with small delay
      setTimeout(() => router.push("/dashboard/my-shop"), 1500)
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <Link href="/" className="absolute left-8 top-8 flex items-center gap-2 hover:opacity-80 transition-opacity">
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
              <TabsTrigger value="shop" disabled={!ownerData.name}>Shop Details</TabsTrigger>
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
                    disabled={isLoading}
                    className={errors.name ? "border-red-500" : ""}
                    required
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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
                    disabled={isLoading}
                    className={errors.email ? "border-red-500" : ""}
                    required
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+91 9876543210"
                    value={ownerData.phone}
                    onChange={handleOwnerChange}
                    disabled={isLoading}
                    className={errors.phone ? "border-red-500" : ""}
                    required
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={ownerData.password}
                    onChange={handleOwnerChange}
                    disabled={isLoading}
                    className={errors.password ? "border-red-500" : ""}
                    required
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={ownerData.confirmPassword}
                    onChange={handleOwnerChange}
                    disabled={isLoading}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                    required
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleNext} 
                  disabled={isLoading}
                  type="button"
                >
                  Next
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
                    placeholder="My Agro Shop"
                    value={shopData.shopName}
                    onChange={handleShopChange}
                    disabled={isLoading}
                    className={errors.shopName ? "border-red-500" : ""}
                    required
                  />
                  {errors.shopName && <p className="text-sm text-red-500">{errors.shopName}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Shop Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main St, City"
                    value={shopData.address}
                    onChange={handleShopChange}
                    disabled={isLoading}
                    className={errors.address ? "border-red-500" : ""}
                    required
                  />
                  {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shopPhone">Shop Phone</Label>
                  <Input
                    id="shopPhone"
                    name="shopPhone"
                    placeholder="+91 1234567890"
                    value={shopData.shopPhone}
                    onChange={handleShopChange}
                    disabled={isLoading}
                    className={errors.shopPhone ? "border-red-500" : ""}
                    required
                  />
                  {errors.shopPhone && <p className="text-sm text-red-500">{errors.shopPhone}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shopEmail">Shop Email</Label>
                  <Input
                    id="shopEmail"
                    name="shopEmail"
                    type="email"
                    placeholder="shop@example.com"
                    value={shopData.shopEmail}
                    onChange={handleShopChange}
                    disabled={isLoading}
                    className={errors.shopEmail ? "border-red-500" : ""}
                    required
                  />
                  {errors.shopEmail && <p className="text-sm text-red-500">{errors.shopEmail}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                  <Input
                    id="gstNumber"
                    name="gstNumber"
                    placeholder="22AAAAA0000A1Z5"
                    value={shopData.gstNumber}
                    onChange={handleShopChange}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("owner")}
                  disabled={isLoading}
                  className="flex-1"
                  type="button"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Account"}
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </form>
      </Card>
      
      <p className="mt-4 text-sm text-gray-500">
        Already have an account? <Link href="/auth/login" className="text-primary hover:underline">Login</Link>
      </p>
    </div>
  )
}

