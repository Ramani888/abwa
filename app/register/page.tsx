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




// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { ShoppingBag, ArrowRight, User, Mail, Phone, Lock, Building, MapPin } from "lucide-react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import RegisterImage from "@/assets/images/Galcon_Login_Image.png"
// import { serverRegister } from "@/services/serverApi"

// export default function RegisterPage() {
//   const [activeTab, setActiveTab] = useState("owner")
//   const [ownerData, setOwnerData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   })
//   const [shopData, setShopData] = useState({
//     shopName: "",
//     address: "",
//     shopPhone: "",
//     shopEmail: "",
//     gstNumber: "",
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const router = useRouter()

//   const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setOwnerData((prev) => ({ ...prev, [name]: value }))
//     if (error) setError(null)
//   }

//   const handleShopChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setShopData((prev) => ({ ...prev, [name]: value }))
//     if (error) setError(null)
//   }

//   const validateForm = () => {
//     // Password validation
//     if (ownerData.password !== ownerData.confirmPassword) {
//       setError("Passwords don't match")
//       return false
//     }
    
//     if (ownerData.password.length < 8) {
//       setError("Password must be at least 8 characters")
//       return false
//     }
    
//     return true
//   }

//   const nextStep = () => {
//     if (validateForm()) {
//       setActiveTab("shop")
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!validateForm()) return
    
//     setIsLoading(true)
//     setError(null)

//     try {
//       // Uncomment and adjust when API is ready
//       // const response = await serverRegister({
//       //   ...ownerData, 
//       //   ...shopData,
//       //   number: Number(ownerData.phone),
//       //   shopNumber: Number(shopData.shopPhone)
//       // })
      
//       // if (response?.success) {
//       //   router.push("/dashboard/my-shop")
//       // } else {
//       //   throw new Error(response?.message || "Registration failed")
//       // }
      
//       // Simulating successful registration
//       setTimeout(() => {
//         setIsLoading(false)
//         router.push("/dashboard/my-shop")
//       }, 1500)
//     } catch (error: any) {
//       setIsLoading(false)
//       setError(error?.response?.data?.message || "Registration failed. Please try again.")
//       console.error("Registration error:", error)
//     }
//   }

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       {/* Left Side - Image Only */}
//       <div className="hidden lg:block lg:w-2/3 relative">
//         <Image 
//           src={RegisterImage} 
//           alt="Agro Shop Registration" 
//           fill
//           priority
//           className="object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-br from-green-800/30 to-transparent"></div>
//       </div>

//       {/* Right Side - Registration Form */}
//       <div className="w-full lg:w-1/3 relative flex flex-col justify-center px-8 py-12 lg:px-16 bg-white shadow-2xl shadow-slate-200/50">
//         <Link href="/" className="absolute left-8 top-8 flex items-center gap-2">
//           <div className="bg-green-500 p-2 rounded-lg">
//             <ShoppingBag className="h-5 w-5 text-white" />
//           </div>
//           <span className="font-bold text-xl">AgroBill</span>
//         </Link>
        
//         <div className="w-full max-w-md mx-auto mt-12">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold mb-3">Create Your Shop</h1>
//             <div className="h-1 w-12 bg-green-500 rounded-full mb-3"></div>
//             <p className="text-slate-500">Register as a shop owner and start managing your agro business</p>
//           </div>
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {error && (
//               <Alert variant="destructive" className="bg-red-50 text-red-800 border-l-4 border-red-500">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}
            
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//               <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-lg">
//                 <TabsTrigger 
//                   value="owner"
//                   className="rounded-md data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm py-2"
//                 >
//                   Owner Details
//                 </TabsTrigger>
//                 <TabsTrigger 
//                   value="shop"
//                   className="rounded-md data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm py-2"
//                 >
//                   Shop Details
//                 </TabsTrigger>
//               </TabsList>
              
//               <TabsContent value="owner" className="space-y-5 pt-2">
//                 <div className="space-y-1.5">
//                   <Label htmlFor="name" className="text-sm font-medium text-slate-700">
//                     Full Name
//                   </Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
//                     <Input
//                       id="name"
//                       name="name"
//                       placeholder="John Doe"
//                       value={ownerData.name}
//                       onChange={handleOwnerChange}
//                       className="pl-12 h-12 rounded-lg border-slate-200 bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <div className="space-y-1.5">
//                   <Label htmlFor="email" className="text-sm font-medium text-slate-700">
//                     Email
//                   </Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       placeholder="name@example.com"
//                       value={ownerData.email}
//                       onChange={handleOwnerChange}
//                       className="pl-12 h-12 rounded-lg border-slate-200 bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <div className="space-y-1.5">
//                   <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
//                     Phone Number
//                   </Label>
//                   <div className="relative">
//                     <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
//                     <Input
//                       id="phone"
//                       name="phone"
//                       placeholder="Enter your phone number"
//                       value={ownerData.phone}
//                       onChange={handleOwnerChange}
//                       className="pl-12 h-12 rounded-lg border-slate-200 bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <div className="space-y-1.5">
//                   <Label htmlFor="password" className="text-sm font-medium text-slate-700">
//                     Password
//                   </Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
//                     <Input
//                       id="password"
//                       name="password"
//                       type="password"
//                       placeholder="Create a strong password"
//                       value={ownerData.password}
//                       onChange={handleOwnerChange}
//                       className="pl-12 h-12 rounded-lg border-slate-200 bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <div className="space-y-1.5">
//                   <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
//                     Confirm Password
//                   </Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
//                     <Input
//                       id="confirmPassword"
//                       name="confirmPassword"
//                       type="password"
//                       placeholder="Confirm your password"
//                       value={ownerData.confirmPassword}
//                       onChange={handleOwnerChange}
//                       className="pl-12 h-12 rounded-lg border-slate-200 bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <Button 
//                   type="button" 
//                   onClick={nextStep}
//                   className="w-full h-12 mt-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg shadow-green-600/30"
//                 >
//                   <div className="flex items-center justify-center gap-2">
//                     <span>Continue</span>
//                     <ArrowRight className="h-4 w-4" />
//                   </div>
//                 </Button>
//               </TabsContent>
              
//               <TabsContent value="shop" className="space-y-5 pt-2">
//                 <div className="space-y-1.5">
//                   <Label htmlFor="shopName" className="text-sm font-medium text-slate-700">
//                     Shop Name
//                   </Label>
//                   <div className="relative">
//                     <Building className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
//                     <Input
//                       id="shopName"
//                       name="shopName"
//                       placeholder="Green Harvest Agro Shop"
//                       value={shopData.shopName}
//                       onChange={handleShopChange}
//                       className="pl-12 h-12 rounded-lg border-slate-200 bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <div className="space-y-1.5">
//                   <Label htmlFor="address" className="text-sm font-medium text-slate-700">
//                     Shop Address
//                   </Label>
//                   <div className="relative">
//                     <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
//                     <Textarea
//                       id="address"
//                       name="address"
//                       placeholder="123 Farm Road, Agricity"
//                       value={shopData.address}
//                       onChange={handleShopChange}
//                       className="pl-12 pt-3 min-h-[80px] rounded-lg border-slate-200 bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <div className="space-y-1.5">
//                   <Label htmlFor="shopPhone" className="text-sm font-medium text-slate-700">
//                     Shop Phone Number
//                   </Label>
//                   <div className="relative">
//                     <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
//                     <Input
//                       id="shopPhone"
//                       name="shopPhone"
//                       placeholder="Enter shop phone number"
//                       value={shopData.shopPhone}
//                       onChange={handleShopChange}
//                       className="pl-12 h-12 rounded-lg border-slate-200 bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <div className="space-y-1.5">
//                   <Label htmlFor="shopEmail" className="text-sm font-medium text-slate-700">
//                     Shop Email
//                   </Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
//                     <Input
//                       id="shopEmail"
//                       name="shopEmail"
//                       type="email"
//                       placeholder="shop@example.com"
//                       value={shopData.shopEmail}
//                       onChange={handleShopChange}
//                       className="pl-12 h-12 rounded-lg border-slate-200 bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <div className="space-y-1.5">
//                   <Label htmlFor="gstNumber" className="text-sm font-medium text-slate-700">
//                     GST Number (Optional)
//                   </Label>
//                   <Input
//                     id="gstNumber"
//                     name="gstNumber"
//                     placeholder="22AAAAA0000A1Z5"
//                     value={shopData.gstNumber}
//                     onChange={handleShopChange}
//                     className="h-12 rounded-lg border-slate-200 bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
//                   />
//                 </div>
                
//                 <Button 
//                   type="submit" 
//                   className="w-full h-12 mt-3 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg shadow-green-600/30" 
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <div className="flex items-center justify-center gap-2">
//                       <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       <span>Creating Shop...</span>
//                     </div>
//                   ) : (
//                     <div className="flex items-center justify-center gap-2">
//                       <span>Create Your Shop</span>
//                       <ArrowRight className="h-4 w-4" />
//                     </div>
//                   )}
//                 </Button>
                
//                 <div className="pt-4">
//                   <div className="relative flex items-center">
//                     <div className="flex-grow border-t border-slate-200"></div>
//                     <span className="flex-shrink mx-3 text-slate-400 text-sm">Already have an account?</span>
//                     <div className="flex-grow border-t border-slate-200"></div>
//                   </div>
                  
//                   <div className="mt-4 text-center">
//                     <Link 
//                       href="/login" 
//                       className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-green-600 rounded-lg text-green-600 font-medium hover:bg-green-50 transition-colors"
//                     >
//                       Sign In Instead
//                     </Link>
//                   </div>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }