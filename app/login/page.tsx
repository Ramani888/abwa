// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { ShoppingBag } from "lucide-react"
// import { serverLogin } from "@/services/serverApi"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useAuth } from "@/components/auth-provider"
// import LoginImage from "@/assets/images/Galcon_Login_Image.png"

// export default function LoginPage() {
//   const { login } = useAuth();
//   const [number, setNumber] = useState("")
//   const [password, setPassword] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)

//     try {
//       setIsLoading(true)
//       const res = await serverLogin({ number: Number(number), password });
//       console.log("Login response:", res)
      
//       if (res?.success) {
//         login(res?.user, res?.owner)
//       } else {
//         // Handle server response with error message
//         setError(res?.response?.data?.message || "Invalid credentials. Please try again.")
//       }
//       setIsLoading(false)
//     } catch (error: any) {
//       setIsLoading(false)
//       console.error("Login error:", error)
//       setError(error?.response?.data?.message || "An error occurred while logging in. Please try again.")
//     }
//   }

//   return (
//     <div className="flex min-h-screen bg-white">
//       {/* Logo at the top */}
//       <Link href="/" className="absolute left-8 top-8 flex items-center gap-2 z-10">
//         <ShoppingBag className="h-6 w-6" />
//         <span className="font-bold">AgroBill</span>
//       </Link>

//       {/* Left Side - Login Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//         <Card className="w-full max-w-md border-none shadow-none">
//           <CardHeader>
//             <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
//             <CardDescription className="text-base">Login to manage your agro shop</CardDescription>
//           </CardHeader>
//           <form onSubmit={handleSubmit}>
//             <CardContent className="space-y-4">
//               {error && (
//                 <Alert variant="destructive" className="border-red-500 bg-red-50 text-red-800">
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}
//               <div className="space-y-2">
//                 <Label htmlFor="number" className="text-sm font-medium">Phone Number</Label>
//                 <Input
//                   id="number"
//                   type="tel"
//                   placeholder="Enter your phone number"
//                   value={number}
//                   onChange={(e) => setNumber(e.target.value)}
//                   className="h-11"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label htmlFor="password" className="text-sm font-medium">Password</Label>
//                   <Link href="/forgot-password" className="text-sm text-primary hover:underline">
//                     Forgot password?
//                   </Link>
//                 </div>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="h-11"
//                   required
//                 />
//               </div>
//             </CardContent>
//             <CardFooter className="flex flex-col space-y-4 px-6 pt-2">
//               <Button type="submit" className="w-full h-11" disabled={isLoading}>
//                 {isLoading ? "Logging in..." : "Sign In"}
//               </Button>
//               <div className="text-center text-sm">
//                 Don&apos;t have a shop yet?{" "}
//                 <Link href="/register" className="text-primary font-medium hover:underline">
//                   Register Your Shop
//                 </Link>
//               </div>
//             </CardFooter>
//           </form>
//         </Card>
//       </div>

//       {/* Right Side - Image */}
//       <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-green-50 to-green-100">
//         <div className="absolute inset-0 flex items-center justify-center p-10">
//           <div className="relative w-full h-full max-w-2xl">
//             <Image 
//               src={LoginImage} 
//               alt="Agro Shop Management" 
//               fill
//               priority
//               className="object-contain rounded-lg shadow-lg"
//             />
//           </div>
//           <div className="absolute bottom-10 left-10 bg-white/80 backdrop-blur-sm p-4 rounded-lg max-w-md">
//             <h3 className="text-lg font-semibold text-green-800">Manage Your Agro Business</h3>
//             <p className="text-sm text-gray-700">Access inventory, track sales, and grow your agricultural business with AgroBill.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingBag, ArrowRight, Lock, Phone } from "lucide-react"
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
    <div className="flex min-h-screen bg-slate-50">
      {/* Right Side - Image Only */}
      <div className="hidden lg:block lg:w-2/3 relative">
        <Image 
          src={LoginImage} 
          alt="Agro Shop Management" 
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-800/30 to-transparent"></div>
      </div>

      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/3 relative flex flex-col justify-center px-8 py-12 lg:px-16 bg-white shadow-2xl shadow-slate-200/50">
        <Link href="/" className="absolute left-8 top-8 flex items-center gap-2">
          <div className="bg-green-500 p-2 rounded-lg">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl">AgroBill</span>
        </Link>
        
        <div className="w-full max-w-md mx-auto mt-12">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-3">Sign in to AgroBill</h1>
            <div className="h-1 w-12 bg-green-500 rounded-full mb-3"></div>
            <p className="text-slate-500">Manage your agro business smarter, not harder</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-50 text-red-800 border-l-4 border-red-500">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-1.5">
              <Label htmlFor="number" className="text-sm font-medium text-slate-700">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  id="number"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="pl-12 h-12 rounded-lg border-slate-200 bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <Link href="/forgot-password" className="text-sm text-green-600 font-medium hover:text-green-700">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-12 rounded-lg border-slate-200 bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg shadow-green-600/30" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
            
            <div className="pt-4">
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-slate-400 text-sm">Don't have an account?</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
              
              <div className="mt-4 text-center">
                <Link 
                  href="/register" 
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-green-600 rounded-lg text-green-600 font-medium hover:bg-green-50 transition-colors"
                >
                  Register Your Shop
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}