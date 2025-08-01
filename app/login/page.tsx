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
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShoppingBag, ArrowRight, Phone, Lock, EyeOff, Eye } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { serverLogin } from "@/services/serverApi"
import LoginImage from "@/assets/images/Galcon_Login_Image.png"

const loginSchema = Yup.object().shape({
  number: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
})

export default function LoginPage() {
  const { login } = useAuth()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: { number: string; password: string }) => {
    setError(null)
    try {
      setIsLoading(true)
      const res = await serverLogin({
        number: Number(values.number),
        password: values.password,
      })
      if (res?.success) {
        login(res?.user, res?.owner)
      } else {
        setError(res?.response?.data?.message || "Invalid credentials. Please try again.")
      }
    } catch (error: any) {
      setError(error?.response?.data?.message || "An error occurred while logging in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background transition-colors">
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
      <div className="w-full lg:w-1/3 relative flex flex-col justify-center px-8 py-12 lg:px-16">
        <Link href="/" className="absolute left-8 top-8 flex items-center gap-2">
          <div className="bg-green-500 p-2 rounded-lg">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-foreground">AgroBill</span>
        </Link>

        <div className="w-full max-w-md mx-auto mt-12">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-3 text-foreground">Sign in to AgroBill</h1>
            <div className="h-1 w-12 bg-green-500 rounded-full mb-3"></div>
            <p className="text-slate-500 text-muted-foreground">Manage your agro business smarter, not harder</p>
          </div>

          <Formik
            initialValues={{ number: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 border-l-4 border-red-500">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="number" className="text-foreground">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Field
                      as={Input}
                      id="number"
                      name="number"
                      type="tel"
                      placeholder="Enter your phone number"
                      className="w-full pl-12 h-12"
                    />
                  </div>
                  <ErrorMessage name="number" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full pl-12 h-12"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                      className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 font-medium"
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
                    <div className="flex-grow border-t"></div>
                    <span className="flex-shrink mx-3 text-slate-400 dark:text-slate-500 text-sm">Don't have an account?</span>
                    <div className="flex-grow border-t"></div>
                  </div>

                  <div className="mt-4 text-center">
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-green-600 rounded-lg text-green-600 dark:text-green-400 font-medium hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
                    >
                      Register Your Shop
                    </Link>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}



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
//       if (res?.success) {
//         login(res?.user, res?.owner)
//       } else {
//         setError(res?.response?.data?.message || "Invalid credentials. Please try again.")
//       }
//       setIsLoading(false)
//     } catch (error: any) {
//       setIsLoading(false)
//       setError(error?.response?.data?.message || "An error occurred while logging in. Please try again.")
//     }
//   }

//   return (
//     <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
//       {/* Logo at the top */}
//       <Link href="/" className="absolute left-8 top-8 flex items-center gap-2 z-10">
//         <ShoppingBag className="h-6 w-6 text-green-700 dark:text-green-400" />
//         <span className="font-bold text-slate-900 dark:text-white">AgroBill</span>
//       </Link>

//       {/* Left Side - Login Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//         <Card className="w-full max-w-md border-none shadow-none bg-white dark:bg-slate-800 transition-colors">
//           <CardHeader>
//             <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</CardTitle>
//             <CardDescription className="text-base text-slate-600 dark:text-slate-300">Login to manage your agro shop</CardDescription>
//           </CardHeader>
//           <form onSubmit={handleSubmit}>
//             <CardContent className="space-y-4">
//               {error && (
//                 <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200">
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}
//               <div className="space-y-2">
//                 <Label htmlFor="number" className="text-sm font-medium text-slate-700 dark:text-slate-200">Phone Number</Label>
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
//                   <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</Label>
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
//       <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
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
//           <div className="absolute bottom-10 left-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg max-w-md">
//             <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Manage Your Agro Business</h3>
//             <p className="text-sm text-gray-700 dark:text-gray-200">Access inventory, track sales, and grow your agricultural business with AgroBill.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }